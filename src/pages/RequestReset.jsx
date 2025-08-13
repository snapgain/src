// RequestReset.jsx
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RequestReset() {
  const [email, setEmail] = useState(""); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); if (busy) return; setBusy(true); setMsg("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${import.meta.env.VITE_SITE_URL || window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setMsg("Password reset email sent. Please check your inbox (and junk).");
    } catch (err) { setMsg(err?.message || "Could not send reset email."); }
    finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit}>
      <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" />
      <button disabled={busy}>{busy ? "Sending…" : "Send reset link"}</button>
      {msg && <small>{msg}</small>}
    </form>
  );
}
