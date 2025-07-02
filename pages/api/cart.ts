import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Нет токена' });

  const user = getUserFromToken(auth.split(' ')[1]);
  if (!user) return res.status(401).json({ error: 'Неверный токен' });

  if (req.method === 'GET') {
    const items = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: { product: true },
    });
    return res.json(items);
  }

  if (req.method === 'POST') {
    const { productId, quantity } = req.body;
    const existing = await prisma.cartItem.findFirst({
      where: { userId: user.id, productId },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: { userId: user.id, productId, quantity },
      });
    }

    return res.json({ success: true });
  }

  if (req.method === 'DELETE') {
    const { productId } = req.body;
    await prisma.cartItem.deleteMany({
      where: { userId: user.id, productId },
    });
    return res.json({ success: true });
  }

  res.status(405).end();
}
