import { Router, type Router as RouterType, type Request } from 'express';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import * as achievementsService from '../services/achievements';
import {
  CreateAchievementGroupSchema,
  UpdateAchievementGroupSchema,
  AchievementSchema,
} from '@achievements-tracker/shared';

const router: RouterType = Router();

router.use(authMiddleware);

router.get('/', async (_req, res) => {
  const achievements = await achievementsService.getAllAchievements();
  res.json(achievements);
});

router.get('/:id', async (req, res) => {
  const achievement = await achievementsService.getAchievementById(req.params.id);
  if (!achievement) {
    res.status(404).json({ error: 'Achievement not found' });
    return;
  }
  res.json(achievement);
});

router.post('/', validate(CreateAchievementGroupSchema), async (req, res) => {
  const achievement = await achievementsService.createAchievement(req.body);
  res.status(201).json(achievement);
});

router.patch('/:id', validate(UpdateAchievementGroupSchema), async (req: Request<{ id: string }>, res) => {
  const achievement = await achievementsService.updateAchievement(req.params.id, req.body);
  if (!achievement) {
    res.status(404).json({ error: 'Achievement not found' });
    return;
  }
  res.json(achievement);
});

router.delete('/:id', async (req, res) => {
  const deleted = await achievementsService.deleteAchievement(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Achievement not found' });
    return;
  }
  res.status(204).send();
});

router.post('/:id/items', validate(AchievementSchema), async (req: Request<{ id: string }>, res) => {
  const achievement = await achievementsService.addAchievementItem(req.params.id, req.body);
  if (!achievement) {
    res.status(404).json({ error: 'Achievement not found' });
    return;
  }
  res.status(201).json(achievement);
});

export default router;
