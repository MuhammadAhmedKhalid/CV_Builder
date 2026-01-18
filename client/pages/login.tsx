"use client";

import AppHeader from "@/components/AppHeader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import EmailLoginButton from "@/components/EmailLoginButton";
import { isLoggedIn, setUser } from "@/utils/auth";
import * as COLORS from "@/lib/colors";
import { ROUTES } from "@/lib/paths";
import { FaExclamationCircle } from 'react-icons/fa';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // NEW: block initial render
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      // Already logged in → redirect immediately
      if (isLoggedIn()) {
        router.replace(ROUTES.HOME);
        return;
      }

      // Handle OAuth callback
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");

      if (code && (state === "email_login" || state === "google_login")) {
        setIsLoading(true);
        await handleOAuthCallback(code, state);
        return;
      }

      // No auth action → show login UI
      setIsCheckingAuth(false);
    };

    initAuth();
  }, [router]);

  const handleOAuthCallback = async (code: string, state: string) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7276";
      const redirectUri = `${window.location.origin}/login`;
      const provider = state === 'google_login' ? 'google' : 'auth0';

      // Exchange code for access token
      const tokenResponse = await fetch(`${apiBaseUrl}/auth/${provider}/exchange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, redirectUri })
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error(errorData?.error || 'Failed to exchange code for token');
      }

      const { token } = await tokenResponse.json();

      // Authenticate with main auth endpoint
      const authResponse = await fetch(`${apiBaseUrl}/auth/${provider}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (!authResponse.ok) {
        const errorData = await authResponse.json();
        throw new Error(errorData?.error || 'Failed to authenticate');
      }

      const { token: jwtToken, user } = await authResponse.json();

      // Store JWT token and user info
      localStorage.setItem('token', jwtToken);
      setUser({ name: user.name, picture: user.picture });

      // Clean URL and redirect home
      window.history.replaceState({}, '', '/login');
      router.replace(ROUTES.HOME);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Login failed: ${errorMessage}`);
      setIsLoading(false);
      window.history.replaceState({}, '', '/login');
      setIsCheckingAuth(false);
    }
  };

  // Early return for loading or auth checking
  if (isCheckingAuth || isLoading) {
    return (
      <div style={styles.page}>
        <AppHeader />
        <div style={styles.container}>
          <div style={styles.loadingSpinner}>
            <div style={styles.spinner}></div>
            <div style={styles.loadingText}>Authenticating...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <AppHeader />

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h1 style={styles.title}>Welcome Back</h1>
            <p style={styles.subtitle}>
              Sign in to continue building your CV
            </p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <div style={styles.errorIcon}>
                <FaExclamationCircle size={20} color={COLORS.ERROR_TEXT} />
              </div>
              <div style={styles.errorContent}>
                <div style={styles.errorTitle}>Authentication Error</div>
                <div style={styles.errorMessage}>{error}</div>
              </div>
            </div>
          )}

          <div style={styles.buttonContainer}>
            <GoogleLoginButton
              disabled={isLoading}
              onLoginSuccess={(token, user) => {
                setUser({ name: user.name, picture: user.picture });
                setError(null);
                router.replace(ROUTES.HOME);
              }}
              onLoginError={(errMsg) =>
                setError(`Login failed: ${errMsg}`)
              }
            />

            <div style={styles.dividerContainer}>
              <div style={styles.dividerLine}></div>
              <span style={styles.dividerText}>OR</span>
              <div style={styles.dividerLine}></div>
            </div>

            <EmailLoginButton
              disabled={isLoading}
              onLoginSuccess={(token, user) => {
                setUser({ name: user.name, picture: user.picture });
                setError(null);
                router.replace(ROUTES.HOME);
              }}
              onLoginError={(errMsg) =>
                setError(`Login failed: ${errMsg}`)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: COLORS.LIGHT_GRAY,
  },

  container: {
    height: "calc(100vh - 64px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
  },

  card: {
    backgroundColor: COLORS.WHITE,
    width: "100%",
    maxWidth: "420px",
    padding: "32px",
    borderRadius: "16px",
    boxShadow: `0 10px 30px ${COLORS.SHADOW_MEDIUM}`,
    border: `1px solid ${COLORS.SECONDARY}`,
    textAlign: "center",
  },

  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: COLORS.PRIMARY_DARK,
    marginBottom: "8px",
  },

  subtitle: {
    fontSize: "14px",
    color: COLORS.PRIMARY,
    marginBottom: "24px",
  },

  errorBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: COLORS.ERROR_BG,
    color: COLORS.ERROR_TEXT,
    borderRadius: '8px',
    border: `1px solid ${COLORS.ERROR_TEXT}20`,
    textAlign: 'left',
  },

  errorIcon: {
    flexShrink: 0,
    marginTop: '2px',
  },

  errorContent: {
    flex: 1,
  },

  errorTitle: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '4px',
  },

  errorMessage: {
    fontSize: '14px',
    lineHeight: 1.4,
    opacity: 0.9,
  },

  dividerContainer: {
    display: "flex",
    alignItems: "center",
    margin: "16px 0",
    gap: "12px",
  },

  dividerLine: {
    flex: 1,
    height: "1px",
    backgroundColor: COLORS.BORDER_PRIMARY,
  },

  dividerText: {
    fontSize: "12px",
    color: COLORS.PRIMARY,
    fontWeight: "500",
    padding: "0 8px",
  },

  cardHeader: {
    marginBottom: "24px",
  },

  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  loadingSpinner: {
    backgroundColor: COLORS.WHITE,
    padding: "20px 40px",
    borderRadius: "8px",
    boxShadow: `0 4px 12px ${COLORS.SHADOW_MEDIUM}`,
    fontSize: "16px",
    fontWeight: "500",
    color: COLORS.PRIMARY_DARK,
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  spinner: {
    width: "20px",
    height: "20px",
    border: `2px solid ${COLORS.PRIMARY}`,
    borderTop: "2px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    fontSize: "16px",
    fontWeight: "500",
    color: COLORS.PRIMARY_DARK,
  },
};