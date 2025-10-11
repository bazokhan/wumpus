"use client";
import React, { useEffect, useState } from "react";

interface ActionAnimationProps {
  action: string;
  x?: number;
  y?: number;
  direction?: string;
  onComplete?: () => void;
}

export function ActionAnimation({ action, direction, onComplete }: ActionAnimationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onComplete?.(), 300); // Allow animation to finish
    }, 800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  const getAnimationContent = () => {
    switch (action) {
      case "TurnLeft":
      case "TurnRight":
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl animate-spin text-blue-400 opacity-80">
              {action === "TurnLeft" ? "⟲" : "⟳"}
            </div>
          </div>
        );
      case "Forward":
        const arrowClasses = {
          N: "animate-bounce",
          E: "animate-pulse",
          S: "animate-bounce",
          W: "animate-pulse"
        };
        const arrows = {
          N: "↑",
          E: "→", 
          S: "↓",
          W: "←"
        };
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-4xl text-green-400 opacity-80 ${arrowClasses[direction as keyof typeof arrowClasses] || "animate-bounce"}`}>
              {arrows[direction as keyof typeof arrows] || "↑"}
            </div>
          </div>
        );
      case "Grab":
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl animate-pulse text-yellow-400 opacity-80">
              ✨
            </div>
          </div>
        );
      case "Shoot":
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl animate-ping text-red-400 opacity-80">
              🏹
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {getAnimationContent()}
      {/* Light effect overlay */}
      <div className="absolute inset-0 bg-white/20 animate-pulse rounded"></div>
    </div>
  );
}

interface PerceptAnimationProps {
  percept: string;
  x?: number;
  y?: number;
  onComplete?: () => void;
}

export function PerceptAnimation({ percept, onComplete }: PerceptAnimationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onComplete?.(), 200);
    }, 600);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  const getPerceptContent = () => {
    switch (percept) {
      case "breeze":
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl animate-pulse text-cyan-400 opacity-90">
              💨
            </div>
          </div>
        );
      case "stench":
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl animate-bounce text-orange-400 opacity-90">
              ☁️
            </div>
          </div>
        );
      case "glitter":
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl animate-pulse text-yellow-400 opacity-90">
              ✨
            </div>
          </div>
        );
      case "scream":
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl animate-ping text-red-400 opacity-90">
              😱
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {getPerceptContent()}
    </div>
  );
}
