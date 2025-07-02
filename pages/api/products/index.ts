import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma/client";
import { getUserFromToken } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const category = req.query.category;
    const products = await prisma.product.findMany({
      where: category ? { categoryId: Number(category) } : {},
      include: { category: true },
    });
    return res.json(products);
  }

  if (req.method === "POST") {
    const auth = req.headers.authorization;
    const user = auth ? getUserFromToken(auth.split(" ")[1]) : null;
    if (!user || user.role !== "ADMIN")
      return res.status(403).json({ error: "Нет доступа" });

    const { name, description, price, categoryId, image } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price, image, categoryId },
    });
    return res.json(product);
  }

  res.status(405).end();
}
