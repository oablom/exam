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
  const { title, priority, estimatedTime, dueDate, completed, isFocus } =
    req.body;

  console.log("📩 Todo-mottaget i backend:", {
    title,
    priority,
    estimatedTime,
    dueDate,
    completed,
    isFocus,
    userId,
  });

  const parsedDueDate =
    dueDate && !isNaN(Date.parse(dueDate)) ? new Date(dueDate) : undefined;

  try {
    const todo = await prisma.todo.create({
      data: {
        title,
        userId,
        priority,
        estimatedTime,
        completed,
        dueDate: parsedDueDate,
        isFocus,
      },
    });

    console.log("✅ Todo sparad:", todo);

    res.status(201).json(todo);
  } catch (err) {
    console.error("🔥 Fel när todo skulle sparas:", err);
    res.status(500).json({ error: "Kunde inte spara todo" });
  }
});

router.patch("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const { title, completed, priority, estimatedTime, dueDate, isFocus } =
      req.body;

    const parsedDueDate =
      dueDate && !isNaN(Date.parse(dueDate)) ? new Date(dueDate) : undefined;

    const todo = await prisma.todo.update({
      where: { id: req.params.id },
      data: {
        title,
        completed,
        priority,
        estimatedTime,
        dueDate: parsedDueDate,
        isFocus,
      },
    });

    res.json(todo);
  } catch (err) {
    console.error("❌ PATCH error:", err);
    res.status(500).json({ error: "Kunde inte uppdatera todo" });
  }
});

router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  await prisma.todo.delete({
    where: { id: req.params.id },
  });

  res.sendStatus(204);
});

export default router;
