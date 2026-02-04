import { z } from 'zod';
import { AchievementSize } from './AchievementSize';
import { AchievementType } from './AchievementType';

export const AchievementItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  size: AchievementSize,
  type: AchievementType,
});
export type AchievementItem = z.infer<typeof AchievementItemSchema>;

export const AchievementSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.number(),
  description: z.string(),
  achievements: z.array(AchievementItemSchema),
});
export type Achievement = z.infer<typeof AchievementSchema>;
