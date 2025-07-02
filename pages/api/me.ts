import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Нет токена' });

  const token = auth.split(' ')[1];
  const user = getUserFromToken(token);
  if (!user) return res.status(401).json({ error: 'Неверный токен' });

  res.json(user);
}
