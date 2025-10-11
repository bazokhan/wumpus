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
  const cellSize = 60;

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
    <div className="game-board-container">
      <div
        className="game-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
          gap: "2px",
          backgroundColor: "#2a2a2a",
          padding: "8px",
          borderRadius: "8px",
          border: "2px solid #444",
        }}
      >
        {grid.flatMap((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className="game-cell"
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                borderRadius: "4px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "default",
              }}
            >
              {getCellContent(x, y)}
              {getPerceptIndicators(x, y)}

              {/* Grid coordinates for debugging */}
              {process.env.NODE_ENV === "development" && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    right: "2px",
                    fontSize: "8px",
                    color: "#666",
                    fontFamily: "monospace",
                  }}
                >
                  {x},{y}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Legend */}
      <div
        className="legend"
        style={{
          marginTop: "12px",
          fontSize: "12px",
          color: "#ccc",
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Agent direction="E" hasGold={false} alive={true} />
          <span>Agent</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Wumpus />
          <span>Wumpus</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Pit />
          <span>Pit</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Gold />
          <span>Gold</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <BreezeIndicator />
          <span>Breeze</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <StenchIndicator />
          <span>Stench</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <GlitterIndicator />
          <span>Glitter</span>
        </div>
      </div>
    </div>
  );
}
