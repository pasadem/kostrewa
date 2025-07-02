import prisma from "@/lib/prisma/client";
import { requireAdmin } from "@/lib/admin";

async function handler(req, res, user) {
  if (req.method === "GET") {
    const products = await prisma.product.findMany({
      include: { category: true },
    });
    return res.json(products);
  }

  if (req.method === "POST") {
    const { name, description, price, categoryId, image } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price, categoryId, image },
    });
    return res.json(product);
  }

  res.status(405).end();
}

export default requireAdmin(handler);
