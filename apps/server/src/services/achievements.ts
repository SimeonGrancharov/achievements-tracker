import { db } from '../firebase';
import {
  AchievementGroup,
  AchievementGroupSchema,
  Achievement,
  AchievementSchema,
} from '@achievements-tracker/shared';

const COLLECTION = 'achievements';

export async function getAllAchievements(): Promise<AchievementGroup[]> {
  const snapshot = await db.collection(COLLECTION).get();
  return snapshot.docs.map((doc) => AchievementGroupSchema.parse({ id: doc.id, ...doc.data() }));
}

export async function getAchievementById(id: string): Promise<AchievementGroup | null> {
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return AchievementGroupSchema.parse({ id: doc.id, ...doc.data() });
}

export async function createAchievement(
  data: Omit<AchievementGroup, 'id' | 'createdAt'>
): Promise<AchievementGroup> {
  const docData = {
    ...data,
    createdAt: Date.now(),
  };
  const docRef = await db.collection(COLLECTION).add(docData);
  return AchievementGroupSchema.parse({ id: docRef.id, ...docData });
}

export async function updateAchievement(
  id: string,
  data: Partial<Omit<AchievementGroup, 'id' | 'createdAt'>>
): Promise<AchievementGroup | null> {
  const docRef = db.collection(COLLECTION).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;

  await docRef.update(data);
  const updated = await docRef.get();
  return AchievementGroupSchema.parse({ id: updated.id, ...updated.data() });
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
  item: Achievement
): Promise<AchievementGroup | null> {
  const parsed = AchievementSchema.parse(item);
  const docRef = db.collection(COLLECTION).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;

  const data = doc.data()!;
  const achievements = [...(data.achievements ?? []), parsed];
  await docRef.update({ achievements });

  return AchievementGroupSchema.parse({ id: doc.id, ...data, achievements });
}
