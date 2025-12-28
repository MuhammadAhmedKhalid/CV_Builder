// pages/login.tsx
"use client";

import { useState } from "react";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Login</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <GoogleLoginButton
          onLoginSuccess={(token, user) => {
            console.log("JWT:", token);
            console.log("User info:", user);
            setError(null);
            // Redirect to dashboard or home page
            window.location.href = "/";
          }}
          onLoginError={(errorMsg) => {
            setError(`Login failed: ${errorMsg}`);
            setLoading(false);
          }}
        />
      </div>
    </div>
  );
}