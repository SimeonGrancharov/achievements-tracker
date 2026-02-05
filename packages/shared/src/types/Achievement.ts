import { z } from 'zod';
import { AchievementSize } from './AchievementSize';
import { AchievementType } from './AchievementType';

export const AchievementSchema = z.object({
  name: z.string(),
  description: z.string(),
  size: AchievementSize,
  type: AchievementType,
});
export type Achievement = z.infer<typeof AchievementSchema>;

export const AchievementGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.number(),
  description: z.string(),
  achievements: z.array(AchievementSchema),
});
export type AchievementGroup = z.infer<typeof AchievementGroupSchema>;

export const CreateAchievementGroupSchema = AchievementGroupSchema.omit({
  id: true,
  createdAt: true,
});
export type CreateAchievementGroup = z.infer<typeof CreateAchievementGroupSchema>;

export const UpdateAchievementGroupSchema = CreateAchievementGroupSchema.partial();
export type UpdateAchievementGroup = z.infer<typeof UpdateAchievementGroupSchema>;
