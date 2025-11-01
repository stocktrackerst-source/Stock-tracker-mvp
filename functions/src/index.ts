import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// 🧠 Helper — Update availability
async function updateAvailability(
  userId: string,
  model: string,
  deliveredDelta: number,
  dispatchedDelta: number
) {
  const ref = db.collection("users").doc(userId).collection("inventory").doc(model);
  await db.runTransaction(async (t) => {
    const snap = await t.get(ref);
    const data = snap.data() || {};
    const currentAvailable = Number(data.available ?? 0);
    const newAvailable = currentAvailable + deliveredDelta - dispatchedDelta;

    t.set(
      ref,
      {
        available: newAvailable,
        LastUpdated: new Date().toISOString(),
      },
      { merge: true }
    );
  });
}

// ➕ Order
export const onOrder = functions.https.onCall(async (request, context) => {
  const { userId, model, quantity } = request.data;
  if (!userId || !model || !quantity)
    throw new functions.https.HttpsError("invalid-argument", "Missing fields.");

  const ref = db.collection("users").doc(userId).collection("inventory").doc(model);
  await ref.set(
    {
      model,
      ordered: admin.firestore.FieldValue.increment(quantity),
      LastUpdated: new Date().toISOString(),
    },
    { merge: true }
  );

  return { message: `Order recorded for ${model}` };
});

// 📦 Receive
export const onReceive = functions.https.onCall(async (request, context) => {
  const { userId, model, quantity } = request.data;
  if (!userId || !model || !quantity)
    throw new functions.https.HttpsError("invalid-argument", "Missing fields.");

  const ref = db.collection("users").doc(userId).collection("inventory").doc(model);
  await ref.set(
    {
      model,
      delivered: admin.firestore.FieldValue.increment(quantity),
      LastUpdated: new Date().toISOString(),
    },
    { merge: true }
  );

  await updateAvailability(userId, model, quantity, 0);
  return { message: `Received stock for ${model}` };
});

// 📘 Book
export const onBook = functions.https.onCall(async (request, context) => {
  const { userId, model, quantity } = request.data;
  if (!userId || !model || !quantity)
    throw new functions.https.HttpsError("invalid-argument", "Missing fields.");

  const ref = db.collection("users").doc(userId).collection("inventory").doc(model);
  await ref.set(
    {
      model,
      booked: admin.firestore.FieldValue.increment(quantity),
      LastUpdated: new Date().toISOString(),
    },
    { merge: true }
  );

  return { message: `Booking recorded for ${model}` };
});

// 🚚 Dispatch
export const onDispatch = functions.https.onCall(async (request, context) => {
  const { userId, model, quantity } = request.data;
  if (!userId || !model || !quantity)
    throw new functions.https.HttpsError("invalid-argument", "Missing fields.");

  const ref = db.collection("users").doc(userId).collection("inventory").doc(model);
  await ref.set(
    {
      model,
      dispatched: admin.firestore.FieldValue.increment(quantity),
      LastUpdated: new Date().toISOString(),
    },
    { merge: true }
  );

  await updateAvailability(userId, model, 0, quantity);
  return { message: `Dispatch recorded for ${model}` };
});

// 🧾 Placeholder — Google Sheets Sync (for later)
