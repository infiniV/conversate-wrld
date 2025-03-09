import "~/styles/globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import React from "react";
import { ThemeProvider } from "../components/ThemeProvider";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import { TRPCReactProvider } from "~/trpc/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Conversate - The Future of Customer Care",
  description:
    "Seamless interactions across all channels. Deliver exceptional experiences through our intelligent autonomous system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="view-transition" content="same-origin" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider>{children}</TRPCReactProvider>
            <ThemeSwitcher />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
