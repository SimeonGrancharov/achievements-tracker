import { db } from '../firebase';
import {
  AchievementGroup,
  AchievementGroupSchema,
  Achievement,
  AchievementSchema,
} from '@achievements-tracker/shared';

function userAchievements(uid: string) {
  return db.collection('users').doc(uid).collection('achievements');
}

export async function getAllAchievements(uid: string): Promise<AchievementGroup[]> {
  const snapshot = await userAchievements(uid).get();
  return snapshot.docs.map((doc) => AchievementGroupSchema.parse({ id: doc.id, ...doc.data() }));
}

export async function getAchievementById(uid: string, id: string): Promise<AchievementGroup | null> {
  const doc = await userAchievements(uid).doc(id).get();
  if (!doc.exists) return null;
  return AchievementGroupSchema.parse({ id: doc.id, ...doc.data() });
}

export async function createAchievement(
  uid: string,
  data: Omit<AchievementGroup, 'id' | 'createdAt'>
): Promise<AchievementGroup> {
  const docData = {
    ...data,
    createdAt: Date.now(),
  };
  const docRef = await userAchievements(uid).add(docData);
  return AchievementGroupSchema.parse({ id: docRef.id, ...docData });
}

export async function updateAchievement(
  uid: string,
  id: string,
  data: Partial<Omit<AchievementGroup, 'id' | 'createdAt'>>
): Promise<AchievementGroup | null> {
  const docRef = userAchievements(uid).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;

  await docRef.update(data);
  const updated = await docRef.get();
  return AchievementGroupSchema.parse({ id: updated.id, ...updated.data() });
}

export async function deleteAchievement(uid: string, id: string): Promise<boolean> {
  const docRef = userAchievements(uid).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return false;

  await docRef.delete();
  return true;
}

export async function addAchievementItem(
  uid: string,
  id: string,
  item: Achievement
): Promise<AchievementGroup | null> {
  const parsed = AchievementSchema.parse(item);
  const docRef = userAchievements(uid).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return null;

  const data = doc.data()!;
  const achievements = [...(data.achievements ?? []), parsed];
  await docRef.update({ achievements });

  return AchievementGroupSchema.parse({ id: doc.id, ...data, achievements });
}
