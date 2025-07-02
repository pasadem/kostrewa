import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Неверный ID' });

  if (req.method === 'GET') {
    const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
    return res.json(product);
  }

  const auth = req.headers.authorization;
  const user = auth ? getUserFromToken(auth.split(' ')[1]) : null;
  if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Нет доступа' });

  if (req.method === 'PUT') {
    const { name, description, price, categoryId, image } = req.body;
    const updated = await prisma.product.update({
      where: { id },
      data: { name, description, price, categoryId, image },
    });
    return res.json(updated);
  }

  if (req.method === 'DELETE') {
    await prisma.product.delete({ where: { id } });
    return res.json({ success: true });
  }

  res.status(405).end();
}
