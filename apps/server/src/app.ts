import express from 'express';
import './firebase'; // Initialize Firebase Admin
import { authMiddleware } from './middleware/auth';
import achievementsRouter from './routes/achievements';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.send('OK');
});

app.get('/api/me', authMiddleware, (req, res) => {
  res.json({
    uid: req.user!.uid,
    email: req.user!.email,
    name: req.user!.name,
  });
});

app.use('/api/achievements', achievementsRouter);

export default app;
