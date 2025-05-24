import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import webpush from "web-push";
import jwt from "jsonwebtoken";
import cron from "node-cron";
import { PushSub } from "@prisma/client";

import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todo";
import prisma from "./lib/prisma";

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

webpush.setVapidDetails(
  "mailto:oablom@gmail.com",
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

interface PushSubscriptionJSON {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  expirationTime?: number | null;
}

interface AuthRequest extends Request {
  userId: string;
}

function authenticate(req: Request, res: Response, next: NextFunction) {
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
}

app.post("/api/subscribe", authenticate, async (req, res) => {
  const { endpoint, keys, expirationTime } = req.body as PushSubscriptionJSON;
  if (!endpoint || !keys)
    return res.status(400).json({ error: "Invalid push subscription" });

  await prisma.pushSub.upsert({
    where: { endpoint },
    create: {
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      expiration: expirationTime ? new Date(expirationTime) : null,
      userId: (req as AuthRequest).userId,
    },
    update: {
      p256dh: keys.p256dh,
      auth: keys.auth,
      expiration: expirationTime ? new Date(expirationTime) : null,
    },
  });

  res.status(201).end();
});

app.post("/api/remind/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { userId } = req as AuthRequest;

  const todo = await prisma.todo.findUnique({ where: { id } });
  if (!todo || todo.userId !== userId)
    return res.status(404).json({ error: "Todo not found" });

  const payload = JSON.stringify({
    title: todo.title,
    body: "Dags att göra detta nu!",
  });
  const subs: PushSub[] = await prisma.pushSub.findMany({ where: { userId } });

  await Promise.allSettled(
    subs.map((s: PushSub) =>
      webpush
        .sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload
        )
        .catch(async (err) => {
          if (err.statusCode === 410 || err.statusCode === 404) {
            await prisma.pushSub.delete({ where: { endpoint: s.endpoint } });
          }
        })
    )
  );

  res.status(200).json({ message: "Push skickad" });
});

app.post("/api/schedule-focus-push", authenticate, async (req, res) => {
  const { title, delayMs } = req.body as { title: string; delayMs: number };
  const { userId } = req as AuthRequest;

  setTimeout(async () => {
    const payload = JSON.stringify({
      title,
      body: "⏰ Fokustiden är slut - bra jobbat!",
    });
    const subs: PushSub[] = await prisma.pushSub.findMany({
      where: { userId },
    });

    await Promise.allSettled(
      subs.map((s: PushSub) =>
        webpush
          .sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            payload
          )
          .catch(async (err) => {
            if (err.statusCode === 410 || err.statusCode === 404) {
              await prisma.pushSub.delete({ where: { endpoint: s.endpoint } });
            }
          })
      )
    );
  }, delayMs);

  res.status(200).json({ message: "Push schemalagd" });
});

app.get("/api/ping", (_req, res) => res.json({ message: "Pong" }));

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const todos = await prisma.todo.findMany({
    where: { dueDate: { lte: now }, reminderSent: false },
  });

  for (const todo of todos) {
    const subs: PushSub[] = await prisma.pushSub.findMany({
      where: { userId: todo.userId },
    });
    if (!subs.length) continue;

    const payload = JSON.stringify({
      title: "⏰ Påminnelse!",
      body: `Idag är deadline för: ${todo.title}`,
    });

    await Promise.allSettled(
      subs.map((s: PushSub) =>
        webpush
          .sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            payload
          )
          .catch(async (err) => {
            if (err.statusCode === 410 || err.statusCode === 404) {
              await prisma.pushSub.delete({ where: { endpoint: s.endpoint } });
            }
          })
      )
    );

    await prisma.todo.update({
      where: { id: todo.id },
      data: { reminderSent: true },
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
