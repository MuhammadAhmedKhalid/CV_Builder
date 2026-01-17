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

    const handleScriptLoad = () => {
      const buttonDiv = document.getElementById("google-signin-button");
      if (!window.google || !buttonDiv) return;

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(buttonDiv, { theme: "outline", size: "large" });
    };

    script.addEventListener("load", handleScriptLoad);

    return () => {
      script.removeEventListener("load", handleScriptLoad);
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = async (response: any) => {
    const token = response.credential;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7276";

    try {
      const res = await fetch(`${apiBaseUrl}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token })
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage = errorData?.error || `HTTP ${res.status}`;
        if (onLoginError) onLoginError(errorMessage);
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);

      if (onLoginSuccess) onLoginSuccess(data.token, data.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      if (onLoginError) onLoginError(errorMessage);
    }
  };

  return <div id="google-signin-button"></div>;
}