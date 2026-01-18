"use client";

import { useState } from "react";
import * as COLORS from "@/lib/colors";

interface GoogleLoginButtonProps {
  disabled?: boolean;
}

export default function GoogleLoginButton({ disabled }: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      // Use backend to get Google authorization URL
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7276";
      const redirectUri = `${window.location.origin}/login`; // Redirect back to login page
      
      const response = await fetch(`${apiBaseUrl}/auth/google/authorize?redirectUri=${encodeURIComponent(redirectUri)}&state=google_login`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Failed to get authorization URL");
      }
      
      const data = await response.json();
      
      // Redirect to Google login page
      window.location.href = data.authorizationUrl;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Google login error:", errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={isLoading || disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...styles.button,
        ...(isLoading || disabled ? styles.buttonDisabled : isHovered ? styles.buttonHover : {}),
      }}
    >
      <div style={styles.buttonContent}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          style={styles.icon}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <span style={styles.buttonText}>
          {isLoading ? "Signing in..." : "Sign in with Google"}
        </span>
      </div>
    </button>
  );
}

/* ================= STYLES ================= */

const styles: Record<string, React.CSSProperties> = {
  button: {
    width: "100%",
    height: "50px",
    borderRadius: "8px",
    backgroundColor: COLORS.WHITE,
    color: COLORS.PRIMARY_DARK,
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid ${COLORS.BORDER_PRIMARY}`,
    boxShadow: `0 1px 3px ${COLORS.SHADOW_LIGHT}`,
    outline: "none",
    fontFamily: "inherit",
    display: "flex",
  },

  buttonHover: {
    backgroundColor: COLORS.SECONDARY,
    boxShadow: `0 2px 8px ${COLORS.SHADOW_MEDIUM}`,
    transform: "translateY(-1px)",
  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    transform: "none",
  },

  buttonContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  },

  icon: {
    width: "20px",
    height: "20px",
    flexShrink: 0,
  },

  buttonText: {
    fontSize: "16px",
    fontWeight: "500",
  },
};