import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";

export interface InventoryItem {
  id: string;
  ModelName: string;
  Category: string;
  OpeningStock: number;
  Ordered: number;
  Delivered: number;
  Booked: number;
  Dispatched: number;
  LastUpdated: string;
}

export function useInventory() {
  const [uid, setUid] = useState<string | null>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔥 Listen to auth first
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);

        // 🔄 Subscribe to inventory changes
        const inventoryRef = collection(db, "users", user.uid, "inventory");
        const unsubscribeInventory = onSnapshot(
          inventoryRef,
          (snapshot) => {
            const list = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as InventoryItem[];

            setItems(list);
            setLoading(false);
          },
          (error) => {
            console.error("❌ Firestore listener error:", error);
            setItems([]);
            setLoading(false);
          }
        );

        return () => unsubscribeInventory();
      } else {
        // No user logged in
        setUid(null);
        setItems([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return { uid, items, loading };
}
