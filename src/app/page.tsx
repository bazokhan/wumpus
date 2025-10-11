"use client";
import { useState, useEffect } from "react";
import BasicPage from "@/components/BasicPage";
import EnhancedPage from "@/components/EnhancedPage";
import PageLayout from "@/components/PageLayout";

type GameMode = "enhanced" | "basic";

export default function Page() {
  const [mode, setMode] = useState<GameMode>("enhanced");
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
    <PageLayout>
      {/* Mode Toggle */}
      <div className={`fixed right-5 z-50 bg-gray-800 border-2 border-gray-600 rounded-lg p-1.5 flex gap-0.5 shadow-lg ${
        isMobile ? 'top-20' : 'top-5'
      }`}>
        <button
          onClick={() => setMode("enhanced")}
          className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-md border-none text-white font-bold transition-colors touch-manipulation text-xs lg:text-sm ${
            mode === "enhanced" 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {isMobile ? '🎮' : '🎮 Enhanced'}
        </button>
        <button
          onClick={() => setMode("basic")}
          className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-md border-none text-white font-bold transition-colors touch-manipulation text-xs lg:text-sm ${
            mode === "basic" 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          {isMobile ? '📝' : '📝 Basic'}
        </button>
      </div>

      {/* Render appropriate page based on mode */}
      {mode === "enhanced" ? <EnhancedPage /> : <BasicPage />}
    </PageLayout>
  );
}
