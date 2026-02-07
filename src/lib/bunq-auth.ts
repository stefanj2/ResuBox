/**
 * bunq API Authentication & Session Management
 *
 * Handles:
 * - RSA signing for all API requests
 * - Session token caching with auto-refresh (Supabase-backed for serverless)
 * - Installation/device-server setup
 * - Retry logic for 401/429
 */

import crypto from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// bunq API base URLs
const BUNQ_API_URL = {
  production: 'https://api.bunq.com/v1',
  sandbox: 'https://public-api.sandbox.bunq.com/v1',
};

// Session token cache with expiry tracking
interface SessionCache {
  token: string;
  userId: number;
  expiresAt: number; // timestamp
}

// In-memory cache
let sessionCache: SessionCache | null = null;
let installationToken: string | null = null;
let serverPublicKey: string | null = null;

// Supabase client for distributed session caching
let supabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.warn('[bunq] No Supabase credentials for distributed session caching');
    return null;
  }

  supabaseClient = createClient(url, key);
  return supabaseClient;
}

// Cache key for bunq session in Supabase
const BUNQ_SESSION_CACHE_KEY = 'bunq_session_cache';

/**
 * Get cached session from Supabase (distributed cache)
 */
async function getDistributedSession(): Promise<SessionCache | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('system_cache')
      .select('value, expires_at')
      .eq('key', BUNQ_SESSION_CACHE_KEY)
      .single();

    if (error || !data) return null;

    const expiresAt = new Date(data.expires_at).getTime();
    if (expiresAt <= Date.now()) {
      await supabase.from('system_cache').delete().eq('key', BUNQ_SESSION_CACHE_KEY);
      return null;
    }

    const cached = JSON.parse(data.value) as SessionCache;
    cached.expiresAt = expiresAt;
    return cached;
  } catch (err) {
    console.warn('[bunq] Error reading distributed session cache:', err);
    return null;
  }
}

/**
 * Store session in Supabase (distributed cache)
 */
async function setDistributedSession(session: SessionCache): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;

  try {
    const expiresAt = new Date(session.expiresAt).toISOString();

    await supabase
      .from('system_cache')
      .upsert({
        key: BUNQ_SESSION_CACHE_KEY,
        value: JSON.stringify({ token: session.token, userId: session.userId }),
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'key',
      });

    console.log('[bunq] Session cached in Supabase');
  } catch (err) {
    console.warn('[bunq] Error storing distributed session cache:', err);
  }
}

/**
 * Get the bunq API base URL based on environment
 */
export function getBunqBaseUrl(): string {
  const env = process.env.BUNQ_ENVIRONMENT || 'sandbox';
  return BUNQ_API_URL[env as keyof typeof BUNQ_API_URL] || BUNQ_API_URL.sandbox;
}

/**
 * Get the private key from environment variable (base64-encoded PEM)
 */
function getPrivateKey(): string {
  const base64Key = process.env.BUNQ_PRIVATE_KEY_BASE64;
  if (!base64Key) {
    throw new Error('BUNQ_PRIVATE_KEY_BASE64 environment variable is not set');
  }
  return Buffer.from(base64Key, 'base64').toString('utf-8');
}

/**
 * Get the public key from the private key
 */
function getPublicKeyFromPrivate(): string {
  const privateKey = getPrivateKey();
  const keyObject = crypto.createPrivateKey(privateKey);
  const publicKey = crypto.createPublicKey(keyObject);
  return publicKey.export({ type: 'spki', format: 'pem' }) as string;
}

/**
 * Sign data using RSA-SHA256 with PKCS#1 v1.5 padding
 */
export function signData(data: string): string {
  const privateKey = getPrivateKey();
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(data, 'utf-8');
  sign.end();
  return sign.sign(privateKey, 'base64');
}

/**
 * Verify server response signature
 */
export function verifyServerSignature(
  data: string,
  signature: string,
  publicKey: string
): boolean {
  try {
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(data, 'utf-8');
    verify.end();
    return verify.verify(publicKey, signature, 'base64');
  } catch {
    return false;
  }
}

/**
 * Generate common headers for bunq API requests
 */
function getBaseHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'User-Agent': 'ResuBox/1.0',
    'X-Bunq-Language': 'nl_NL',
    'X-Bunq-Region': 'nl_NL',
    'X-Bunq-Geolocation': '0 0 0 0 000',
    'X-Bunq-Client-Request-Id': crypto.randomUUID(),
  };
}

/**
 * Create installation - registers public key with bunq
 */
