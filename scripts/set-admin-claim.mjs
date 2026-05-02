import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';

const authFilePath = './serviceAccountKey.json';

if (!existsSync(authFilePath)) {
  console.error('Error: serviceAccountKey.json not found in the root directory.');
  console.error('Please download it from Firebase Console > Project Settings > Service Accounts.');
  process.exit(1);
}

const serviceAccount = JSON.parse(
  readFileSync(authFilePath, 'utf8')
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = process.argv[2];
if (!uid) {
  console.error('Usage: node scripts/set-admin-claim.mjs <UID>');
  process.exit(1);
}

await admin.auth().setCustomUserClaims(uid, { admin: true });
console.log(`✅ Admin claim set for ${uid}`);
process.exit(0);
