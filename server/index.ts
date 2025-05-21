import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import webpush from "web-push";
import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todo";
import prisma from "./lib/prisma";
import cron from "node-cron";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://exam-rho-brown.vercel.app"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

webpush.setVapidDetails(
  "mailto:din@email.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const subscriptions: any[] = [];

app.post("/api/subscribe", (req, res) => {
  const newSub = req.body;

  // Ta bort tidigare med samma endpoint
  const index = subscriptions.findIndex((s) => s.endpoint === newSub.endpoint);

  if (index !== -1) {
    subscriptions.splice(index, 1);
  }

  subscriptions.push(newSub);

  res.status(201).json({ message: "Prenumeration mottagen" });
});

cron.schedule("* * * * *", async () => {
  const now = new Date();

  const todos = await prisma.todo.findMany({
    where: {
      dueDate: { lte: now },
      reminderSent: false,
    },
  });

  for (const todo of todos) {
    const payload = JSON.stringify({
      title: "⏰ Påminnelse!",
      body: `Kom ihåg att: ${todo.title}`,
    });

    await Promise.allSettled(
      subscriptions.map((sub) =>
        webpush.sendNotification(sub, payload).catch(() => {})
      )
    );

    await prisma.todo.update({
      where: { id: todo.id },
      data: { reminderSent: true },
    });
  }
});

interface AuthRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = require("jsonwebtoken").verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };
    (req as AuthRequest).userId = decoded.id;
    next();
  } catch {
    res.sendStatus(403);
  }
};

app.post(
  "/api/remind/:id",
  authenticate,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = req as AuthRequest;

    const todo = await prisma.todo.findUnique({ where: { id } });

    if (!todo || todo.userId !== userId) {
      return res.status(404).json({ error: "Todo hittades inte" });
    }

    const payload = JSON.stringify({
      title: todo.title,
      body: "Dags att göra detta nu!",
    });

    const validSubscriptions: any[] = [];

    await Promise.allSettled(
      subscriptions.map((sub, i) =>
        webpush
          .sendNotification(sub, payload)
          .then(() => validSubscriptions.push(sub))
          .catch(() => {})
      )
    );

    subscriptions.length = 0;
    subscriptions.push(...validSubscriptions);

    res.status(200).json({ message: "Push skickad" });
  }
);

app.get("/api/ping", (req, res) => {
  res.status(200).json({ message: "Pong " });
});
