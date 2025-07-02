import prisma from "@/lib/prisma/client";
import { requireAdmin } from "@/lib/admin";

async function handler(
  req: { method: string },
  res: {
    json: (arg0: unknown) => unknown;
    status: (arg0: number) => {
      (): unknown;
      new (): unknown;
      end: { (): void; new (): unknown };
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  user: unknown
) {
  if (req.method === "GET") {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json(orders);
  }

  res.status(405).end();
}

export default requireAdmin(handler);
