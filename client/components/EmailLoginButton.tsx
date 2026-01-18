"use client";

import { useState } from "react";
import * as COLORS from "@/lib/colors";

interface EmailLoginButtonProps {
  disabled?: boolean;
  onLoginSuccess?: (token: string, user: any) => void;
  onLoginError?: (error: string) => void;
}

export default function EmailLoginButton({ disabled, onLoginSuccess, onLoginError }: EmailLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleEmailLogin = async () => {
    setIsLoading(true);
    
    try {
      // Use backend to get Auth0 authorization URL
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7276";
      const redirectUri = `${window.location.origin}/login`; // Redirect back to login page
      
      const response = await fetch(`${apiBaseUrl}/auth/auth0/authorize?redirectUri=${encodeURIComponent(redirectUri)}&state=email_login`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Failed to get authorization URL");
      }
      
      const data = await response.json();
      
      // Redirect to Auth0 login page
      window.location.href = data.authorizationUrl;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      if (onLoginError) onLoginError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleEmailLogin}
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
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={styles.icon}
        >
          <path
            d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 6L12 13L2 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span style={styles.buttonText}>
          {isLoading ? "Signing in..." : "Sign in with Email"}
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