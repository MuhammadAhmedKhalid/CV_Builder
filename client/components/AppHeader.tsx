"use client";

import { useState, useEffect, useRef, CSSProperties } from "react";
import Image from "next/image";
import { isLoggedIn, logout, getUser } from "@/utils/auth";
import { useRouter } from "next/navigation";
import * as Colors from "@/lib/colors";

// Inline styles
const styles: { [key: string]: CSSProperties } = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
    padding: "0.75rem 1.5rem",
    boxShadow: `0 4px 10px ${Colors.SHADOW_LIGHT}`,
    position: "sticky",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    boxSizing: "border-box",
    margin: 0,
    zIndex: 50,
  },
  logo: {
    fontSize: "1.8rem",
    fontWeight: 700,
    color: Colors.PRIMARY,
    cursor: "pointer",
    transition: "color 0.2s ease",
  },
  logoImage: {
    cursor: "pointer",
    display: "block",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    cursor: "pointer",
    border: `2px solid ${Colors.PRIMARY_LIGHT}`,
    transition: "transform 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loginButton: {
    padding: "0.5rem 1.2rem",
    backgroundColor: Colors.PRIMARY_LIGHT,
    color: Colors.WHITE,
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
    backgroundColor: Colors.LIGHT_GRAY,
    border: `1px solid ${Colors.PRIMARY_LIGHT}`,
    borderRadius: "10px",
    width: "160px",
    boxShadow: `0 6px 12px ${Colors.SHADOW_MEDIUM}`,
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
    color: Colors.PRIMARY,
    transition: "background-color 0.2s ease",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    height: "44px",
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    overflow: "hidden",
    border: `2px solid ${Colors.PRIMARY_LIGHT}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

// Inline sub-components
const Logo = ({ onClick }: { onClick: () => void }) => (
  <div onClick={onClick} style={styles.logoContainer}>
    <Image
      src="/images/cv_builder_logo.png"
      alt="CV Builder"
      width={100}
      height={30}
      priority
      style={{ height: "auto", width: "auto", maxWidth: "100px" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLImageElement).style.opacity = "0.85";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLImageElement).style.opacity = "1";
      }}
    />
  </div>
);

const Avatar = ({
  src,
  alt,
  onClick,
}: {
  src: string;
  alt: string;
  onClick: () => void;
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <div style={styles.avatarContainer}>
      <Image
        src={imgSrc}
        alt={alt}
        width={44}
        height={44}
        style={{ display: "block", objectFit: "cover", cursor: "pointer" }}
        onClick={onClick}
        onError={() => {
          setImgSrc("/images/pfp_avatar.png");
        }}
      />
    </div>
  );
};

const LoginButton = ({ onClick }: { onClick: () => void }) => (
  <button
    style={styles.loginButton}
    onClick={onClick}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = Colors.PRIMARY_LIGHTER)}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = Colors.PRIMARY_LIGHT)}
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
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = Colors.SECONDARY)}
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