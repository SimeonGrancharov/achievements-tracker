import express from 'express';
import './firebase'; // Initialize Firebase Admin
import { authMiddleware } from './middleware/auth';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.send('OK');
});

// Protected route example
app.get('/api/me', authMiddleware, (req, res) => {
  res.json({
    uid: req.user!.uid,
    email: req.user!.email,
    name: req.user!.name,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
