import { z } from 'zod';

export const AchievementType = z.enum(['Feature', 'DevEx', 'Bug', 'Self-improvement']);
export type AchievementType = z.infer<typeof AchievementType>;
