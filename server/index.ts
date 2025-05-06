import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todo";
import webpush from "web-push";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
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
  subscriptions.push(req.body);
  res.status(201).json({ message: "Prenumeration mottagen ✅" });
});

app.post("/api/send", async (req, res) => {
  const payload = JSON.stringify({
    title: "Påminnelse!",
    body: "Dags att göra din uppgift ✅",
  });

  const notificationPromises = subscriptions.map((sub) =>
    webpush.sendNotification(sub, payload).catch((err) => {
      console.error("Push-fel:", err);
    })
  );

  res.status(200).json({ message: "Notiser skickade" });
});
