import prisma from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';

export default async function handler(req, res) {
  const id = Number(req.query.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Неверный ID' });

  const auth = req.headers.authorization;
  const user = auth ? getUserFromToken(auth.split(' ')[1]) : null;
  if (!user || user.role !== 'ADMIN') return res.status(403).json({ error: 'Нет доступа' });

  if (req.method === 'PUT') {
    const { name } = req.body;
    const updated = await prisma.category.update({ where: { id }, data: { name } });
    return res.json(updated);
  }

  if (req.method === 'DELETE') {
    await prisma.category.delete({ where: { id } });
    return res.json({ success: true });
  }

  res.status(405).end();
}
