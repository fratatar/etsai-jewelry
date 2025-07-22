import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for password reset instructions.");
    }
  };

  return (
    <div className="min-h-screen bg-[#202123] text-white flex flex-col justify-center items-center px-4">
      <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
      <form onSubmit={handleReset} className="space-y-4 w-full max-w-sm">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-gray-800 p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-[#10a37f] px-4 py-2 rounded w-full"
        >
          Send Reset Link
        </button>
      </form>
      {message && <p className="text-green-500 mt-4">{message}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
