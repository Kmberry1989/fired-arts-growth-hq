import { useEffect, useState } from "react";
import { firebaseConfigured, getValidSession, signInOwner, signOutOwner } from "./firebaseRest";

export function ProductionGate({ children }) {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { getValidSession().then(setSession).finally(() => setChecking(false)); }, []);

  if (!firebaseConfigured) return <main className="auth-shell"><section className="auth-card"><img src="/brand/regionalgrowth.png" alt="Fired Arts Studio Regional Growth HQ" /><span className="eyebrow">Production configuration required</span><h1>Connect the workspace before using it.</h1><p>The application will not fall back to demo data. Add the Firebase browser variables from <code>.env.example</code> in Vercel, then redeploy.</p></section></main>;
  if (checking) return <main className="auth-shell"><section className="auth-card" aria-live="polite"><span className="eyebrow">Secure workspace</span><h1>Checking your session…</h1></section></main>;
  if (!session) {
    const submit = async (event) => { event.preventDefault(); setBusy(true); setError(""); try { setSession(await signInOwner(email, password)); } catch (cause) { setError(cause.message); } finally { setBusy(false); } };
    return <main className="auth-shell"><form className="auth-card" onSubmit={submit}><img src="/brand/regionalgrowth.png" alt="Fired Arts Studio Regional Growth HQ" /><span className="eyebrow">Owner sign in</span><h1>Welcome back.</h1><p>Use the authorized Fired Arts owner account. Live workspace records stay private.</p><label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>{error && <div className="auth-error" role="alert">{error}</div>}<button className="primary-button" disabled={busy}>{busy ? "Signing in…" : "Sign in securely →"}</button></form></main>;
  }
  return children({ session, signOut: signOutOwner });
}
