// ResetPassword.jsx 
// (route: /reset-password)
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ResetPassword() {
  const [pwd, setPwd] = useState(""); const [msg, setMsg] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); if (busy) return; setBusy(true); setMsg("");
    try {
      const { data, error } = await supabase.auth.updateUser({ password: pwd });
      if (error) throw error;
      setMsg("Password updated. You can now sign in.");
    } catch (err) { setMsg(err?.message || "Could not update password."); }
    finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit}>
      <input type="password" required minLength={8} value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="New password" />
      <button disabled={busy}>{busy ? "Saving…" : "Set new password"}</button>
      {msg && <small>{msg}</small>}
    </form>
  );
}
