import { useEffect, useMemo, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, increment, setDoc } from "firebase/firestore";

import { auth, db } from "./firebase/firebaseConfig";
import { useInventory } from "./hooks/useInventory";

import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import { ResponsiveDashboard } from "./components/ResponsiveDashboard";
import { AddModal } from "./components/AddModal";
import { SellModal } from "./components/SellModal";

import { OrderForm, OrderFormData } from "./components/OrderForm";
import { ReceiveForm, ReceiveFormData } from "./components/ReceiveForm";
import { BookForm, BookFormData } from "./components/BookForm";
import { DispatchForm, DispatchFormData } from "./components/DispatchForm";

import { AdminRecordTypeSelector } from "./components/AdminRecordTypeSelector";
import { ResponsiveAdminPanel } from "./components/ResponsiveAdminPanel";
import { ItemDetailsPopup } from "./components/ItemDetailsPopup";
import { Toaster } from "sonner";


// ---------------- Types ----------------
type Screen =
  | "login"
  | "signup"
  | "dashboard"
  | "add-modal"
  | "sell-modal"
  | "order-form"
  | "receive-form"
  | "book-form"
  | "dispatch-form"
  | "admin-selector"
  | "admin-panel";

type TabType = "orders" | "received" | "booked" | "dispatched";

interface InventoryItem {
  id: string;
  model: string;
  category: string;
  opening: number;
  ordered: number;
  delivered: number;
  booked: number;
  dispatched: number;
  available: number; // derived OR stored
}

