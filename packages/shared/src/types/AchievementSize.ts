import { z } from 'zod';

export const AchievementSize = z.enum(['S', 'M', 'L']);
export type AchievementSize = z.infer<typeof AchievementSize>;
