import express, { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";

const router = express.Router();

interface AuthRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    (req as AuthRequest).userId = decoded.id;
    next();
  } catch {
    res.sendStatus(403);
  }
};

router.get("/", authenticate, async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;

  const todos = await prisma.todo.findMany({
    where: { userId },
  });

  res.json(todos);
});

router.post("/", authenticate, async (req: Request, res: Response) => {
  const { userId } = req as AuthRequest;
  const { title } = req.body;

  const todo = await prisma.todo.create({
    data: {
      title,
      userId,
    },
  });

  res.status(201).json(todo);
});

router.patch("/:id", authenticate, async (req: Request, res: Response) => {
  const { title, completed } = req.body;

  const todo = await prisma.todo.update({
    where: { id: req.params.id },
    data: { title, completed },
  });

  res.json(todo);
});

router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  await prisma.todo.delete({
    where: { id: req.params.id },
  });

  res.sendStatus(204);
});

export default router;
