import { Component, createContext, useContext, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Only these Google accounts may open the workspace.
const ALLOWED_EMAILS = ["kylematthewberry@gmail.com", "rochelleberry731@gmail.com"];

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const configured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
let auth = null;
let db = null;
let storage = null;
let initError = "";
if (configured) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    try {
      db = getFirestore(app);
    } catch (dbError) {
      initError = `Cloud database unavailable: ${dbError?.message || dbError}`;
    }
    try {
      storage = getStorage(app);
    } catch (storageError) {
      initError = `Cloud file storage unavailable: ${storageError?.message || storageError}`;
    }
  } catch (error) {
    initError = `Workspace services failed to start: ${error?.message || error}`;
    auth = null;
    db = null;
    storage = null;
  }
}

export { auth, db, storage, initError };

// Catches any render/effect crash and shows it instead of a blank page.
export class WorkspaceErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error) {
    console.error("Workspace crashed:", error);
  }
  render() {
    if (this.state.error) {
      const message = this.state.error?.message || String(this.state.error);
      return (
        <div className="auth-screen">
          <div className="auth-card">
            <p className="auth-eyebrow">Fired Arts Studio · Kokomo, Indiana</p>
            <h1>Regional Growth HQ</h1>
            <p className="auth-note">The workspace hit a startup problem and stopped instead of showing a blank page.</p>
            <p className="auth-error">{message}</p>
            <button className="primary-button" type="button" onClick={() => window.location.reload()}>
              Reload workspace
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const AuthContext = createContext({ user: null, state: "checking" });
export const useAuth = () => useContext(AuthContext);

export async function signOutUser() {
  if (auth) await signOut(auth);
}

function friendlyError(code, fallback) {
  if (code === "auth/operation-not-allowed") return "Google sign-in is not enabled for this project yet.";
  if (code === "auth/unauthorized-domain") return "This domain is not authorized for sign-in.";
  if (code === "auth/popup-closed-by-user") return "";
  if (code === "auth/cancelled-popup-request") return "";
  return fallback || "Sign-in did not complete. Please try again.";
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.5h6.5c-.1 1.1-.8 2.7-2.4 3.8v.1l3.5 2.7h.1c2.2-2 3.8-5 3.8-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5h-.1l-3.6 2.8v.1C3.5 21.3 7.5 24 12 24z" />
      <path fill="#FBBC05" d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4v-.1L1.6 6.7H1.5C.5 8.5 0 10.2 0 12s.5 3.5 1.4 5.1l3.8-2.7z" />
      <path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17 1.1 14.9 0 12 0 7.5 0 3.5 2.7 1.4 6.6l3.8 2.9c1-2.8 3.7-4.8 6.8-4.8z" />
    </svg>
  );
}

export function AuthGate({ children }) {
  const [state, setState] = useState("checking"); // checking | signed-out | denied | ready
  const [user, setUser] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth) {
      setState("signed-out");
      return undefined;
    }
    const stop = onAuthStateChanged(auth, (next) => {
      setUser(next);
      if (!next) {
        setState("signed-out");
      } else if (ALLOWED_EMAILS.includes((next.email || "").toLowerCase())) {
        setState("ready");
      } else {
        setState("denied");
      }
    });
    return stop;
  }, []);

  const beginSignIn = async () => {
    if (!auth || busy) return;
    setBusy(true);
    setError("");
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      if (err?.code === "auth/popup-blocked") {
        try {
          await signInWithRedirect(auth, new GoogleAuthProvider());
          return;
        } catch (redirectErr) {
          setError(friendlyError(redirectErr?.code, redirectErr?.message));
        }
      } else {
        setError(friendlyError(err?.code, err?.message));
      }
    } finally {
      setBusy(false);
    }
  };

  if (state === "checking") {
    return (
      <div className="auth-screen">
        <p className="auth-status">Loading workspace…</p>
      </div>
    );
  }

  if (state === "ready") {
    return <AuthContext.Provider value={{ user, state }}>{children}</AuthContext.Provider>;
  }

  return (
    <AuthContext.Provider value={{ user, state }}>
      <div className="auth-screen">
        <div className="auth-card">
          <p className="auth-eyebrow">Fired Arts Studio · Kokomo, Indiana</p>
          <h1>Regional Growth HQ</h1>
          {state === "denied" ? (
            <>
              <p className="auth-note">
                Signed in as <strong>{user?.email}</strong>, which is not an authorized owner account for this workspace.
              </p>
              <button className="primary-button" type="button" onClick={signOutUser}>
                Sign out
              </button>
              <p className="auth-hint">Use one of the two authorized Google accounts to continue.</p>
            </>
          ) : (
            <>
              <p className="auth-note">This workspace is private. Sign in with an authorized Google account to continue.</p>
              {!configured && (
                <p className="auth-error">Sign-in is not configured for this deployment yet (missing Firebase settings).</p>
              )}
              <button
                className="google-btn"
                type="button"
                onClick={beginSignIn}
                disabled={!configured || busy}
              >
                <GoogleMark />
                {busy ? "Opening Google…" : "Sign in with Google"}
              </button>
              {error && <p className="auth-error">{error}</p>}
              <p className="auth-hint">Only the two authorized owner accounts can open this workspace.</p>
            </>
          )}
        </div>
      </div>
    </AuthContext.Provider>
  );
}
