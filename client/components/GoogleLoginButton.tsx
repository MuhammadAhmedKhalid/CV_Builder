"use client";

import { useEffect } from "react";

interface GoogleLoginButtonProps {
  onLoginSuccess?: (token: string, user: any) => void;
  onLoginError?: (error: string) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleLoginButton({ onLoginSuccess, onLoginError }: GoogleLoginButtonProps) {
  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large" }
      );
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = async (response: any) => {
    const idToken = response.credential;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7276";

    try {
      const res = await fetch(`${apiBaseUrl}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = errorData?.error || `HTTP ${res.status}`;
        console.error("Google login failed:", errorMessage);
        if (onLoginError) onLoginError(errorMessage);
        return;
      }

      const data = await res.json();

      // Store JWT locally
      localStorage.setItem("token", data.token);

      if (onLoginSuccess) onLoginSuccess(data.token, data.user);
      console.log("Logged in user:", data.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Google login failed:", errorMessage);
      if (onLoginError) onLoginError(errorMessage);
    }
  };

  return <div id="google-signin-button"></div>;
}