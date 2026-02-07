"use client";

import { useState, useEffect, useRef, CSSProperties } from "react";
import Image from "next/image";
import { isLoggedIn, logout, getUser } from "@/utils/auth";
import { useRouter, usePathname } from "next/navigation";
import * as Colors from "@/lib/colors";
import { IMAGES, ROUTES } from "@/lib/paths";
import ConfirmModal from "@/components/ConfirmModal";
import { useMobile } from "@/hooks/useMobile";

const styles: { [key: string]: CSSProperties } = {
  userSection: {
    display: "flex",
    alignItems: "center",
    position: "relative",
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
    cursor: "pointer",
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
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "14px",
    color: Colors.PRIMARY_DARK,
    borderRadius: "8px",
    textAlign: "left",
  },
  bottomNavbar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "linear-gradient(to bottom, #030712, #000000)",
    borderTop: `1px solid rgba(16, 185, 129, 0.2)`,
    boxShadow: `0 -4px 20px rgba(0, 0, 0, 0.5)`,
    display: "flex",
    justifyContent: "space-around",
    padding: "12px",
    zIndex: 50,
    height: "64px",
  },
  bottomNavButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "rgba(255, 255, 255, 0.7)",
    transition: "all 0.3s ease",
    padding: "6px",
    borderRadius: "12px",
    position: "relative",
  },
  bottomNavIcon: {
    width: "24px",
    height: "24px",
    transition: "all 0.3s ease",
  },
  bottomNavIconActive: {
    width: "24px",
    height: "24px",
    filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))",
    color: Colors.PRIMARY_LIGHT,
    transition: "all 0.3s ease",
  },
  overlayBackdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    zIndex: 99,
  },
  overlay: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "linear-gradient(to bottom, rgba(16, 185, 129, 0.05), rgba(34, 197, 94, 0.08))",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderTop: `1px solid rgba(16, 185, 129, 0.2)`,
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    padding: "24px",
    zIndex: 100,
    boxShadow: "0 -8px 32px rgba(16, 185, 129, 0.15)",
  },
  overlayItem: {
    width: "100%",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.05))",
    border: `1px solid rgba(16, 185, 129, 0.15)`,
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 500,
    borderRadius: "16px",
    color: "rgba(255, 255, 255, 0.9)",
    transition: "all 0.3s ease",
    marginBottom: "12px",
  },
};

const BottomNavbar = ({
  onHomeClick,
  onMoreClick,
  onLoginClick,
  isHomeActive,
  isLoggedIn,
}: {
  onHomeClick: () => void;
  onMoreClick: () => void;
  onLoginClick?: () => void;
  isHomeActive: boolean;
  isLoggedIn: boolean;
}) => (
  <div style={styles.bottomNavbar}>
    <button style={styles.bottomNavButton} onClick={onHomeClick}>
      <svg
        style={isHomeActive ? styles.bottomNavIconActive : styles.bottomNavIcon}
        fill="none"
        stroke={isHomeActive ? Colors.PRIMARY_LIGHT : "currentColor"}
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    </button>
    <button style={styles.bottomNavButton} onClick={isLoggedIn ? onMoreClick : onLoginClick}>
      <svg
        style={styles.bottomNavIcon}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        {isLoggedIn ? (
          <>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </>
        ) : (
          <>
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </>
        )}
      </svg>
    </button>
  </div>
);

const BottomOverlayForLoggedOut = ({
  onLogin,
  onClose,
}: {
  onLogin: () => void;
  onClose: () => void;
}) => (
  <>
    <div style={styles.overlayBackdrop} onClick={onClose} />
    <div style={styles.overlay}>
      <button style={styles.overlayItem} onClick={onLogin}>
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          style={{ marginRight: "12px" }}
        >
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
          <polyline points="10 17 15 12 10 7"></polyline>
          <line x1="15" y1="12" x2="3" y2="12"></line>
        </svg>
        Login
      </button>
    </div>
  </>
);

