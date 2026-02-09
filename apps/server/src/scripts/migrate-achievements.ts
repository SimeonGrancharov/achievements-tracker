/**
 * One-off migration: moves docs from the flat `achievements` collection
 * into `users/{uid}/achievements`.
 *
 * Usage:
 *   npx tsx --env-file=.dev.env src/scripts/migrate-achievements.ts <uid>
 *
 * Find your UID in Firebase Console → Authentication → Users.
 */

import { db } from '../firebase';

const uid = process.argv[2];

if (!uid) {
  console.error('Usage: npx tsx --env-file=.dev.env src/scripts/migrate-achievements.ts <uid>');
  process.exit(1);
}

async function migrate() {
  const sourceCollection = db.collection('achievements');
  const targetCollection = db.collection('users').doc(uid).collection('achievements');

  const snapshot = await sourceCollection.get();

  if (snapshot.empty) {
    console.log('No documents found in "achievements" collection. Nothing to migrate.');
    return;
  }

  console.log(`Migrating ${snapshot.size} document(s) to users/${uid}/achievements...`);

  const batch = db.batch();

  for (const doc of snapshot.docs) {
    const targetRef = targetCollection.doc(doc.id);
    batch.set(targetRef, doc.data());
  }

  await batch.commit();
  console.log(`Done. ${snapshot.size} document(s) migrated.`);
  console.log('You can now delete the old "achievements" collection from the Firebase Console if everything looks good.');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
