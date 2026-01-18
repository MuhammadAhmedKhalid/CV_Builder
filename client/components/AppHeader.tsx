"use client";

import { useState, useEffect, useRef, CSSProperties } from "react";
import Image from "next/image";
import { isLoggedIn, logout, getUser } from "@/utils/auth";
import { useRouter, usePathname } from "next/navigation";
import * as Colors from "@/lib/colors";
import { IMAGES, ROUTES } from "@/lib/paths";
import ConfirmModal from "@/components/ConfirmModal";

// Mobile breakpoint
const MOBILE_BREAKPOINT = 768;

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
  mobileHidden: {
    display: 'block',
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
  loginButton: {
    padding: "0.5rem 1.2rem",
    backgroundColor: "transparent",
    color: Colors.PRIMARY_DARK,
    fontWeight: 500,
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "color 0.2s ease, background-color 0.2s ease",
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
  // Bottom navbar styles
  bottomNavbar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.WHITE,
    boxShadow: `0 -4px 10px ${Colors.SHADOW_LIGHT}`,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '8px 0',
    zIndex: 50,
  },
  bottomNavButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 16px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    transition: "color 0.2s ease, background-color 0.2s ease",
    color: Colors.PRIMARY_DARK,
    fontSize: "12px",
    fontWeight: 500,
    borderRadius: "12px",
  },
  bottomNavButtonActive: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 16px",
    backgroundColor: Colors.SECONDARY,
    border: "none",
    cursor: "pointer",
    transition: "color 0.2s ease, background-color 0.2s ease",
    color: Colors.PRIMARY,
    fontSize: "12px",
    fontWeight: 500,
    borderRadius: "12px",
  },
  bottomNavIcon: {
    width: "24px",
    height: "24px",
    marginBottom: "4px",
  },
  bottomNavIconActive: {
    width: "24px",
    height: "24px",
    marginBottom: "4px",
    stroke: Colors.PRIMARY,
  },
  // Bottom overlay styles
  bottomOverlay: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.WHITE,
    borderTop: `1px solid ${Colors.BORDER_PRIMARY}`,
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
    boxShadow: `0 -4px 20px ${Colors.SHADOW_MEDIUM}`,
    padding: "20px",
    zIndex: 100,
    transform: "translateY(0)",
    transition: "transform 0.3s ease",
  },
  bottomOverlayItem: {
    width: "100%",
    padding: "16px",
    textAlign: "left",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "16px",
    color: Colors.PRIMARY_DARK,
    borderRadius: "12px",
    transition: "background-color 0.2s ease",
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  },
  bottomOverlayBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.OVERLAY,
    zIndex: 99,
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
    onMouseEnter={(e) => {
      e.currentTarget.style.textDecoration = "underline";
      e.currentTarget.style.fontWeight = "700";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.textDecoration = "none";
      e.currentTarget.style.fontWeight = "500";
    }}
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

const BottomNavbar = ({
  onHomeClick,
  onMoreClick,
  isHomeActive,
  isLoggedIn,
}: {
  onHomeClick: () => void;
  onMoreClick: () => void;
  isHomeActive: boolean;
  isLoggedIn: boolean;
}) => (
  <div style={styles.bottomNavbar}>
    <button
      style={isHomeActive ? styles.bottomNavButtonActive : styles.bottomNavButton}
      onClick={onHomeClick}
      onMouseEnter={(e) => {
        if (!isHomeActive) {
          e.currentTarget.style.backgroundColor = Colors.SECONDARY;
          e.currentTarget.style.color = Colors.PRIMARY;
        }
      }}
      onMouseLeave={(e) => {
        if (!isHomeActive) {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = Colors.PRIMARY_DARK;
        }
      }}
    >
      <svg
        style={isHomeActive ? styles.bottomNavIconActive : styles.bottomNavIcon}
        fill="none"
        stroke={isHomeActive ? Colors.WHITE : "currentColor"}
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
      Home
    </button>

    <button
      style={styles.bottomNavButton}
      onClick={onMoreClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = Colors.PRIMARY;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = Colors.PRIMARY_DARK;
      }}
    >
      <svg
        style={styles.bottomNavIcon}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
      More
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
    <div style={styles.bottomOverlayBackdrop} onClick={onClose} />
    <div style={styles.bottomOverlay}>
      <button
        style={styles.bottomOverlayItem}
        onClick={onLogin}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = Colors.SECONDARY;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
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
    <div style={styles.bottomOverlayBackdrop} onClick={onClose} />
    <div style={styles.bottomOverlay}>
      <button
        style={styles.bottomOverlayItem}
        onClick={onProfile}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = Colors.SECONDARY;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
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

      <button
        style={styles.bottomOverlayItem}
        onClick={onSettings}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = Colors.SECONDARY;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
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

      <button
        style={styles.bottomOverlayItem}
        onClick={onLogout}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = Colors.SECONDARY;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
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

export default function AppHeader() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; picture: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [bottomOverlayOpen, setBottomOverlayOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setUser(getUser());
    
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
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
    setBottomOverlayOpen(false);
    router.replace(ROUTES.LOGIN);
  };

  // Check if home tab is active
  const isHomeActive = pathname === ROUTES.HOME;

  return (
    <>
      <header style={styles.header}>
        <Logo onClick={() => router.push(ROUTES.HOME)} />

        {!isMobile && (
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
        )}
      </header>

      {/* Bottom navbar for mobile */}
      {isMobile && (
        <>
          <BottomNavbar
            onHomeClick={() => router.push(ROUTES.HOME)}
            onMoreClick={() => setBottomOverlayOpen(true)}
            isHomeActive={isHomeActive}
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
    </>
  );
};