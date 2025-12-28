"use client";

import { useEffect, useState } from "react";
import { isLoggedIn, logout } from "@/utils/auth";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
  };

  return (
    <div>
      <h1>Welcome to CV Builder</h1>

      {loggedIn ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button onClick={() => router.push("/login")}>Login</button>
      )}
    </div>
  );
}