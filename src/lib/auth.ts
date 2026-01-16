// Simple admin authentication using localStorage
// In production, consider using NextAuth.js or similar

const AUTH_TOKEN_KEY = 'admin_auth_token';
const AUTH_EXPIRY_KEY = 'admin_auth_expiry';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface AuthResult {
  success: boolean;
  error?: string;
}

export async function login(username: string, password: string): Promise<AuthResult> {
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Store token in localStorage
      const token = data.token || generateToken();
      const expiry = Date.now() + SESSION_DURATION;

      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_EXPIRY_KEY, expiry.toString());
      }

      return { success: true };
    }

    return { success: false, error: data.error || 'Ongeldige inloggegevens' };
  } catch {
    return { success: false, error: 'Verbindingsfout. Probeer opnieuw.' };
  }
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_EXPIRY_KEY);
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const expiry = localStorage.getItem(AUTH_EXPIRY_KEY);

  if (!token || !expiry) {
    return false;
  }

  const expiryTime = parseInt(expiry, 10);
  if (Date.now() > expiryTime) {
    // Session expired, clean up
    logout();
    return false;
  }

  return true;
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function extendSession(): void {
  if (typeof window !== 'undefined' && isAuthenticated()) {
    const newExpiry = Date.now() + SESSION_DURATION;
    localStorage.setItem(AUTH_EXPIRY_KEY, newExpiry.toString());
  }
}

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
