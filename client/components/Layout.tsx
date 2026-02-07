import { ReactNode } from "react";
import AppHeader from "./AppHeader";
import { Footer } from "./Footer";
import { useMobile } from "@/hooks/useMobile";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useMobile();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-950 via-gray-950 to-gray-950">
      <AppHeader />
      <main className="flex-1">{children}</main>
      {!isMobile && <Footer />}
    </div>
  );
}