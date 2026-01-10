"use client";

import AppHeader from "@/components/AppHeader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { isLoggedIn, setUser } from "@/utils/auth";
import * as COLORS from "@/lib/colors";
import { ROUTES } from "@/lib/paths";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) router.replace(ROUTES.HOME);
  }, [router]);

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
};