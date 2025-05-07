export async function sendManualPush() {
  const subscription = {
    endpoint:
      "https://fcm.googleapis.com/fcm/send/ftTU2pKUVTw:APA91bFuNvJizbsJexSkLAFGQt3_5fgIIsqPsciuJlMg0KteaRwmB5g1YrEVilfkAur75evhxPAzHGziZ6yFDMwwQFGtdREGE_HtATb5S2bureD0BPi9ZjEKWT4t4O3hfqYsrDAPxvPm",
    expirationTime: null,
    keys: {
      p256dh:
        "BLW2ymRilmmCPbQ4_QXgsHQY_REoHg3oONuYVICU7INNx0QoFBQClJsdsfejX5Z00RM1q_HnfETe9kEvK84NqAU",
      auth: "iOVibaoZ6Y0yBvvy8N3RsQ",
    },
  };

  const res = await fetch("http://localhost:5000/api/manual-push", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });

  const data = await res.json();
  console.log("📬 Svar från servern:", data);
}
