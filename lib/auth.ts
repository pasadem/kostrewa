import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'your-secret';

export function signToken(user: { id: number; email: string; role: string }) {
  return jwt.sign(user, SECRET, { expiresIn: '7d' });
}

export function getUserFromToken(token: string) {
  try {
    return jwt.verify(token, SECRET) as { id: number; email: string; role: string };
  } catch {
    return null;
  }
}
