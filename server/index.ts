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

// 🔄 In-Memory lista med subscriptions
const subscriptions: any[] = [];

app.post("/api/subscribe", (req, res) => {
  const newSub = req.body;

  const alreadyExists = subscriptions.some(
    (sub) => sub.endpoint === newSub.endpoint
  );

  if (!alreadyExists) {
    subscriptions.push(newSub);
    console.log("📌 Lade till ny prenumeration");
  }

  console.log("Unika prenumerationer:", subscriptions.length);

  res.status(201).json({ message: "Prenumeration mottagen ✅" });
});

app.post("/api/send", async (req, res) => {
  const payload = JSON.stringify({
    title: "Påminnelse!",
    body: "Dags att göra din uppgift ✅",
  });

  console.log("📤 Skickar payload:", payload);

  const validSubscriptions: any[] = [];

  await Promise.allSettled(
    subscriptions.map((sub, i) =>
      webpush
        .sendNotification(sub, payload)
        .then(() => {
          console.log(`✅ Notis skickad till sub ${i}`);
          validSubscriptions.push(sub);
        })
        .catch((err) => {
          console.error(`❌ Push-fel till sub ${i}:`, err.message);
          if (err.statusCode === 404 || err.statusCode === 410) {
            console.log(`🧼 Tog bort sub ${i}`);
          }
        })
    )
  );

  subscriptions.length = 0;
  subscriptions.push(...validSubscriptions);

  res.status(200).json({ message: "Notiser skickade" });
});

app.post("/api/scheduleReminder", (req, res) => {
  const delay = 10 * 1000;

  const payload = JSON.stringify({
    title: "⏰ Påminnelse!",
    body: "Det har gått 10 sekunder – dags att göra något!",
  });

  setTimeout(async () => {
    console.log("🚀 Skickar schemalagd notis...");
    const validSubscriptions: any[] = [];

    const results = await Promise.allSettled(
      subscriptions.map((sub, i) =>
        webpush.sendNotification(sub, payload).then(
          () => {
            console.log(`✅ Notis skickad till sub ${i}`);
            validSubscriptions.push(sub);
          },
          (err) => {
            console.error(`❌ Push-fel till sub ${i}:`, err.message);
            if (err.statusCode === 404 || err.statusCode === 410) {
              console.log(`🧼 Sub ${i} är ogiltig – tas bort`);
            }
          }
        )
      )
    );

    subscriptions.length = 0;
    subscriptions.push(...validSubscriptions);
  }, delay);

  res.status(200).json({ message: "Push skickas om 10 sekunder" });
});
