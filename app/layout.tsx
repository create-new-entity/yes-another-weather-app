import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import SiteHeader from "./components/SiteHeader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Aether",
  description: "Explore the weather around the world.",
};

const themeInitScript = `
  (function () {
    try {
      var theme = localStorage.getItem("mip-weather-app-theme") || "dark";
      var systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var resolvedTheme = theme === "system" ? (systemPrefersDark ? "dark" : "light") : theme;

      document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    } catch (error) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={inter.variable}>
        <ThemeProvider>
          <SiteHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
