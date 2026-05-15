import 'server-only';
import { cookies } from 'next/headers';
import { eq, and, gt, isNull } from 'drizzle-orm';
import { db } from './db';
import { users, userSessions, type UserRow } from '@/db/schema';

const COOKIE_NAME = 'resubox_session';
const SESSION_DAYS = 30;
const MAGIC_LINK_MINUTES = 15;

function randomToken(): string {
  // 32 bytes = 256 bits of entropy, base64url-ish
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function findOrCreateUser(email: string): Promise<UserRow> {
  const normalized = email.toLowerCase().trim();
  const existing = await db.select().from(users).where(eq(users.email, normalized)).limit(1);
  if (existing[0]) return existing[0];

  const [created] = await db
    .insert(users)
    .values({ email: normalized })
    .returning();
  return created;
}

/**
 * Create a magic-link token for a user. Returns the token string. Caller is
 * responsible for emailing the user the link `/auth/verify?token=<token>`.
 */
export async function createMagicLink(userId: string): Promise<string> {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + MAGIC_LINK_MINUTES * 60 * 1000).toISOString();
  await db.insert(userSessions).values({
    user_id: userId,
    token,
    kind: 'magic_link',
    expires_at: expiresAt,
  });
  return token;
}

/**
 * Verify a magic-link token and exchange it for a long-lived session.
 * Returns the new session token (caller sets cookie) and user record.
 */
export async function exchangeMagicLink(magicToken: string): Promise<{ user: UserRow; sessionToken: string } | null> {
  const now = new Date().toISOString();
  const rows = await db
    .select()
    .from(userSessions)
    .where(
      and(
        eq(userSessions.token, magicToken),
        eq(userSessions.kind, 'magic_link'),
        gt(userSessions.expires_at, now),
        isNull(userSessions.used_at)
      )
    )
    .limit(1);
  const ml = rows[0];
  if (!ml) return null;

  // Mark magic link as used
  await db.update(userSessions).set({ used_at: now }).where(eq(userSessions.id, ml.id));

  // Issue a session
  const sessionToken = randomToken();
  const sessionExpiry = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await db.insert(userSessions).values({
    user_id: ml.user_id,
    token: sessionToken,
    kind: 'session',
    expires_at: sessionExpiry,
  });

  // Update last_login_at
  await db.update(users).set({ last_login_at: now }).where(eq(users.id, ml.user_id));

  const userRows = await db.select().from(users).where(eq(users.id, ml.user_id)).limit(1);
  if (!userRows[0]) return null;

  return { user: userRows[0], sessionToken };
}

export async function getCurrentUser(): Promise<UserRow | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const now = new Date().toISOString();
  const rows = await db
    .select({ user: users })
    .from(userSessions)
    .innerJoin(users, eq(users.id, userSessions.user_id))
    .where(
      and(
        eq(userSessions.token, token),
        eq(userSessions.kind, 'session'),
        gt(userSessions.expires_at, now)
      )
    )
    .limit(1);
  return rows[0]?.user ?? null;
}

export async function setSessionCookie(sessionToken: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function logout(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) {
    await db
      .update(userSessions)
      .set({ used_at: new Date().toISOString() })
      .where(eq(userSessions.token, token));
  }
  await clearSessionCookie();
}
