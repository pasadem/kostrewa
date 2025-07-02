import { NextApiRequest, NextApiResponse } from "next";
import { getUserFromToken } from "./auth";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function requireAdmin(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "Нет токена" });

    const user = getUserFromToken(auth.split(" ")[1]);
    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ error: "Доступ запрещён" });
    }
    return handler(req, res, user);
  };
}
