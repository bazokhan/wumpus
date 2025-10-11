"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile); // Auto-open on desktop, closed on mobile
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const navItems = [
    {
      href: "/",
      label: "Home",
      icon: "🎮",
      description: "Play Wumpus World"
    },
    {
      href: "/about-wumpus",
      label: "About Wumpus World",
      icon: "🗺️",
      description: "Learn about this classic AI problem"
    },
    {
      href: "/about",
      label: "About Me",
      icon: "👨‍💻",
      description: "Mohamed Elbaz - Developer & Student"
    }
  ];

  return (
    <>
      {/* Hamburger Button - Only visible on mobile */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="sidebar-toggle"
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            zIndex: 1001,
            backgroundColor: "#1a1a1a",
            border: "2px solid #333",
            borderRadius: "8px",
            padding: "8px",
            color: "#fff",
            cursor: "pointer",
            fontSize: "16px",
            transition: "all 0.2s ease",
          }}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`sidebar ${isOpen ? "sidebar-open" : "sidebar-closed"}`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: isMobile ? "280px" : "260px",
          backgroundColor: "#1a1a1a",
          borderRight: "2px solid #333",
          zIndex: 1000,
          transition: "transform 0.3s ease",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          overflowY: "auto",
          padding: "20px 0",
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: "0 20px 20px 20px",
            borderBottom: "1px solid #333",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: "18px",
              fontWeight: "bold",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            🎯 Wumpus World
          </h2>
          <p
            style={{
              color: "#888",
              fontSize: "12px",
              margin: "4px 0 0 0",
            }}
          >
            Classic AI Adventure Game
          </p>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: "0 20px" }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
              style={{
                display: "block",
                padding: "12px 16px",
                marginBottom: "8px",
                borderRadius: "8px",
                textDecoration: "none",
                transition: "all 0.2s ease",
                backgroundColor: pathname === item.href ? "#333" : "transparent",
                border: pathname === item.href ? "1px solid #4CAF50" : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (pathname !== item.href) {
                  e.currentTarget.style.backgroundColor = "#222";
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== item.href) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "4px",
                }}
              >
                <span style={{ fontSize: "20px" }}>{item.icon}</span>
                <span
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {item.label}
                </span>
              </div>
              <div
                style={{
                  color: "#888",
                  fontSize: "11px",
                  marginLeft: "32px",
                  lineHeight: "1.2",
                }}
              >
                {item.description}
              </div>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            right: "20px",
            padding: "16px",
            backgroundColor: "#0a0a0a",
            borderRadius: "8px",
            border: "1px solid #333",
          }}
        >
          <div
            style={{
              color: "#4CAF50",
              fontSize: "12px",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            🚀 Built with Next.js & tRPC
          </div>
          <div
            style={{
              color: "#888",
              fontSize: "10px",
            }}
          >
            A modern implementation of the classic AI problem
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          onClick={closeSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
        />
      )}
    </>
  );
}
