"use client";
import React from "react";
import type { GameState, Percept } from "@/game/types";
import {
  Agent,
  Wumpus,
  Pit,
  Gold,
  BreezeIndicator,
  StenchIndicator,
  GlitterIndicator,
  BumpIndicator,
  ScreamIndicator,
} from "./graphics";
import { ActionAnimation, PerceptAnimation } from "./Animations";

interface GameBoardProps {
  gameState: GameState;
  showHidden: boolean; // For debugging or admin view
  onCellRightClick?: (x: number, y: number) => void;
  lastAction?: { action: string; x: number; y: number; direction?: string };
  newPercepts?: { percept: Percept; x: number; y: number }[];
}

export default function GameBoard({
  gameState,
  showHidden,
  onCellRightClick,
  lastAction,
  newPercepts,
}: GameBoardProps) {
  const { grid, agent, gridSize } = gameState;

  const getCellContent = (x: number, y: number) => {
    const cell = grid[y][x];
    const isAgentHere = agent.x === x && agent.y === y;
    const content: React.ReactNode[] = [];

    // Agent (always on top if present)
    if (isAgentHere) {
      content.push(
        <Agent
          key="agent"
          direction={agent.dir}
          hasGold={agent.hasGold}
          alive={agent.alive}
        />
      );
    }

    // Hidden elements (for debugging or admin view)
    if (showHidden) {
      if (cell.wumpus) {
        content.push(<Wumpus key="wumpus" />);
      }
      if (cell.pit) {
        content.push(<Pit key="pit" />);
      }
      if (cell.gold && !agent.hasGold) {
        content.push(<Gold key="gold" />);
      }
    }

    // Gold (visible if agent doesn't have it)
    if (cell.gold && !agent.hasGold && !showHidden) {
      content.push(<Gold key="gold" />);
    }

    return content;
  };

  const getPerceptIndicators = (x: number, y: number) => {
    const cell = grid[y][x];
    const indicators: Set<Percept> = new Set();

    // Get current percepts if agent is here
    if (x === agent.x && y === agent.y) {
      const lastStep = gameState.history[gameState.history.length - 1];
      if (lastStep) {
        const { percepts } = lastStep;
        if (percepts.breeze) indicators.add("breeze");
        if (percepts.stench) indicators.add("stench");
        if (percepts.glitter) indicators.add("glitter");
        if (percepts.bump) indicators.add("bump");
        if (percepts.scream) indicators.add("scream");
      }
    }

    // Get persistent percepts
    if (cell.persistentPercepts) {
      if (cell.persistentPercepts.breeze) indicators.add("breeze");
      if (cell.persistentPercepts.stench) indicators.add("stench");
      if (cell.persistentPercepts.glitter) indicators.add("glitter");
      if (cell.persistentPercepts.bump) indicators.add("bump");
      if (cell.persistentPercepts.scream) indicators.add("scream");
    }

    return Array.from(indicators).map((indicator) => {
      switch (indicator) {
        case "breeze":
          return <BreezeIndicator key="breeze" />;
        case "stench":
          return <StenchIndicator key="stench" />;
        case "glitter":
          return <GlitterIndicator key="glitter" />;
        case "bump":
          return <BumpIndicator key="bump" />;
        case "scream":
          return <ScreamIndicator key="scream" />;
        default:
          return null;
      }
    });
  };

  const getCellBackgroundColor = (cell: {
    userColor?: "green" | "yellow" | "red";
  }) => {
    if (cell.userColor === "green") return "bg-green-900/50";
    if (cell.userColor === "yellow") return "bg-yellow-900/50";
    if (cell.userColor === "red") return "bg-red-900/50";
    return "bg-gray-900";
  };

  return (
    <div className="flex flex-col">
      <div
        className="grid gap-1 bg-gray-700 p-3 rounded-lg border-2 border-gray-600 max-w-full overflow-auto justify-center"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(60px, 120px))`,
        }}
      >
        {grid.flatMap((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`aspect-square border border-gray-500 rounded relative flex items-center justify-center cursor-pointer min-w-[60px] lg:min-w-[120px] hover:border-gray-400 transition-colors ${getCellBackgroundColor(
                cell
              )}`}
              onContextMenu={(e) => {
                e.preventDefault();
                onCellRightClick?.(x, y);
              }}
            >
              {getCellContent(x, y)}
              {getPerceptIndicators(x, y)}

              {/* Action Animation */}
              {lastAction && lastAction.x === x && lastAction.y === y && (
                <ActionAnimation
                  action={lastAction.action}
                  direction={lastAction.direction}
                />
              )}

              {/* Percept Animations */}
              {newPercepts?.map((p, idx) =>
                p.x === x && p.y === y ? (
                  <PerceptAnimation key={idx} percept={p.percept} />
                ) : null
              )}

              {/* Grid coordinates for debugging */}
              {process.env.NODE_ENV === "development" && (
                <div className="absolute bottom-0.5 right-0.5 text-xs text-gray-500 font-mono">
                  {x},{y}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Legend */}
      <div className="mt-3 text-xs text-gray-300 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-1">
          <Agent direction="E" hasGold={false} alive={true} />
          <span>Agent</span>
        </div>
        <div className="flex items-center gap-1">
          <Wumpus />
          <span>Wumpus</span>
        </div>
        <div className="flex items-center gap-1">
          <Pit />
          <span>Pit</span>
        </div>
        <div className="flex items-center gap-1">
          <Gold />
          <span>Gold</span>
        </div>
        <div className="flex items-center gap-1">
          <BreezeIndicator />
          <span>Breeze</span>
        </div>
        <div className="flex items-center gap-1">
          <StenchIndicator />
          <span>Stench</span>
        </div>
        <div className="flex items-center gap-1">
          <GlitterIndicator />
          <span>Glitter</span>
        </div>
      </div>

      {/* Color Legend */}
      <div className="mt-3 text-xs text-gray-300 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-900/50 border border-gray-500 rounded"></div>
          <span>Safe</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-yellow-900/50 border border-gray-500 rounded"></div>
          <span>Maybe</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-red-900/50 border border-gray-500 rounded"></div>
          <span>Dangerous</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-gray-400">Right-click to toggle colors</span>
        </div>
      </div>
    </div>
  );
}
