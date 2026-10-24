import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { CivicProvider } from "@/context/CivicContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";

export const metadata: Metadata = {
  title: "CivicFix | Modern AI Civic Infrastructure & Municipal Triage",
  description:
    "CivicFix connects citizens with local municipalities to report and resolve infrastructure issues like potholes, streetlights, garbage overflow, and water leaks using simulated AI triage.",
  keywords: [
    "civictech",
    "infrastructure",
    "potholes",
    "streetlights",
    "city council",
    "smart cities",
    "municipality",
  ],
  authors: [{ name: "CivicFix Team" }],
};

export const viewport: Viewport = {
  themeColor: "#4F46E5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="min-h-screen flex flex-col transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <CivicProvider>
              {/* Top Navigation */}
              <Navbar />

              {/* Page Content */}
              <main className="flex-1 w-full">{children}</main>

              {/* Global Footer */}
              <Footer />

              {/* Global Notification Toast */}
              <Toast />
            </CivicProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
