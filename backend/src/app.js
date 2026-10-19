import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/error.js';

export const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? true }));
app.use(express.json());
app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api', routes);
app.use((_req, res) => res.status(404).json({ error: 'Rota não encontrada' }));
app.use(errorHandler);
