"use client";
import React from "react";
import type { Percepts, Step } from "@/game/types";

interface GameHistoryProps {
  history: Step[];
}

export default function GameHistory({ history }: GameHistoryProps) {
  const getActionEmoji = (action: string) => {
    switch (action) {
      case "TurnLeft":
        return "⟲";
      case "TurnRight":
        return "⟳";
      case "Forward":
        return "↑";
      case "Grab":
        return "🤲";
      case "Shoot":
        return "🏹";
      default:
        return "❓";
    }
  };

  const getActionDescription = (action: string) => {
    switch (action) {
      case "TurnLeft":
        return "turned left";
      case "TurnRight":
        return "turned right";
      case "Forward":
        return "moved forward";
      case "Grab":
        return "attempted to grab gold";
      case "Shoot":
        return "shot an arrow";
      default:
        return action;
    }
  };

  const getPerceptEmojis = (percepts: Percepts) => {
    const perceptsArray = [];
    if (percepts.breeze) perceptsArray.push("💨 Breeze");
    if (percepts.stench) perceptsArray.push("👃 Stench");
    if (percepts.glitter) perceptsArray.push("✨ Glitter");
    if (percepts.bump) perceptsArray.push("💥 Bump");
    if (percepts.scream) perceptsArray.push("🗣️ Scream");

    return perceptsArray.length > 0
      ? perceptsArray.join(", ")
      : "Nothing detected";
  };

  const getRewardColor = (reward: number) => {
    if (reward > 0) return "#4CAF50";
    if (reward < 0) return "#F44336";
    return "#888";
  };

  const getRewardIcon = (reward: number) => {
    if (reward >= 1000) return "🎉";
    if (reward > 0) return "✅";
    if (reward <= -1000) return "💀";
    if (reward < 0) return "❌";
    return "⏰";
  };

  if (history.length === 0) {
    return (
      <div className="game-history">
        <h3
          style={{
            color: "#fff",
            marginBottom: "12px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          📜 Adventure Log
        </h3>
        <div
          style={{
            backgroundColor: "#1a1a1a",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #333",
            textAlign: "center",
            color: "#888",
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>🗺️</div>
          <div>Your adventure begins here...</div>
          <div style={{ fontSize: "12px", marginTop: "4px" }}>
            Take your first step and watch your story unfold!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-history">
      <h3
        style={{
          color: "#fff",
          marginBottom: "12px",
          fontSize: "18px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        📜 Adventure Log ({history.length} actions)
      </h3>

      <div
        style={{
          backgroundColor: "#1a1a1a",
          borderRadius: "8px",
          border: "1px solid #333",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {history.map((step, index) => (
          <div
            key={step.index}
            className="history-entry"
            style={{
              padding: "12px",
              borderBottom:
                index < history.length - 1 ? "1px solid #333" : "none",
              transition: "background-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#222";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                marginBottom: "8px",
              }}
            >
              {/* Step number */}
              <div
                style={{
                  backgroundColor: "#333",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  flexShrink: 0,
                }}
              >
                {step.index}
              </div>

              {/* Action info */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <span style={{ fontSize: "16px" }}>
                    {getActionEmoji(step.action)}
                  </span>
                  <span
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {getActionDescription(step.action)}
                  </span>
                </div>

                {/* Position and direction */}
                <div
                  style={{
                    fontSize: "12px",
                    color: "#aaa",
                    marginBottom: "6px",
                  }}
                >
                  📍 Position: ({step.resultState.x}, {step.resultState.y}) 🧭
                  Facing: {step.resultState.dir}
                  {step.resultState.hasGold && " 💎 Carrying Gold"}
                </div>

                {/* Percepts */}
                <div
                  style={{
                    fontSize: "12px",
                    color: "#bbb",
                    marginBottom: "6px",
                    fontStyle: "italic",
                  }}
                >
                  👁️ {getPerceptEmojis(step.percepts)}
                </div>

                {/* Reward */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "12px",
                  }}
                >
                  <span>{getRewardIcon(step.rewardDelta)}</span>
                  <span
                    style={{
                      color: getRewardColor(step.rewardDelta),
                      fontWeight: "bold",
                    }}
                  >
                    {step.rewardDelta > 0 ? "+" : ""}
                    {step.rewardDelta} points
                  </span>
                  {step.rewardDelta >= 1000 && (
                    <span style={{ color: "#FFD700", fontSize: "10px" }}>
                      (Great success!)
                    </span>
                  )}
                  {step.rewardDelta <= -1000 && (
                    <span style={{ color: "#F44336", fontSize: "10px" }}>
                      (Game over!)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Timestamp */}
            <div
              style={{
                fontSize: "10px",
                color: "#666",
                textAlign: "right",
                fontFamily: "monospace",
              }}
            >
              {new Date(step.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {/* Summary stats */}
      <div
        style={{
          marginTop: "12px",
          display: "flex",
          gap: "16px",
          fontSize: "12px",
          color: "#888",
        }}
      >
        <div>
          Total Steps:{" "}
          <span style={{ color: "#fff", fontWeight: "bold" }}>
            {history.length}
          </span>
        </div>
        <div>
          Final Score:{" "}
          <span
            style={{
              color:
                history[history.length - 1]?.rewardDelta > 0
                  ? "#4CAF50"
                  : "#F44336",
              fontWeight: "bold",
            }}
          >
            {history.reduce((sum, step) => sum + step.rewardDelta, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
