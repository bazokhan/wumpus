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
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 mb-4">
        {controls.map((control) => (
          <button
            key={control.action}
            onClick={() => onAction(control.action)}
            disabled={disabled || control.disabled || !agentAlive}
            className={`flex flex-col items-center gap-1 p-3 lg:p-4 border-2 rounded-lg transition-all duration-200 min-h-[80px] lg:min-h-[100px] touch-manipulation ${
              disabled || control.disabled || !agentAlive
                ? "bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 border-gray-600 text-white cursor-pointer hover:bg-gray-700 hover:border-gray-500"
            }`}
          >
            <div className="text-2xl">{control.icon}</div>
            <div className="font-bold text-xs lg:text-sm">{control.label}</div>
            <div className="text-xs opacity-70 text-center leading-tight">
              {control.description}
            </div>
          </button>
        ))}
      </div>

      {/* Mobile Touch Instructions */}
      <div className="lg:hidden bg-gray-800 p-3 rounded-md border border-gray-600 mb-3">
        <div className="text-xs text-gray-400 font-bold mb-2 text-center">
          📱 Touch Controls
        </div>
        <div className="text-xs text-gray-300 text-center leading-relaxed">
          Tap the action buttons above to play. Each button performs the corresponding action.
        </div>
      </div>

      {/* Keyboard hints - Hidden on mobile */}
      <div className="hidden lg:block bg-gray-800 p-3 rounded-md border border-gray-600 mb-3">
        <div className="text-xs text-gray-400 font-bold mb-2">
          🎮 Keyboard Controls
        </div>
        <div className="grid grid-cols-1 gap-2 text-xs">
          {controls.map((control) => (
            <div
              key={control.action}
              className={`flex items-center gap-2 ${
                disabled || control.disabled || !agentAlive ? "text-gray-500" : "text-gray-300"
              }`}
            >
              <div className="bg-gray-700 border border-gray-500 rounded px-2 py-1 text-xs font-mono min-w-4 text-center">
                {control.key}
              </div>
              <span className="text-xs">{control.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Game status indicators */}
      <div className="mt-3 flex flex-wrap gap-4 text-xs">
        <div className={`flex items-center gap-1 ${agentAlive ? 'text-green-500' : 'text-red-500'}`}>
          <div className={`w-2 h-2 rounded-full ${agentAlive ? 'bg-green-500' : 'bg-red-500'}`} />
          {agentAlive ? 'Alive' : 'Game Over'}
        </div>

        <div className={`flex items-center gap-1 ${hasGold ? 'text-yellow-400' : 'text-gray-400'}`}>
          <span>💎</span>
          {hasGold ? 'Has Gold' : 'No Gold'}
        </div>

        <div className={`flex items-center gap-1 ${hasArrow ? 'text-red-400' : 'text-gray-400'}`}>
          <span>🏹</span>
          {hasArrow ? 'Has Arrow' : 'No Arrow'}
        </div>
      </div>
    </div>
  );
}
