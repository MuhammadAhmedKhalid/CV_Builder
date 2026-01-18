"use client";

import AppHeader from "@/components/AppHeader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import EmailLoginButton from "@/components/EmailLoginButton";
import { isLoggedIn, setUser } from "@/utils/auth";
import * as COLORS from "@/lib/colors";
import { ROUTES } from "@/lib/paths";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) router.replace(ROUTES.HOME);

    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && (state === 'email_login' || state === 'google_login')) {
      handleOAuthCallback(code, state);
    }
  }, [router]);

  const handleOAuthCallback = async (code: string, state: string) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7276";
      const redirectUri = `${window.location.origin}/login`;
      const provider = state === 'google_login' ? 'google' : 'auth0';

      // First exchange code for access token
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

      // Then authenticate with the main auth endpoint (this creates database entries)
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

      // Redirect to home and clean URL
      router.replace(ROUTES.HOME);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Login failed: ${errorMessage}`);

      // Clean URL parameters
      window.history.replaceState({}, '', '/login');
    }
  };

  return (
    <div style={styles.page}>
      <AppHeader />

      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>
            Sign in to continue building your CV
          </p>

          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          <GoogleLoginButton
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
    marginBottom: "16px",
    padding: "12px",
    backgroundColor: COLORS.SECONDARY,
    color: COLORS.PRIMARY_DARK,
    borderRadius: "8px",
    fontSize: "13px",
    border: `1px solid ${COLORS.BORDER_PRIMARY}`,
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
};