import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase"; // ← adjust if your path differs

export default function ResendConfirmationEmail({ defaultEmail = "" }) {
  const [email, setEmail] = useState(defaultEmail);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0); // Supabase rate limit ~60s

  useEffect(() => setEmail(defaultEmail), [defaultEmail]);

  useEffect(() => {
    if (!cooldown) return;
    const id = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (cooldown || !email) return;

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: {
          emailRedirectTo: `${import.meta.env.VITE_SITE_URL || window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      setMessage("Confirmation email re-sent. Please check your inbox (and your junk folder).");
      setCooldown(60);
    } catch (err) {
      setMessage(
        err?.message || "Something went wrong. Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleResend} style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <label htmlFor="resend-email" style={{ position: "absolute", left: "-9999px" }}>
        Email address
      </label>
      <input
        id="resend-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        required
        disabled={loading}
      />
      <button type="submit" disabled={loading || cooldown > 0}>
        {cooldown ? `Try again in ${cooldown}s` : loading ? "Sending…" : "Re-send confirmation email"}
      </button>
      {message && <small>{message}</small>}
    </form>
  );
}
