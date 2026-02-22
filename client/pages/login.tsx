"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import EmailLoginButton from "@/components/EmailLoginButton";
import { isLoggedIn, setUser } from "@/utils/auth";
import { setToken } from "@/utils/cookies";
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
      setToken(jwtToken);
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
      <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-gray-950 to-gray-950 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <div className="text-emerald-100 font-medium">Authenticating...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-gray-950 to-gray-950 relative overflow-hidden">
      {/* Original background decorations */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      
      <div className="relative flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Brand section */}
          <div className="text-center mb-10">
            <img 
              src="/images/cv_builder_icon.png" 
              alt="CV Builder" 
              className="w-32 h-32 object-contain mx-auto"
            />
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-emerald-200/70 text-lg">
              Sign in to continue
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <FaExclamationCircle size={20} className="text-red-400" />
                </div>
                <div className="flex-1">
                  <div className="text-red-300 font-semibold text-sm mb-1">Authentication Error</div>
                  <div className="text-red-200/80 text-sm">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced login form container */}
          <div className="bg-white/8 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl shadow-black/30">
            <div className="space-y-4">
              <GoogleLoginButton
                disabled={isLoading}
              />

              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                <span className="text-emerald-300/60 text-sm font-medium px-3 tracking-wide">OR</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
              </div>

              <EmailLoginButton
                disabled={isLoading}
              />
            </div>
            
            {/* Additional info */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-center text-emerald-200/50 text-sm">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}