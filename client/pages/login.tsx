"use client";

import AppHeader from "@/components/AppHeader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { isLoggedIn, setUser } from "@/utils/auth";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Redirect to home if already logged in
  useEffect(() => {
    if (isLoggedIn()) router.replace("/");
  }, [router]);

  return (
    <div>
      <AppHeader />
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Login</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <GoogleLoginButton
            onLoginSuccess={(token, user) => {
              setUser({ name: user.name, picture: user.picture });
              setError(null);
              router.replace("/"); // Redirect after login
            }}
            onLoginError={(errMsg) => setError(`Login failed: ${errMsg}`)}
          />
        </div>
      </div>
    </div>
  );
}