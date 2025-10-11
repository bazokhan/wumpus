"use client";
import React from "react";
import type { GameState } from "@/game/types";
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

interface GameBoardProps {
  gameState: GameState;
  showHidden: boolean; // For debugging or admin view
}

export default function GameBoard({ gameState, showHidden }: GameBoardProps) {
  const { grid, agent, gridSize } = gameState;

  const getCellContent = (x: number, y: number) => {
    const cell = grid[y][x];
    const isAgentHere = agent.x === x && agent.y === y;
    const content = [];

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
    if (x !== agent.x || y !== agent.y) return null;

    // Get percepts from the last history entry
    const lastStep = gameState.history[gameState.history.length - 1];
    if (!lastStep) return null;

    const { percepts } = lastStep;
    const indicators = [];

    if (percepts.breeze) indicators.push(<BreezeIndicator key="breeze" />);
    if (percepts.stench) indicators.push(<StenchIndicator key="stench" />);
    if (percepts.glitter) indicators.push(<GlitterIndicator key="glitter" />);
    if (percepts.bump) indicators.push(<BumpIndicator key="bump" />);
    if (percepts.scream) indicators.push(<ScreamIndicator key="scream" />);

    return indicators;
  };

  return (
    <div className="flex flex-col">
      <div
        className="grid gap-0.5 bg-gray-700 p-2 rounded-lg border-2 border-gray-600 max-w-full overflow-auto justify-center"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(45px, 70px))`,
        }}
      >
        {grid.flatMap((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className="aspect-square bg-gray-900 border border-gray-500 rounded relative flex items-center justify-center cursor-default min-w-[45px] lg:min-w-[70px]"
            >
              {getCellContent(x, y)}
              {getPerceptIndicators(x, y)}

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
    </div>
  );
}
