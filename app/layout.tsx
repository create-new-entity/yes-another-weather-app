import { Inter } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const themeInitScript = `
(function () {
  let theme = "system";

  try {
    const savedTheme = localStorage.getItem("mip-weather-app-theme");

    if (
      savedTheme === "system" ||
      savedTheme === "light" ||
      savedTheme === "dark"
    ) {
      theme = savedTheme;
    }
  } catch {}

  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  document.documentElement.classList.toggle(
    "dark",
    theme === "dark" || (theme === "system" && prefersDark)
  );
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
