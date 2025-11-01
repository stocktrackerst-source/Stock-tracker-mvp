import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export interface SignUpData {
  email: string;
  password: string;
  organizationName: string;
  businessType: string;
}

interface SignUpPageProps {
  onNavigateToLogin: () => void;
  onSignUpSuccess: () => void;
}

export function SignUpPage({ onNavigateToLogin, onSignUpSuccess }: SignUpPageProps) {
  const [form, setForm] = useState<SignUpData>({
    email: "",
    password: "",
    organizationName: "",
    businessType: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      await addDoc(collection(db, "users"), {
        uid: user.uid,
        organizationName: form.organizationName,
        businessType: form.businessType,
        createdAt: new Date().toISOString(),
      });

      onSignUpSuccess(); // ✅ Notify parent App.tsx
    } catch (err: any) {
      console.error("SignUp Error:", err);
      setError(err.message || "Failed to sign up");
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
        <p className="text-gray-500 mb-6">Create your account</p>

        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            name="organizationName"
            placeholder="Organization Name"
            value={form.organizationName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          {/* ✅ Dropdown added here */}
          <select
            name="businessType"
            value={form.businessType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700"
            required
          >
            <option value="">Select Nature of Business</option>
            <option value="Retail">Retail</option>
            <option value="Wholesale">Wholesale</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Service">Service</option>
            <option value="Distribution">Distribution</option>
            <option value="Other">Other</option>
          </select>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-gray-500">
          Already have an account?{" "}
          <button
            onClick={onNavigateToLogin}
            className="text-blue-600 hover:underline font-medium"
          >
            Login →
          </button>
        </p>
      </div>
    </div>
  );
}

