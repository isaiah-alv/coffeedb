"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ThemeBoot>{children}</ThemeBoot>
    </SessionProvider>
  );
}

function ThemeBoot({ children }) {
  // Set initial theme from localStorage; default to 'iced'
  React.useEffect(() => {
    try {
      const t = localStorage.getItem('theme') || 'iced';
      document.documentElement.setAttribute('data-theme', t);
    } catch {}
  }, []);
  return children;
}
