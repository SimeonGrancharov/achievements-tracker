import { Router, type Router as RouterType } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as achievementsService from '../services/achievements';

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

router.post('/', async (req, res) => {
  try {
    const achievement = await achievementsService.createAchievement(req.body);
    res.status(201).json(achievement);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

router.patch('/:id', async (req, res) => {
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

router.post('/:id/items', async (req, res) => {
  try {
    const achievement = await achievementsService.addAchievementItem(req.params.id, req.body);
    if (!achievement) {
      res.status(404).json({ error: 'Achievement not found' });
      return;
    }
    res.status(201).json(achievement);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

export default router;
