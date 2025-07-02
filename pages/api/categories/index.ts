import prisma from "@/lib/prisma/client";
import { getUserFromToken } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const categories = await prisma.category.findMany();
    return res.json(categories);
  }

  if (req.method === "POST") {
    const auth = req.headers.authorization;
    const user = auth ? getUserFromToken(auth.split(" ")[1]) : null;
    if (!user || user.role !== "ADMIN")
      return res.status(403).json({ error: "Нет доступа" });

    const { name } = req.body;
    const category = await prisma.category.create({ data: { name } });
    return res.json(category);
  }

  res.status(405).end();
}
