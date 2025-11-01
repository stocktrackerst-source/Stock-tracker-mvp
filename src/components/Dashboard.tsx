import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";  // ✅ onSnapshot imported (was missing)
import { auth, db } from "../firebase/firebaseConfig";

interface InventoryItem {
  id: string;
  model: string;
  qty: number;
  ordered: number;
  booked: number;
}

export function Dashboard() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch user-specific inventory from Firestore in real-time
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const invRef = collection(db, "users", user.uid, "inventory");
    const unsubscribe = onSnapshot(invRef, (snap) => {
      const data = snap.docs.map((doc) => {
        const d = doc.data() as any;
        return {
          id: doc.id,
          model: d.ModelName || d.model || "N/A",
          qty:
            Number(d.OpeningStock ?? d.opening ?? 0) +
            Number(d.Delivered ?? d.delivered ?? 0) -
            Number(d.Dispatched ?? d.dispatched ?? 0),
          ordered: Number(d.Ordered ?? d.ordered ?? 0),
          booked: Number(d.Booked ?? d.booked ?? 0),
        };
      });
      setInventory(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🧠 Filter logic
  const filteredInventory = inventory.filter((item) =>
    item.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white shadow-sm flex items-center justify-center" style={{ height: "150px" }}>
        <h1 className="text-black" style={{ fontFamily: "Inter, sans-serif" }}>
          Inventory Summary
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto" style={{ padding: "20px 60px 180px 60px" }}>
        {/* Search Bar */}
        <div
          className="bg-white rounded-2xl shadow-md mb-5 flex items-center px-6"
          style={{ height: "100px" }}
        >
          <Search className="text-gray-400 mr-4" size={24} />
          <input
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-black bg-transparent"
            style={{ fontFamily: "Inter, sans-serif" }}
          />
        </div>

        {/* Table Cards */}
        <div className="space-y-5">
          {filteredInventory.length > 0 ? (
            filteredInventory.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md p-6"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-gray-500 text-sm mb-2">Model</div>
                    <div className="text-black">{item.model}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-2">Qty</div>
                    <div className="text-black">{item.qty}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-2">Ordered</div>
                    <div className="text-black">{item.ordered}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm mb-2">Booked</div>
                    <div className="text-black">{item.booked}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">No items found.</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white shadow-sm flex items-center justify-center py-4">
        <p className="text-gray-600" style={{ fontFamily: "Inter, sans-serif" }}>
          KAFF Inventory System
        </p>
      </div>
    </div>
  );
}
