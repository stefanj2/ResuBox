import 'server-only';
import { and, desc, eq } from 'drizzle-orm';
import { db } from './db';
import { userCvs, type UserCvRow } from '@/db/schema';
import { CVData } from '@/types/cv';

export async function listUserCvs(userId: string): Promise<UserCvRow[]> {
  return db
    .select()
    .from(userCvs)
    .where(eq(userCvs.user_id, userId))
    .orderBy(desc(userCvs.updated_at));
}

export async function getUserCv(userId: string, cvId: string): Promise<UserCvRow | null> {
  const rows = await db
    .select()
    .from(userCvs)
    .where(and(eq(userCvs.id, cvId), eq(userCvs.user_id, userId)))
    .limit(1);
  return rows[0] ?? null;
}

export async function createUserCv(userId: string, name: string, cvData: CVData): Promise<UserCvRow> {
  const [inserted] = await db
    .insert(userCvs)
    .values({ user_id: userId, name, cv_data: cvData })
    .returning();
  return inserted;
}

export async function updateUserCv(
  userId: string,
  cvId: string,
  updates: { name?: string; cv_data?: CVData }
): Promise<UserCvRow | null> {
  const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.cv_data !== undefined) dbUpdates.cv_data = updates.cv_data;

  const [updated] = await db
    .update(userCvs)
    .set(dbUpdates)
    .where(and(eq(userCvs.id, cvId), eq(userCvs.user_id, userId)))
    .returning();
  return updated ?? null;
}

export async function deleteUserCv(userId: string, cvId: string): Promise<boolean> {
  await db.delete(userCvs).where(and(eq(userCvs.id, cvId), eq(userCvs.user_id, userId)));
  return true;
}
