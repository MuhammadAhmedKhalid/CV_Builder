"use client";

import { useState, useEffect, useRef, CSSProperties } from "react";
import { isLoggedIn, logout, getUser } from "@/utils/auth";
import { useRouter } from "next/navigation";

// Inline styles
const styles: { [key: string]: CSSProperties } = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: "1rem 2rem",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  logo: {
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#047857",
    cursor: "pointer",
    transition: "color 0.2s ease",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    position: "relative",
  },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    cursor: "pointer",
    border: "2px solid #10b981",
    transition: "transform 0.2s ease",
  },
  loginButton: {
    padding: "0.5rem 1.2rem",
    backgroundColor: "#10b981",
    color: "white",
    fontWeight: 500,
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: "50px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #10b981",
    borderRadius: "10px",
    width: "160px",
    boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
    padding: "0.5rem 0",
    zIndex: 100,
  },
  dropdownItem: {
    width: "100%",
    padding: "0.5rem 1rem",
    textAlign: "left",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontWeight: 500,
    color: "#047857",
    transition: "background-color 0.2s ease",
  },
};

// Inline sub-components
const Logo = ({ onClick }: { onClick: () => void }) => (
  <h1
    style={styles.logo}
    onClick={onClick}
    onMouseEnter={(e) => (e.currentTarget.style.color = "#065f46")}
    onMouseLeave={(e) => (e.currentTarget.style.color = "#047857")}
  >
    CV Builder
  </h1>
);

const Avatar = ({
  src,
  alt,
  onClick,
}: {
  src: string;
  alt: string;
  onClick: () => void;
}) => (
  <img
    src={src}
    alt={alt}
    style={styles.avatar}
    onClick={onClick}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  />
);

const LoginButton = ({ onClick }: { onClick: () => void }) => (
  <button
    style={styles.loginButton}
    onClick={onClick}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#10b981")}
  >
    Login
  </button>
);

const Dropdown = ({
  onLogout,
}: {
  onLogout: () => void;
}) => (
  <div style={styles.dropdown}>
    <button
      style={styles.dropdownItem}
      onClick={onLogout}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d1fae5")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      Logout
    </button>
  </div>
);

export default function AppHeader() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; picture: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setUser(getUser());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    setUser(null);
    setDropdownOpen(false);
    router.replace("/login");
  };

  return (
    <header style={styles.header}>
      <Logo onClick={() => router.push("/")} />

      <div style={styles.userSection}>
        {loggedIn && user ? (
          <div ref={dropdownRef}>
            <Avatar
              src={user.picture}
              alt={user.name}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && <Dropdown onLogout={handleLogout} />}
          </div>
        ) : (
          <LoginButton onClick={() => router.push("/login")} />
        )}
      </div>
    </header>
  );
}