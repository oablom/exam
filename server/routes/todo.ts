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

  console.log("Todo-mottaget i backend:", {
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
        dueDate: parsedDueDate,
        completed: completed ?? false,
        isFocus: isFocus ?? false,
        reminderSent: false,
      },
    });

    console.log("Todo sparad:", todo);

    res.status(201).json(todo);
  } catch (err) {
    console.error(" Fel när todo skulle sparas:", err);
    res.status(500).json({ error: "Kunde inte spara todo" });
  }
});

router.patch("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    let { title, completed, priority, estimatedTime, dueDate, isFocus } =
      req.body;

    if (estimatedTime !== undefined) {
      const parsed = parseFloat(estimatedTime);
      estimatedTime = isNaN(parsed) ? undefined : parsed;
    }

    const parsedDueDate =
      dueDate && !isNaN(Date.parse(dueDate)) ? new Date(dueDate) : undefined;

    const dataToUpdate: Record<string, any> = {
      title,
      completed,
      priority,
      estimatedTime,
      dueDate: parsedDueDate,
      isFocus,
    };

    Object.keys(dataToUpdate).forEach((key) => {
      if (dataToUpdate[key] === undefined) {
        delete dataToUpdate[key];
      }
    });

    const existing = await prisma.todo.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Todo hittades inte" });
    }

    const dueDateChanged =
      parsedDueDate && existing.dueDate?.getTime() !== parsedDueDate.getTime();

    if (dueDateChanged) {
      dataToUpdate.reminderSent = false;
    }

    const todo = await prisma.todo.update({
      where: { id: req.params.id },
      data: dataToUpdate,
    });

    res.json(todo);
  } catch (err) {
    console.error("PATCH error:", err);
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