const BottomOverlay = ({
  onProfile,
  onSettings,
  onLogout,
  onClose,
}: {
  onProfile: () => void;
  onSettings: () => void;
  onLogout: () => void;
  onClose: () => void;
}) => (
  <>
    <div style={styles.overlayBackdrop} onClick={onClose} />
    <div style={styles.overlay}>
      <button style={styles.overlayItem} onClick={onProfile}>
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          style={{ marginRight: "12px" }}
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        Profile
      </button>
      <button style={styles.overlayItem} onClick={onSettings}>
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          style={{ marginRight: "12px" }}
        >
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
        Settings
      </button>
      <button style={styles.overlayItem} onClick={onLogout}>
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          style={{ marginRight: "12px" }}
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        Logout
      </button>
    </div>
  </>
);

const Logo = ({ onClick }: { onClick: () => void }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-3 cursor-pointer select-none"
  >
    <Image
      src={IMAGES.LOGO}
      alt="CV Builder"
      width={100}
      height={40}
      priority
      className="h-10 w-auto"
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

  useEffect(() => setImgSrc(src), [src]);

  return (
    <div style={styles.avatarContainer} onClick={onClick}>
      <Image
        src={imgSrc}
        alt={alt}
        width={44}
        height={44}
        className="object-cover"
        onError={() => setImgSrc(IMAGES.DEFAULT_AVATAR)}
      />
    </div>
  );
};

const LoginButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="px-5 py-2 font-semibold text-emerald-400 transition-all hover:text-emerald-300 hover:underline underline-offset-4"
  >
    Log in
  </button>
);

const Dropdown = ({
  onProfile,
  onSettings,
  onLogout,
}: {
  onProfile: () => void;
  onSettings: () => void;
  onLogout: () => void;
}) => (
  <div style={styles.dropdown}>
    <button style={styles.dropdownItem} onClick={onProfile}>
      Profile
    </button>
    <button style={styles.dropdownItem} onClick={onSettings}>
      Settings
    </button>
    <div className="my-1 h-px bg-gray-200" />
    <button style={styles.dropdownItem} onClick={onLogout}>
      Logout
    </button>
  </div>
);

/* -------------------------------- MAIN -------------------------------- */

export default function AppHeader() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; picture: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [bottomOverlayOpen, setBottomOverlayOpen] = useState(false);
  const isMobile = useMobile();
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setUser(getUser());
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* HEADER */}

      <header className="sticky top-0 z-40 border-b border-emerald-500/20 bg-emerald-950/60 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Logo onClick={() => router.push(ROUTES.HOME)} />

            {!isMobile && (
              <div style={styles.userSection} ref={dropdownRef}>
                {loggedIn && user ? (
                  <>
                    <Avatar
                      src={user.picture}
                      alt={user.name}
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    />
                    {dropdownOpen && (
                      <Dropdown
                        onProfile={() => router.push(ROUTES.PROFILE)}
                        onSettings={() => router.push(ROUTES.SETTINGS)}
                        onLogout={() => setShowLogoutConfirm(true)}
                      />
                    )}
                  </>
                ) : (
                  pathname !== ROUTES.LOGIN && (
                    <LoginButton onClick={() => router.push(ROUTES.LOGIN)} />
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVBAR */}

      {isMobile && (
        <>
          <BottomNavbar
            onHomeClick={() => router.push(ROUTES.HOME)}
            onMoreClick={() => setBottomOverlayOpen(true)}
            onLoginClick={() => router.push(ROUTES.LOGIN)}
            isHomeActive={pathname === ROUTES.HOME}
            isLoggedIn={loggedIn}
          />

          {bottomOverlayOpen && (
            <>
              {loggedIn ? (
                <BottomOverlay
                  onProfile={() => {
                    setBottomOverlayOpen(false);
                    router.push(ROUTES.PROFILE);
                  }}
                  onSettings={() => {
                    setBottomOverlayOpen(false);
                    router.push(ROUTES.SETTINGS);
                  }}
                  onLogout={() => {
                    setBottomOverlayOpen(false);
                    setShowLogoutConfirm(true);
                  }}
                  onClose={() => setBottomOverlayOpen(false)}
                />
              ) : (
                <BottomOverlayForLoggedOut
                  onLogin={() => {
                    setBottomOverlayOpen(false);
                    router.push(ROUTES.LOGIN);
                  }}
                  onClose={() => setBottomOverlayOpen(false)}
                />
              )}
            </>
          )}
        </>
      )}

      {/* LOGOUT CONFIRM */}
      <ConfirmModal
        open={showLogoutConfirm}
        title="Logout"
        description="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          logout();
          router.replace(ROUTES.LOGIN);
        }}
      />
    </>
  );
}