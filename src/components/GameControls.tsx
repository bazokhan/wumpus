"use client";
import React from "react";
import type { Action } from "@/game/types";

interface GameControlsProps {
  onAction: (action: Action) => void;
  disabled?: boolean;
  agentAlive: boolean;
  hasGold: boolean;
  hasArrow: boolean;
}

export default function GameControls({
  onAction,
  disabled = false,
  agentAlive,
  hasGold,
  hasArrow,
}: GameControlsProps) {
  const controls = [
    {
      action: "TurnLeft" as Action,
      label: "Turn Left",
      icon: "⟲",
      key: "A",
      description: "Rotate 90° counter-clockwise",
    },
    {
      action: "TurnRight" as Action,
      label: "Turn Right",
      icon: "⟳",
      key: "D",
      description: "Rotate 90° clockwise",
    },
    {
      action: "Forward" as Action,
      label: "Move Forward",
      icon: "↑",
      key: "W",
      description: "Move one cell in current direction",
    },
    {
      action: "Grab" as Action,
      label: "Grab Gold",
      icon: "🤲",
      key: "G",
      description: "Pick up gold if present",
      disabled: hasGold,
    },
    {
      action: "Shoot" as Action,
      label: "Shoot Arrow",
      icon: "🏹",
      key: "S",
      description: "Fire arrow in current direction",
      disabled: !hasArrow,
    },
  ];

  return (
    <div className="game-controls">
      <div
        className="controls-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        {controls.map((control) => (
          <button
            key={control.action}
            onClick={() => onAction(control.action)}
            disabled={disabled || control.disabled || !agentAlive}
            className={`control-button ${!agentAlive ? "game-over" : ""}`}
            style={{
              padding: "12px 16px",
              border: "2px solid #444",
              borderRadius: "8px",
              backgroundColor:
                disabled || control.disabled || !agentAlive
                  ? "#333"
                  : "#2a2a2a",
              color:
                disabled || control.disabled || !agentAlive ? "#666" : "#fff",
              cursor:
                disabled || control.disabled || !agentAlive
                  ? "not-allowed"
                  : "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.2s ease",
              fontSize: "14px",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              if (!disabled && !control.disabled && agentAlive) {
                e.currentTarget.style.backgroundColor = "#3a3a3a";
                e.currentTarget.style.borderColor = "#666";
              }
            }}
            onMouseLeave={(e) => {
              if (!disabled && !control.disabled && agentAlive) {
                e.currentTarget.style.backgroundColor = "#2a2a2a";
                e.currentTarget.style.borderColor = "#444";
              }
            }}
          >
            <div style={{ fontSize: "20px" }}>{control.icon}</div>
            <div style={{ fontWeight: "bold" }}>{control.label}</div>
            <div
              style={{
                fontSize: "11px",
                opacity: 0.7,
                textAlign: "center",
                lineHeight: "1.2",
              }}
            >
              {control.description}
            </div>
          </button>
        ))}
      </div>

      {/* Keyboard hints */}
      <div
        className="keyboard-hints"
        style={{
          backgroundColor: "#1a1a1a",
          padding: "12px",
          borderRadius: "6px",
          border: "1px solid #333",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            color: "#888",
            marginBottom: "8px",
            fontWeight: "bold",
          }}
        >
          🎮 Keyboard Controls
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "8px",
            fontSize: "11px",
          }}
        >
          {controls.map((control) => (
            <div
              key={control.action}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color:
                  disabled || control.disabled || !agentAlive ? "#555" : "#ccc",
              }}
            >
              <div
                style={{
                  backgroundColor: "#333",
                  border: "1px solid #555",
                  borderRadius: "3px",
                  padding: "2px 6px",
                  fontSize: "10px",
                  fontFamily: "monospace",
                  minWidth: "16px",
                  textAlign: "center",
                }}
              >
                {control.key}
              </div>
              <span>{control.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Game status indicators */}
      <div
        className="status-indicators"
        style={{
          marginTop: "12px",
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          fontSize: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            color: agentAlive ? "#4CAF50" : "#F44336",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: agentAlive ? "#4CAF50" : "#F44336",
            }}
          />
          {agentAlive ? "Alive" : "Game Over"}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            color: hasGold ? "#FFD700" : "#888",
          }}
        >
          <span>{hasGold ? "💎" : "💎"}</span>
          {hasGold ? "Has Gold" : "No Gold"}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            color: hasArrow ? "#FF6B6B" : "#888",
          }}
        >
          <span>🏹</span>
          {hasArrow ? "Has Arrow" : "No Arrow"}
        </div>
      </div>
    </div>
  );
}
