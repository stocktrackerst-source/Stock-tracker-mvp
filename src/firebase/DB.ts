// src/firebase/db.ts
import {
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  runTransaction,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

/** Inventory item structure per model (availability is computed on client) */
export type InventoryDoc = {
  model: string;
  category: string;
  opening: number;
  ordered: number;
  delivered: number;
  booked: number;
  dispatched: number;
  lastUpdated: any; // Timestamp | FieldValue
};

/** Helpers: collection/doc under users/{uid} */
function userCol(uid: string, name: string) {
  return collection(db, "users", uid, name);
}
function userDoc(uid: string, name: string, id: string) {
  // Using path segments avoids accidental double-slashes
  return doc(db, "users", uid, name, id);
}

/** Subscribe to inventory list for dashboard (ordered by model) */
export function watchInventory(
  uid: string,
  cb: (items: InventoryDoc[]) => void
) {
  const q = query(userCol(uid, "inventory"), orderBy("model"));
  return onSnapshot(q, (snap) => {
    const rows: InventoryDoc[] = [];
    snap.forEach((d) => rows.push(d.data() as InventoryDoc));
    cb(rows);
  });
}

/** Ensure a model exists in inventory; create if missing */
async function ensureInventoryModel(
  uid: string,
  model: string,
  category: string
) {
  const safeModelId = model.trim(); // keep exact text as doc id (you’re selecting by label)
  const invRef = userDoc(uid, "inventory", safeModelId);
  const snap = await getDoc(invRef);
  if (!snap.exists()) {
    const empty: InventoryDoc = {
      model: safeModelId,
      category: category?.trim() || "General",
      opening: 0,
      ordered: 0,
      delivered: 0,
      booked: 0,
      dispatched: 0,
      lastUpdated: serverTimestamp(),
    };
    await setDoc(invRef, empty);
  }
}

/** Place Order (does not change availability directly) */
export async function createOrder(
  uid: string,
  payload: {
    model: string;
    category: string;
    quantity: number;
    supplier: string;
    billNo: string;
    orderedBy: string;
    dateISO: string;
    remarks?: string;
  }
) {
  await ensureInventoryModel(uid, payload.model, payload.category);

  await runTransaction(db, async (tx) => {
    const invRef = userDoc(uid, "inventory", payload.model);
    const invSnap = await tx.get(invRef);
    const cur = invSnap.data() as InventoryDoc | undefined;

    tx.update(invRef, {
      ordered: (cur?.ordered ?? 0) + payload.quantity,
      category: payload.category?.trim() || "General",
      lastUpdated: serverTimestamp(),
    });
  });

  await addDoc(userCol(uid, "orders"), {
    ...payload,
    qty: payload.quantity,
    createdAt: serverTimestamp(),
  });
}

/** Receive Stock (increases delivered → increases availability) */
export async function receiveStock(
  uid: string,
  payload: {
    model: string;
    category: string;
    orderedQty?: number;
    receivedQty: number;
    receivedBy: string;
    dateISO: string;
    remarks?: string;
  }
) {
  await ensureInventoryModel(uid, payload.model, payload.category);

  await runTransaction(db, async (tx) => {
    const invRef = userDoc(uid, "inventory", payload.model);
    const invSnap = await tx.get(invRef);
    const cur = invSnap.data() as InventoryDoc | undefined;

    tx.update(invRef, {
      delivered: (cur?.delivered ?? 0) + payload.receivedQty,
      category: payload.category?.trim() || "General",
      lastUpdated: serverTimestamp(),
    });
  });

  await addDoc(userCol(uid, "received"), {
    ...payload,
    createdAt: serverTimestamp(),
  });
}

/**
 * Book Sale
 * - status "Hold": increments booked (availability goes down on your UI calc)
 * - status "Sold": direct dispatch (skips booked, writes to dispatched)
 */
export async function bookSale(
  uid: string,
  payload: {
    model: string;
    category: string;
    quantity: number;
    status: "Hold" | "Sold";
    customerName: string;
    bookingId: string;
    enteredBy: string;
    dueDateISO: string;
    remarks?: string;
  }
) {
  await ensureInventoryModel(uid, payload.model, payload.category);

  if (payload.status === "Hold") {
    await runTransaction(db, async (tx) => {
      const invRef = userDoc(uid, "inventory", payload.model);
      const invSnap = await tx.get(invRef);
      const cur = invSnap.data() as InventoryDoc | undefined;

      tx.update(invRef, {
        booked: (cur?.booked ?? 0) + payload.quantity,
        category: payload.category?.trim() || "General",
        lastUpdated: serverTimestamp(),
      });
    });

    await addDoc(userCol(uid, "booked"), {
      ...payload,
      createdAt: serverTimestamp(),
    });
  } else {
    // Direct dispatch if marked Sold
    await dispatchStock(uid, {
      model: payload.model,
      category: payload.category,
      quantity: payload.quantity,
      customerName: payload.customerName,
      dispatchId: `DS-${payload.bookingId}`,
      dispatchedBy: payload.enteredBy,
      dateISO: payload.dueDateISO,
      remarks: payload.remarks,
      source: "Direct",
    });
  }
}

/** Dispatch (reduces availability; if linked to booking, reduces booked too) */
export async function dispatchStock(
  uid: string,
  payload: {
    model: string;
    category: string;
    quantity: number;
    customerName?: string;
    dispatchId: string;
    dispatchedBy: string;
    dateISO: string;
    remarks?: string;
    linkedBookingId?: string;
    source?: "Direct" | "FromBooking";
  }
) {
  await ensureInventoryModel(uid, payload.model, payload.category);

  await runTransaction(db, async (tx) => {
    const invRef = userDoc(uid, "inventory", payload.model);
    const invSnap = await tx.get(invRef);
    const cur = invSnap.data() as InventoryDoc | undefined;

    const updates: Partial<InventoryDoc> & { lastUpdated: any; category: string } = {
      dispatched: (cur?.dispatched ?? 0) + payload.quantity,
      category: payload.category?.trim() || "General",
      lastUpdated: serverTimestamp(),
    };

    if (payload.linkedBookingId) {
      updates.booked = Math.max(0, (cur?.booked ?? 0) - payload.quantity);
    }

    tx.update(invRef, updates);
  });

  await addDoc(userCol(uid, "dispatched"), {
    ...payload,
    createdAt: serverTimestamp(),
  });
}
