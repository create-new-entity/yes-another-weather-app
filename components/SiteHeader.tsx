import Link from "next/link";
import { CloudSun } from "lucide-react";

import ThemeSelector from "./ThemeSelector";

export default function SiteHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-5 sm:px-10">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-semibold"
        aria-label="Aether home"
      >
        <CloudSun size={26} aria-hidden="true" />
        <span>Aether</span>
      </Link>

      <ThemeSelector />
    </header>
  );
}
