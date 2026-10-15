"use client";

import { useEffect } from "react";

const useTabTitle = (title?: string) => {
  const defaultTitle = "Aether";
  const fullTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;

  useEffect(() => {
    document.title = fullTitle;
  }, [fullTitle]);
};

export default useTabTitle;
