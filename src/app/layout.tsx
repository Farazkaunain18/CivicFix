import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmergencyBar from "@/components/EmergencyBar";

export const metadata: Metadata = {
  title: "Organigen Health | Rural Health Triage Assistant Punjab",
  description:
    "Mobile-first, voice-enabled rural healthcare triage for Punjab villages in Punjabi, Hindi, and English. Immediate emergency detection and 25+ government facilities.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Organigen Health",
  },
  applicationName: "Organigen Health",
  keywords: ["rural health", "punjab", "triage", "asha worker", "108 ambulance", "civil hospital", "punjabi health"],
  authors: [{ name: "Organigen Health Team" }],
};

export const viewport: Viewport = {
  themeColor: "#0F766E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pa" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Sans+Gurmukhi:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/icons/icon-192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen flex flex-col bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-slate-100 antialiased selection:bg-teal-200 selection:text-teal-900">
        <LanguageProvider>
          {/* Top Navbar */}
          <Navbar />

          {/* Main App Page Content */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
            {children}
          </main>

          {/* Sticky Emergency 108 Bar */}
          <EmergencyBar />

          {/* Global Footer */}
          <Footer />
        </LanguageProvider>

        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Organigen Health SW registered: ', registration.scope);
                    },
                    function(err) {
                      console.log('Organigen Health SW registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
