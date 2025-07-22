import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // Giriş başarılıysa token'ı localStorage'a kaydet
    localStorage.setItem("userToken", data.session.access_token);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#202123] text-white flex flex-col justify-center items-center px-4">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-gray-800 p-2 rounded w-full"
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-gray-800 p-2 rounded w-full"
          autoComplete="current-password"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-[#10a37f] px-4 py-2 rounded w-full"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
