"use client";

import AppHeader from "@/components/AppHeader";

// --- Home Page ---
export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Use the centralized header component */}
      <AppHeader />

      {/* Page content */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2 style={{ fontSize: "2rem", color: "#047857" }}>Welcome to CV Builder</h2>
      </main>
    </div>
  );
}