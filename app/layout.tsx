import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Data Dictionary & Metadata Generator",
  description: "Generate comprehensive data dictionaries and metadata documentation with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 min-h-screen text-gray-100">
        {children}
      </body>
    </html>
  );
}
