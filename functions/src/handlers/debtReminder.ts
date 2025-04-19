import {onSchedule} from "firebase-functions/v2/scheduler";
import {getFirestore} from "firebase-admin/firestore";
import * as admin from "firebase-admin";

admin.initializeApp();

export const debtReminder = onSchedule("every day 08:00", async () => {
  const db = getFirestore();
  const today = new Date();
  const snapshot = await db.collectionGroup("debts")
    .where("dueDate", "<=", today)
    .get();

  for (const doc of snapshot.docs) {
    const debt = doc.data();
    const userId = doc.ref.path.split("/")[1];

    const userRef = db.doc(`users/${userId}/profile`);
    const userSnap = await userRef.get();
    const email = userSnap.exists ? userSnap.data()?.email : null;

    if (email) {
      await db.collection("mail").add({
        to: email,
        message: {
          subject: "Debt Due Reminder",
          // eslint-disable-next-line max-len
          text: `Hi, this is a reminder you owe ${debt.counterparty} $${debt.amount}. Due: ${new Date(debt.dueDate._seconds * 1000).toLocaleDateString()}`,
        },
      });
    }
  }
});
