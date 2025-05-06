console.log("Startar...");

try {
  const webpush = require("web-push");
  console.log("web-push importerat");

  const keys = webpush.generateVAPIDKeys();
  console.log("Public Key:", keys.publicKey);
  console.log("Private Key:", keys.privateKey);
} catch (error) {
  console.error("Fel:", error);
}
