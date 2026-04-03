const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  // if you want to use a service account json file directly:
  // credential: admin.credential.cert(require("./serviceAccountKey.json"))
});

module.exports = admin;