async function createInstallation(): Promise<{
  installationToken: string;
  serverPublicKey: string;
}> {
  const baseUrl = getBunqBaseUrl();
  const publicKey = getPublicKeyFromPrivate();

  const payload = JSON.stringify(
    { client_public_key: publicKey },
    null,
    0
  ).replace(/\n/g, '');

  const response = await fetch(`${baseUrl}/installation`, {
    method: 'POST',
    headers: {
      ...getBaseHeaders(),
    },
    body: payload,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to create bunq installation: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();

  let token = '';
  let pubKey = '';

  for (const item of data.Response || []) {
    if (item.Token) {
      token = item.Token.token;
    }
    if (item.ServerPublicKey) {
      pubKey = item.ServerPublicKey.server_public_key;
    }
  }

  if (!token || !pubKey) {
    throw new Error('Invalid installation response: missing token or server public key');
  }

  return {
    installationToken: token,
    serverPublicKey: pubKey,
  };
}

/**
 * Register device-server with bunq
 */
async function registerDeviceServer(instToken: string): Promise<number> {
  const baseUrl = getBunqBaseUrl();
  const apiKey = process.env.BUNQ_API_KEY;

  if (!apiKey) {
    throw new Error('BUNQ_API_KEY environment variable is not set');
  }

  const payload = JSON.stringify({
    description: 'ResuBox CV Builder',
    secret: apiKey,
    permitted_ips: ['*'],
  });

  const signature = signData(payload);

  const response = await fetch(`${baseUrl}/device-server`, {
    method: 'POST',
    headers: {
      ...getBaseHeaders(),
      'X-Bunq-Client-Authentication': instToken,
      'X-Bunq-Client-Signature': signature,
    },
    body: payload,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to register device-server: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();

  for (const item of data.Response || []) {
    if (item.Id) {
      return item.Id.id;
    }
  }

  throw new Error('Invalid device-server response: missing device ID');
}

/**
 * Create a new session with bunq
 */
async function createSession(instToken: string): Promise<{
  sessionToken: string;
  userId: number;
}> {
  const baseUrl = getBunqBaseUrl();
  const apiKey = process.env.BUNQ_API_KEY;

  if (!apiKey) {
    throw new Error('BUNQ_API_KEY environment variable is not set');
  }

  const payload = JSON.stringify({ secret: apiKey });
  const signature = signData(payload);

  const response = await fetch(`${baseUrl}/session-server`, {
    method: 'POST',
    headers: {
      ...getBaseHeaders(),
      'X-Bunq-Client-Authentication': instToken,
      'X-Bunq-Client-Signature': signature,
    },
    body: payload,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to create bunq session: ${response.status} - ${errorBody}`);
  }

  const data = await response.json();

  let sessionToken = '';
  let userId = 0;

  for (const item of data.Response || []) {
    if (item.Token) {
      sessionToken = item.Token.token;
    }
    if (item.UserPerson) {
      userId = item.UserPerson.id;
    }
    if (item.UserCompany) {
      userId = item.UserCompany.id;
    }
    if (item.UserApiKey) {
      userId = item.UserApiKey.id;
    }
  }

  if (!sessionToken || !userId) {
    throw new Error('Invalid session response: missing token or user ID');
  }

  return { sessionToken, userId };
}

/**
 * Initialize bunq connection (installation + device registration)
 */
async function initializeBunq(): Promise<void> {
  if (installationToken && serverPublicKey) {
    return;
  }

  console.log('[bunq] Initializing bunq API connection...');

  const installation = await createInstallation();
  installationToken = installation.installationToken;
  serverPublicKey = installation.serverPublicKey;

  console.log('[bunq] Installation created successfully');

  await registerDeviceServer(installationToken);

  console.log('[bunq] Device registered successfully');
}

/**
 * Get a valid session token, creating a new session if needed.
 * Cache priority: in-memory → Supabase → create new
 */
export async function getSessionToken(): Promise<{
  token: string;
  userId: number;
}> {
  const now = Date.now();
  const bufferMs = 5 * 60 * 1000; // 5 minute buffer

  // 1. Check in-memory cache
  if (sessionCache && sessionCache.expiresAt > now + bufferMs) {
    return {
      token: sessionCache.token,
      userId: sessionCache.userId,
    };
  }

  // 2. Check distributed cache (Supabase)
  const distributedSession = await getDistributedSession();
  if (distributedSession && distributedSession.expiresAt > now + bufferMs) {
    sessionCache = distributedSession;
    console.log('[bunq] Using cached session from Supabase');
    return {
      token: distributedSession.token,
      userId: distributedSession.userId,
    };
  }

  // 3. Create new session with retry logic
  const maxRetries = 3;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (!installationToken) {
        await initializeBunq();
      }

      console.log(`[bunq] Creating new session... (attempt ${attempt + 1})`);
      const session = await createSession(installationToken!);

      const expiryMs = 24 * 60 * 60 * 1000; // 24 hours
      sessionCache = {
        token: session.sessionToken,
        userId: session.userId,
        expiresAt: Date.now() + expiryMs,
      };

      await setDistributedSession(sessionCache);

      console.log('[bunq] Session created and cached successfully');

      return {
        token: session.sessionToken,
        userId: session.userId,
      };
    } catch (error) {
      const isAuthError = error instanceof Error && error.message.includes('403');
      if (isAuthError && attempt < maxRetries - 1) {
        const waitMs = 1000 * (attempt + 1);
        console.log(`[bunq] Session creation failed (403), waiting ${waitMs}ms and retrying...`);
        await new Promise(resolve => setTimeout(resolve, waitMs));

        const retrySession = await getDistributedSession();
        if (retrySession && retrySession.expiresAt > Date.now() + bufferMs) {
          sessionCache = retrySession;
          console.log('[bunq] Found session from another instance after retry');
          return {
            token: retrySession.token,
            userId: retrySession.userId,
          };
        }

        installationToken = null;
        serverPublicKey = null;
        continue;
      }
      throw error;
    }
  }

  throw new Error('Failed to create bunq session after retries');
}

/**
 * Make an authenticated request to the bunq API
 */
export async function bunqRequest<T = unknown>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  body?: Record<string, unknown>,
  _isRetry?: boolean
): Promise<T> {
  const baseUrl = getBunqBaseUrl();
  const { token } = await getSessionToken();

  const url = `${baseUrl}${endpoint}`;
  const payload = body ? JSON.stringify(body) : '';

  const headers: Record<string, string> = {
    ...getBaseHeaders(),
    'X-Bunq-Client-Authentication': token,
  };

  // Sign POST/PUT requests
  if (payload && (method === 'POST' || method === 'PUT')) {
    headers['X-Bunq-Client-Signature'] = signData(payload);
  }

  const response = await fetch(url, {
    method,
    headers,
    body: payload || undefined,
  });

  const responseText = await response.text();

  if (!response.ok) {
    // On 401 (session expired), clear cache and retry once
    if (response.status === 401 && !_isRetry) {
      console.warn('[bunq] Session expired (401), refreshing...');
      sessionCache = null;
      installationToken = null;
      serverPublicKey = null;
      const supabase = getSupabaseClient();
      if (supabase) {
        await supabase.from('system_cache').delete().eq('key', BUNQ_SESSION_CACHE_KEY);
      }
      return bunqRequest<T>(method, endpoint, body, true);
    }
    // On 429 (rate limit), wait and retry once
    if (response.status === 429 && !_isRetry) {
      console.warn('[bunq] Rate limited (429), waiting 3s and retrying...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      return bunqRequest<T>(method, endpoint, body, true);
    }
    console.error(`[bunq] API error: ${response.status} - ${responseText}`);
    throw new Error(`bunq API error: ${response.status} - ${responseText}`);
  }

  // Verify server signature if present
  const serverSignature = response.headers.get('X-Bunq-Server-Signature');
  if (serverSignature && serverPublicKey) {
    if (!verifyServerSignature(responseText, serverSignature, serverPublicKey)) {
      console.warn('[bunq] Server signature verification failed');
    }
  }

  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error(`Failed to parse bunq response: ${responseText}`);
  }
}

/**
 * Check if bunq is configured (all required env vars present)
 */
export function isBunqConfigured(): boolean {
  return Boolean(
    process.env.BUNQ_API_KEY &&
    process.env.BUNQ_PRIVATE_KEY_BASE64 &&
    process.env.BUNQ_USER_ID &&
    process.env.BUNQ_MONETARY_ACCOUNT_ID
  );
}

/**
 * Get bunq user ID from environment
 */
export function getBunqUserId(): string {
  const userId = process.env.BUNQ_USER_ID;
  if (!userId) {
    throw new Error('BUNQ_USER_ID environment variable is not set');
  }
  return userId;
}

/**
 * Get bunq monetary account ID from environment
 */
export function getBunqMonetaryAccountId(): string {
  const accountId = process.env.BUNQ_MONETARY_ACCOUNT_ID;
  if (!accountId) {
    throw new Error('BUNQ_MONETARY_ACCOUNT_ID environment variable is not set');
  }
  return accountId;
}
