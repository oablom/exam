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

const subscriptions: any[] = [];

app.post("/api/subscribe", (req, res) => {
  subscriptions.push(req.body);
  console.log("🔔 Ny prenumeration mottagen");
  console.log("Totalt sparade:", subscriptions.length);
  res.status(201).json({ message: "Prenumeration mottagen ✅" });
});

app.post("/api/send", async (req, res) => {
  const payload = JSON.stringify({
    title: "Påminnelse!",
    body: "Dags att göra din uppgift ✅",
  });

  console.log("📤 Skickar payload:", payload);

  const notificationPromises = subscriptions.map((sub, i) =>
    webpush.sendNotification(sub, payload).catch((err) => {
      console.error(`Push-fel till sub ${i}:`, err);
    })
  );

  await Promise.all(notificationPromises);

  res.status(200).json({ message: "Notiser skickade" });
});

app.post("/api/sendDelayed", async (req, res) => {
  const delay = 60 * 1000;

  const payload = JSON.stringify({
    title: "⏰ Påminnelse!",
    body: "Det har gått 10 sekunder – dags att göra något!",
  });

  console.log("⏳ Schemalägger payload:", payload);

  setTimeout(async () => {
    console.log("🚀 Försöker skicka fördröjd notis...");

    const results = await Promise.allSettled(
      subscriptions.map((sub, i) =>
        webpush.sendNotification(sub, payload).then(
          () => console.log(`✅ Notis skickad till sub ${i}`),
          (err) => console.error(`❌ Push-fel till sub ${i}:`, err)
        )
      )
    );

    console.log("📦 Resultat:", results);
  }, delay);

  res.status(200).json({ message: "Notis skickas om 1 minut" });
});

app.post("/api/manual-push", async (req, res) => {
  const subscription = req.body;

  const payload = JSON.stringify({
    title: "🔧 Manuell test",
    body: "Detta är ett direkt manuellt pushförsök",
  });

  try {
    await webpush.sendNotification(subscription, payload);
    console.log("✅ Manuell push skickad");
    res.status(200).json({ message: "Skickad!" });
  } catch (err) {
    console.error("❌ Fel vid manuell push:", err);
    res.status(500).json({ error: "Misslyckades att skicka notis" });
  }
});

// Enkel reminder-array (i minnet)
let reminders: { userId: string; time: number }[] = [];

// Skapa en påminnelse som ska triggas om 1 minut
app.post("/api/scheduleReminder", (req, res) => {
  const { userId } = req.body;
  const delay = 60 * 100;

  reminders.push({ userId, time: Date.now() + delay });
  console.log("⏱ Påminnelse lagd för:", userId);
  res.json({ message: "Schemalagd" });
});

// Frontend pollar här – och får "trigger: true" när det är dags
app.get("/api/reminders/:userId", (req, res) => {
  const { userId } = req.params;
  const now = Date.now();

  const match = reminders.find((r) => r.userId === userId && r.time <= now);
  if (match) {
    reminders = reminders.filter((r) => r !== match); // ta bort efter visning
    return res.json({ trigger: true });
  }

  res.json({ trigger: false });
});
