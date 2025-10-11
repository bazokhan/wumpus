"use client";
import { useState } from "react";
import BasicPage from "@/components/BasicPage";
import EnhancedPage from "@/components/EnhancedPage";
import PageLayout from "@/components/PageLayout";

type GameMode = "enhanced" | "basic";

export default function Page() {
  const [mode, setMode] = useState<GameMode>("enhanced");

  return (
    <PageLayout>
      {/* Mode Toggle */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        backgroundColor: '#1a1a1a',
        border: '2px solid #333',
        borderRadius: '8px',
        padding: '8px',
        display: 'flex',
        gap: '4px'
      }}>
        <button
          onClick={() => setMode("enhanced")}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: mode === "enhanced" ? '#4CAF50' : '#333',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s ease'
          }}
        >
          🎮 Enhanced
        </button>
        <button
          onClick={() => setMode("basic")}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: mode === "basic" ? '#4CAF50' : '#333',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s ease'
          }}
        >
          📝 Basic
        </button>
      </div>

      {/* Render appropriate page based on mode */}
      {mode === "enhanced" ? <EnhancedPage /> : <BasicPage />}
    </PageLayout>
  );
}
