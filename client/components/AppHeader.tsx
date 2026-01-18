"use client";

import { useState, useEffect, useRef, CSSProperties } from "react";
import Image from "next/image";
import { isLoggedIn, logout, getUser } from "@/utils/auth";
import { useRouter, usePathname } from "next/navigation";
import * as Colors from "@/lib/colors";
import { IMAGES, ROUTES } from "@/lib/paths";
import ConfirmModal from "@/components/ConfirmModal";

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
    top: "56px",
    backgroundColor: Colors.WHITE,
    border: `1px solid ${Colors.BORDER_PRIMARY}`,
    borderRadius: "12px",
    width: "180px",
    boxShadow: `0 12px 24px ${Colors.SHADOW_MEDIUM}`,
    padding: "0.4rem",
    zIndex: 100,
  },
  dropdownItem: {
    width: "100%",
    padding: "0.65rem 0.75rem",
    textAlign: "left",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "14px",
    color: Colors.PRIMARY_DARK,
    borderRadius: "8px",
    transition: "background-color 0.2s ease, color 0.2s ease",
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
      src={IMAGES.LOGO}
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
          setImgSrc(IMAGES.DEFAULT_AVATAR);
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
  onSettings,
  onProfile,
}: {
  onLogout: () => void;
  onSettings: () => void;
  onProfile: () => void;
}) => (
  <div style={styles.dropdown}>
    <button
      style={styles.dropdownItem}
      onClick={onProfile}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = Colors.SECONDARY;
        e.currentTarget.style.color = Colors.PRIMARY;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = Colors.PRIMARY_DARK;
      }}
    >
      Profile
    </button>

    <button
      style={styles.dropdownItem}
      onClick={onSettings}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = Colors.SECONDARY;
        e.currentTarget.style.color = Colors.PRIMARY;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = Colors.PRIMARY_DARK;
      }}
    >
      Settings
    </button>

    {/* Divider */}
    <div
      style={{
        height: "1px",
        backgroundColor: Colors.BORDER_PRIMARY,
        margin: "4px 0",
        opacity: 0.6,
      }}
    />

    <button
      style={styles.dropdownItem}
      onClick={onLogout}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = Colors.SECONDARY;
        e.currentTarget.style.color = Colors.PRIMARY;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = Colors.PRIMARY_DARK;
      }}
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
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
    router.replace(ROUTES.LOGIN);
  };

  return (
    <header style={styles.header}>
      <Logo onClick={() => router.push(ROUTES.HOME)} />

      <div style={styles.userSection}>
        {loggedIn && user ? (
          <div ref={dropdownRef}>
            <Avatar
              src={user.picture}
              alt={user.name}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <Dropdown
                onLogout={() => setShowLogoutConfirm(true)}
                onSettings={() => {
                  setDropdownOpen(false);
                  router.push(ROUTES.SETTINGS);
                }}
                onProfile={() => {
                  setDropdownOpen(false);
                  router.push(ROUTES.PROFILE);
                }}
              />
            )}
          </div>
        ) : (
          pathname !== ROUTES.LOGIN && (
            <LoginButton onClick={() => router.push(ROUTES.LOGIN)} />
          )
        )}
      </div>
      <ConfirmModal
        open={showLogoutConfirm}
        title="Logout"
        description="Are you sure you want to logout from your account?"
        confirmText="Logout"
        cancelText="Cancel"
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          handleLogout();
        }}
      />
    </header>
  );
}