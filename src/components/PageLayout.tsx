"use client";
import React, { useState, useEffect } from "react";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      style={{
        marginLeft: isMobile ? "0" : "260px", // Account for sidebar width on desktop only
        transition: "margin-left 0.3s ease",
        minHeight: "100vh",
        paddingTop: isMobile ? "60px" : "0", // Account for mobile hamburger button
      }}
    >
      {children}
    </div>
  );
}
