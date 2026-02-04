import { db } from '../firebase';
import {
  Achievement,
  AchievementSchema,
  AchievementItem,
  AchievementItemSchema,
} from '@achievements-tracker/shared';

const COLLECTION = 'achievements';

export async function getAllAchievements(): Promise<Achievement[]> {
  const snapshot = await db.collection(COLLECTION).get();
  return snapshot.docs.map((doc) => AchievementSchema.parse({ id: doc.id, ...doc.data() }));
}

export async function getAchievementById(id: string): Promise<Achievement | null> {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return AchievementSchema.parse({ id: doc.id, ...doc.data() });
}

export async function createAchievement(
  data: Omit<Achievement, 'id' | 'createdAt'>
): Promise<Achievement> {
  const docData = {
    ...data,
    createdAt: Date.now(),
  };
  const docRef = await db.collection(COLLECTION).add(docData);
  return AchievementSchema.parse({ id: docRef.id, ...docData });
}

export async function updateAchievement(
  id: string,
  data: Partial<Omit<Achievement, 'id' | 'createdAt'>>
): Promise<Achievement | null> {
  const docRef = db.collection(COLLECTION).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;

  await docRef.update(data);
  const updated = await docRef.get();
  return AchievementSchema.parse({ id: updated.id, ...updated.data() });
}

export async function deleteAchievement(id: string): Promise<boolean> {
  const docRef = db.collection(COLLECTION).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return false;

  await docRef.delete();
  return true;
}

export async function addAchievementItem(
  id: string,
  item: AchievementItem
): Promise<Achievement | null> {
  const parsed = AchievementItemSchema.parse(item);
  const docRef = db.collection(COLLECTION).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;

  const data = doc.data()!;
  const achievements = [...(data.achievements ?? []), parsed];
  await docRef.update({ achievements });

  return AchievementSchema.parse({ id: doc.id, ...data, achievements });
}
