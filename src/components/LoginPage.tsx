import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

interface LoginPageProps {
  onNavigateToSignup: () => void;
  onLoginSuccess: (user: any) => void;
}

export function LoginPage({ onNavigateToSignup, onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess(userCredential.user);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen text-center px-6"
      style={{ backgroundColor: "#E3F2FD", fontFamily: "Inter, Poppins, Roboto, sans-serif" }}
    >
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-1 text-gray-800">📦 Stock Tracker</h1>
        <p className="text-gray-500 mb-6">Apna stock, apne phone par</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-gray-500">
          or{" "}
          <button onClick={onNavigateToSignup} className="text-blue-600 hover:underline font-medium">
            Create Account →
          </button>
        </p>
      </div>
    </div>
  );
}
