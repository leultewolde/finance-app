import {onDocumentCreated} from "firebase-functions/v2/firestore";
import {getFirestore} from "firebase-admin/firestore";
import * as admin from "firebase-admin";
import {logger} from "firebase-functions";

export const onTransactionCreate = onDocumentCreated(
  "users/{userId}/transactions/{transactionId}",
  async (event) => {
    const db = getFirestore();
    const userId = event.params.userId;
    const transaction = event.data?.data();

    logger.info(`Transaction created for user: ${userId}`, transaction);

    if (!transaction || !transaction.category || !transaction.amount) return;

    const budgetRef = db.doc(`users/${userId}/budgets/current`);
    const budgetSnap = await budgetRef.get();

    if (budgetSnap.exists) {
      const budgetData = budgetSnap.data();
      if (!budgetData) return;
      const currentSpent = budgetData.spent || {};
      const limits = budgetData.categories || {};
      const category = transaction.category;
      const spentSoFar = (currentSpent[category] || 0) + transaction.amount;

      if (limits[category] && spentSoFar > limits[category]) {
        await event.data?.ref.update({overBudget: true});
        logger.warn(`User ${userId} exceeded budget for ${category}`);
      }

      if (limits[category] && spentSoFar > 0.9 * limits[category]) {
        await db.collection("notifications").add({
          userId,
          title: "Budget Warning",
          // eslint-disable-next-line max-len
          body: `You’ve used ${spentSoFar} out of ${limits[category]} for ${category}.`,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      await budgetRef.update({
        spent: {
          ...currentSpent,
          [category]: spentSoFar,
        },
      });
    }
  },
);
