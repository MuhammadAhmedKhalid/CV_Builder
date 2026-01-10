"use client";

import AppHeader from "@/components/AppHeader";
import * as Colors from "@/lib/colors";

export default function SettingsPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: Colors.LIGHT_GRAY,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppHeader />

      <main
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <section
          style={{
            width: "100%", // Full width
          }}
        >
          {/* Heading */}
          <header style={{ marginBottom: "24px" }}>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: Colors.PRIMARY_DARK,
                marginBottom: "6px",
              }}
            >
              Settings
            </h1>
            <p
              style={{
                fontSize: "16px",
                color: Colors.PRIMARY,
              }}
            >
              Manage your account preferences
            </p>
          </header>

          {/* Subtle separator for future settings */}
          <hr
            style={{
              border: "none",
              height: "1px",
              backgroundColor: Colors.BORDER_PRIMARY,
              marginBottom: "32px",
            }}
          />

          {/* Placeholder for future fields */}
          <div
            style={{
              minHeight: "150px",
              width: "100%", // make placeholder full width
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: Colors.PRIMARY,
              fontSize: "14px",
              fontWeight: 500,
              backgroundColor: Colors.SECONDARY, // subtle visual block
              borderRadius: "8px",
            }}
          >
            Settings options will appear here
          </div>
        </section>
      </main>
    </div>
  );
}