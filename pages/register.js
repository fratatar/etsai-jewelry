import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/router";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Sipariş numarası ve email eşleşiyor mu, used=false mu kontrol et
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .eq("buyer_email", email)
      .eq("used", false);

    if (ordersError) {
      setError("Sipariş kontrolünde hata oluştu. Tekrar deneyin.");
      return;
    }

    if (!orders || orders.length === 0) {
      setError(
        "Sipariş numarası ve email eşleşmedi ya da sipariş zaten kullanılmış."
      );
      return;
    }

    // 2. Yukarıdaki şartı geçen kullanıcıyı kaydet
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // 3. Sipariş kullanıldı olarak işaretle (used = true)
    const { error: updateError } = await supabase
      .from("orders")
      .update({ used: true })
      .eq("order_number", orderNumber)
      .eq("buyer_email", email);

    if (updateError) {
      setError("Sipariş durum güncellenemedi, lütfen destekle iletişime geçin.");
      return;
    }

    alert("Kayıt başarılı! Lütfen e-postanı kontrol et ve giriş yap.");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#202123] text-white flex flex-col justify-center items-center px-4">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      <form onSubmit={handleRegister} className="space-y-4 w-full max-w-sm">
        <input
          type="text"
          placeholder="Order Number (Sipariş No)"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          required
          className="bg-gray-800 p-2 rounded w-full"
          autoComplete="off"
        />
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
          autoComplete="new-password"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-[#10a37f] px-4 py-2 rounded w-full"
        >
          Register
        </button>
      </form>
    </div>
  );
}