// -------------- Component --------------
export default function App() {
  // Firebase inventory (real-time)
  const { uid, items } = useInventory();

  // App UI state
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Prevents “stuck on Loading user…”: we resolve auth in max 5s
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // UI helpers
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedAdminTab, setSelectedAdminTab] = useState<TabType>("orders");

  // ----------- Auth Guard (robust) -----------
  useEffect(() => {
    const timer = setTimeout(() => {
      // Hard-fallback: even if Firebase is slow or misconfigured, unblock UI to Login
      setAuthLoading(false);
      setIsAuthenticated(!!auth.currentUser);
      setCurrentScreen(auth.currentUser ? "dashboard" : "login");
    }, 5000);

    const unsub = onAuthStateChanged(
      auth,
      (user) => {
        clearTimeout(timer);
        setIsAuthenticated(!!user);
        setCurrentScreen(user ? "dashboard" : "login");
        setAuthLoading(false);
      },
      (err) => {
        console.error("Auth listener error:", err);
        clearTimeout(timer);
        setIsAuthenticated(false);
        setCurrentScreen("login");
        setAuthLoading(false);
      }
    );

    return () => {
      clearTimeout(timer);
      unsub();
    };
  }, []);

  // ---------- Inventory shaping for UI ----------
  const inventory: InventoryItem[] = useMemo(() => {
    if (!items || items.length === 0) return [];
    return items.map((it: any) => ({
      id: it.model, // using model as doc id (per db.ts design)
      model: it.model,
      category: it.category ?? "General",
      opening: Number(it.opening ?? 0),
      ordered: Number(it.ordered ?? 0),
      delivered: Number(it.delivered ?? 0),
      booked: Number(it.booked ?? 0),
      dispatched: Number(it.dispatched ?? 0),
      // available: prefer stored field; otherwise compute: opening + delivered - dispatched
      available:
        typeof it.available === "number"
          ? Number(it.available)
          : Number(it.opening ?? 0) + Number(it.delivered ?? 0) - Number(it.dispatched ?? 0),
    }));
  }, [items]);

  const filteredInventory = useMemo(
    () =>
      inventory.filter((it) =>
        it.model.toLowerCase().includes(searchTerm.trim().toLowerCase())
      ),
    [inventory, searchTerm]
  );

  // ---------- Firestore update helper ----------
  async function updateInventoryField(
    model: string,
    field: "ordered" | "delivered" | "booked" | "dispatched",
    delta: number
  ) {
    if (!uid) {
      toast.error("User not ready. Please re-login.");
      return;
    }
    if (!model) {
      toast.error("Model is required.");
      return;
    }

    // availability rule:
    // - delivered: available += delta
    // - dispatched: available -= delta
    // - ordered: no change to available
    // - booked: no change to available (you deduct only when dispatching)
    const availabilityDelta =
      field === "delivered" ? delta : field === "dispatched" ? -delta : 0;

    const ref = doc(db, "users", uid, "inventory", model);

    await setDoc(
      ref,
      {
        model,
        category: "General",
        [field]: increment(delta),
        ...(availabilityDelta !== 0 ? { available: increment(availabilityDelta) } : {}),
      },
      { merge: true }
    );
  }

  // ---------- Form submit handlers ----------
  async function handleOrderSubmit(data: OrderFormData) {
    await updateInventoryField(data.model, "ordered", data.quantity);
    toast.success(`✅ Order recorded for ${data.model}`);
    setCurrentScreen("dashboard");
  }

  async function handleReceiveSubmit(data: ReceiveFormData) {
    await updateInventoryField(data.model, "delivered", data.receivedQty);
    toast.success(`✅ Stock received for ${data.model}`);
    setCurrentScreen("dashboard");
  }

  async function handleBookSubmit(data: BookFormData) {
    await updateInventoryField(data.model, "booked", data.quantity);
    toast.success(`✅ Booking recorded for ${data.model}`);
    setCurrentScreen("dashboard");
  }

  async function handleDispatchSubmit(data: DispatchFormData) {
    await updateInventoryField(data.model, "dispatched", data.quantity);
    toast.success(`✅ Dispatch recorded for ${data.model}`);
    setCurrentScreen("dashboard");
  }

  // ---------- Navigation helpers ----------
  const handleAddModalSelect = (option: "order" | "receive") =>
    setCurrentScreen(option === "order" ? "order-form" : "receive-form");

  const handleSellModalSelect = (option: "book" | "dispatch" | "dispatch-booking") =>
    setCurrentScreen(option === "book" ? "book-form" : "dispatch-form");

  const shouldShowFloatingButtons =
    isAuthenticated && !["add-modal", "sell-modal", "login", "signup"].includes(currentScreen);

  // ---------- Loading Gate ----------
  if (authLoading) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: "#E3F2FD", fontFamily: "Inter, Poppins, Roboto, sans-serif" }}
      >
        <p className="text-gray-600">Loading user…</p>
      </div>
    );
  }

  // ---------- Render ----------
  return (
    <div
      className="relative min-h-screen w-full"
      style={{ backgroundColor: "#E3F2FD", fontFamily: "Inter, Poppins, Roboto, sans-serif" }}
    >
      {/* Auth */}
      {currentScreen === "login" && (
        <LoginPage
          onNavigateToSignup={() => setCurrentScreen("signup")}
          onLoginSuccess={(user) => {
            setIsAuthenticated(true);
            setCurrentScreen("dashboard");
            console.log("Logged in:", user?.email);
            toast.success("✅ Welcome to Stock Tracker!");
          }}
        />
      )}

      {currentScreen === "signup" && (
        <SignUpPage
          onNavigateToLogin={() => setCurrentScreen("login")}
          onSignUpSuccess={() => {
            setIsAuthenticated(true);
            setCurrentScreen("dashboard");
            toast.success("✅ Account created");
          }}
        />
      )}

      {/* Dashboard */}
      {currentScreen === "dashboard" && isAuthenticated && (
        <ResponsiveDashboard
          inventory={filteredInventory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAdminClick={() => setCurrentScreen("admin-selector")}
          onItemClick={(item) => setSelectedItem(item)}
          onLogout={async () => {
            await signOut(auth);
            setIsAuthenticated(false);
            setCurrentScreen("login");
            toast.success("✅ Logged out");
          }}
        />
      )}

      {/* Modals */}
      {currentScreen === "add-modal" && (
        <AddModal onSelect={handleAddModalSelect} onClose={() => setCurrentScreen("dashboard")} />
      )}
      {currentScreen === "sell-modal" && (
        <SellModal onSelect={handleSellModalSelect} onClose={() => setCurrentScreen("dashboard")} />
      )}

      {/* Forms */}
      {currentScreen === "order-form" && (
        <OrderForm onSubmit={handleOrderSubmit} onBack={() => setCurrentScreen("dashboard")} />
      )}
      {currentScreen === "receive-form" && (
        <ReceiveForm
          onSubmit={handleReceiveSubmit}
          onBack={() => setCurrentScreen("dashboard")}
          pendingOrders={[]}
        />
      )}
      {currentScreen === "book-form" && (
        <BookForm onSubmit={handleBookSubmit} onBack={() => setCurrentScreen("dashboard")} />
      )}
      {currentScreen === "dispatch-form" && (
        <DispatchForm
          onSubmit={handleDispatchSubmit}
          onBack={() => setCurrentScreen("dashboard")}
          bookedOrders={[]}
        />
      )}

      {/* Admin */}
      {currentScreen === "admin-selector" && (
        <AdminRecordTypeSelector
          onBack={() => setCurrentScreen("dashboard")}
          onSelectType={(type) => {
            setSelectedAdminTab(type);
            setCurrentScreen("admin-panel");
          }}
        />
      )}
      {currentScreen === "admin-panel" && (
        <ResponsiveAdminPanel
          onBack={() => setCurrentScreen("admin-selector")}
          onDelete={() => {}}
          initialTab={selectedAdminTab}
          orders={[]}
          received={[]}
          booked={[]}
          dispatched={[]}
        />
      )}

      {/* Item details */}
      {selectedItem && <ItemDetailsPopup item={selectedItem} onClose={() => setSelectedItem(null)} />}

      {/* FABs */}
      {shouldShowFloatingButtons && (
        <>
          <button
            onClick={() => setCurrentScreen("add-modal")}
            className="fixed rounded-full flex items-center justify-center hover:scale-110 active:scale-95"
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#4CAF50",
              bottom: "16px",
              right: "16px",
              zIndex: 100,
              boxShadow: "0 8px 24px rgba(76,175,80,0.4)",
            }}
            aria-label="Add Stock"
          >
            <Plus className="text-white" size={36} strokeWidth={3} />
          </button>

          <button
            onClick={() => setCurrentScreen("sell-modal")}
            className="fixed rounded-full flex items-center justify-center hover:scale-110 active:scale-95"
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#E53935",
              bottom: "16px",
              left: "16px",
              zIndex: 100,
              boxShadow: "0 8px 24px rgba(229,57,53,0.4)",
            }}
            aria-label="Sell/Book Stock"
          >
            <Minus className="text-white" size={36} strokeWidth={3} />
          </button>
        </>
      )}

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#FFFFFF",
            color: "#000000",
            borderRadius: "16px",
            padding: "16px",
            fontSize: "14px",
            fontFamily: "Inter, Poppins, Roboto, sans-serif",
          },
        }}
      />
    </div>
  );
}
