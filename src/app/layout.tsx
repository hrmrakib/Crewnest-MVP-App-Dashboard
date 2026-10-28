import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CrewNest Dashboard",
  description:
    "Access your CrewNest dashboard — manage teams, schedules, and operations from one platform.",
};

import ReduxProvider from "@/redux/provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
