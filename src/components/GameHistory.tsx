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
        <h3 className="text-white mb-3 text-lg font-bold">
          📜 Adventure Log
        </h3>
        <div className="bg-gray-800 p-5 rounded-lg border border-gray-600 text-center text-gray-400">
          <div className="text-2xl mb-2">🗺️</div>
          <div>Your adventure begins here...</div>
          <div className="text-xs mt-1">
            Take your first step and watch your story unfold!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-history">
      <h3 className="text-white mb-3 text-lg font-bold flex items-center gap-2">
        📜 Adventure Log ({history.length} actions)
      </h3>

      <div className="bg-gray-800 rounded-lg border border-gray-600 max-h-96 overflow-y-auto">
        {history.map((step, index) => (
          <div
            key={step.index}
            className={`p-3 transition-colors hover:bg-gray-700 ${
              index < history.length - 1 ? 'border-b border-gray-600' : ''
            }`}
          >
            <div className="flex items-start gap-3 mb-2">
              {/* Step number */}
              <div className="bg-gray-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {step.index}
              </div>

              {/* Action info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{getActionEmoji(step.action)}</span>
                  <span className="text-white font-bold capitalize">
                    {getActionDescription(step.action)}
                  </span>
                </div>

                {/* Position and direction */}
                <div className="text-xs text-gray-300 mb-1.5">
                  📍 Position: ({step.resultState.x}, {step.resultState.y}) 🧭
                  Facing: {step.resultState.dir}
                  {step.resultState.hasGold && " 💎 Carrying Gold"}
                </div>

                {/* Percepts */}
                <div className="text-xs text-gray-400 mb-1.5 italic">
                  👁️ {getPerceptEmojis(step.percepts)}
                </div>

                {/* Reward */}
                <div className="flex items-center gap-1 text-xs">
                  <span>{getRewardIcon(step.rewardDelta)}</span>
                  <span className={`font-bold ${
                    step.rewardDelta > 0 ? 'text-green-500' : 
                    step.rewardDelta < 0 ? 'text-red-500' : 'text-gray-400'
                  }`}>
                    {step.rewardDelta > 0 ? "+" : ""}{step.rewardDelta} points
                  </span>
                  {step.rewardDelta >= 1000 && (
                    <span className="text-yellow-400 text-xs">(Great success!)</span>
                  )}
                  {step.rewardDelta <= -1000 && (
                    <span className="text-red-500 text-xs">(Game over!)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Timestamp */}
            <div className="text-xs text-gray-500 text-right font-mono">
              {new Date(step.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {/* Summary stats */}
      <div className="mt-3 flex gap-4 text-xs text-gray-400">
        <div>
          Total Steps: <span className="text-white font-bold">{history.length}</span>
        </div>
        <div>
          Final Score: <span className={`font-bold ${
            history[history.length - 1]?.rewardDelta > 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {history.reduce((sum, step) => sum + step.rewardDelta, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
