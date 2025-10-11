"use client";
import { trpc } from "@/client/trpc";
import { Action } from "@/game/types";
import { useState, useEffect, useCallback } from "react";
import GameBoard from "./GameBoard";
import GameControls from "./GameControls";
import GameHistory from "./GameHistory";
import { useSound, SoundToggle } from "./SoundManager";

export default function EnhancedPage() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [showHidden, setShowHidden] = useState(false);
  const [lastAction, setLastAction] = useState<{ action: string; x: number; y: number; direction?: string } | null>(null);
  const [newPercepts, setNewPercepts] = useState<{ percept: string; x: number; y: number }[]>([]);
  const { playSound } = useSound();
  const start = trpc.startGame.useMutation({
    onSuccess: (r) => setGameId(r.gameId),
  });
  const step = trpc.step.useMutation();
  const toggleCellColor = trpc.toggleCellColor.useMutation();
  const state = trpc.getState.useQuery(
    { gameId: gameId! },
    { enabled: !!gameId, refetchOnWindowFocus: false }
  );
  const history = trpc.getHistory.useQuery(
    { gameId: gameId! },
    { enabled: !!gameId }
  );

  const doStep = useCallback(
    async (action: Action) => {
      if (!gameId || state.data?.state.terminal) return;
      
      // Set animation data
      const currentState = state.data?.state;
      if (currentState) {
        setLastAction({
          action,
          x: currentState.agent.x,
          y: currentState.agent.y,
          direction: currentState.agent.dir
        });
      }
      
      await step.mutateAsync({ gameId, action });
      await state.refetch();
      await history.refetch();
      
      // Play sound effect
      const soundMap: Record<string, string> = {
        "TurnLeft": "turn",
        "TurnRight": "turn", 
        "Forward": "move",
        "Grab": "grab",
        "Shoot": "shoot"
      };
      playSound(soundMap[action] || "move");
      
      // Clear animation after a delay
      setTimeout(() => {
        setLastAction(null);
        setNewPercepts([]);
      }, 1000);
    },
    [gameId, step, state, history]
  );

  const handleCellRightClick = useCallback(
    async (x: number, y: number) => {
      if (!gameId) return;
      await toggleCellColor.mutateAsync({ gameId, x, y });
      await state.refetch();
    },
    [gameId, toggleCellColor, state]
  );

  // Keyboard event handler
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!gameId || state.data?.state.terminal) return;

      const key = event.key.toUpperCase();
      switch (key) {
        case "W":
          doStep("Forward");
          break;
        case "A":
          doStep("TurnLeft");
          break;
        case "S":
          doStep("Shoot");
          break;
        case "D":
          doStep("TurnRight");
          break;
        case "G":
          doStep("Grab");
          break;
        default:
          break;
      }
    },
    [doStep, gameId, state.data?.state.terminal]
  );

  // Add keyboard event listeners
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const gameState = state.data?.state;
  const gameHistory = history.data?.history || [];

  // Watch for game state changes to play appropriate sounds
  useEffect(() => {
    if (!gameState || !gameHistory.length) return;

    const lastStep = gameHistory[gameHistory.length - 1];
    if (!lastStep) return;

    const { percepts } = lastStep;

    // Play percept sounds
    if (percepts.scream) playSound("scream");
    if (percepts.breeze) playSound("breeze");
    if (percepts.stench) playSound("stench");
    if (percepts.glitter) playSound("glitter");
    if (percepts.bump) playSound("bump");

    // Play game state sounds
    if (!gameState.agent.alive) {
      playSound("death");
    } else if (gameState.terminal && gameState.totalReward >= 1000) {
      playSound("victory");
    }
  }, [gameState, gameHistory, playSound]);

  return (
    <main className="p-4 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-5 pb-4 border-b-2 border-gray-700">
        <div className="text-center lg:text-left">
          <h1 className="text-white text-2xl lg:text-3xl font-bold mb-1">
            🗺️ Wumpus World - Enhanced Mode
          </h1>
          <p className="text-gray-400 text-sm lg:text-base">
            Navigate the cave, find gold, and escape alive!
          </p>
        </div>

        {gameState && (
          <div className="flex justify-center lg:justify-end gap-2">
            <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer px-3 py-2 bg-gray-800 rounded-md border border-gray-600 hover:border-green-500 transition-colors">
              <input
                type="checkbox"
                checked={showHidden}
                onChange={(e) => setShowHidden(e.target.checked)}
                className="accent-green-500"
              />
              Show Hidden Elements
            </label>
            <SoundToggle />
          </div>
        )}
      </div>

      {!gameId && (
        <div className="text-center p-10 bg-gray-800 rounded-xl border-2 border-gray-600">
          <div className="text-5xl mb-4">🎮</div>
          <h2 className="text-white text-2xl font-bold mb-2">
            Ready to Explore?
          </h2>
          <p className="text-gray-400 mb-5 max-w-md mx-auto">
            Enter the mysterious cave and try to find the gold while avoiding
            the Wumpus and pits!
          </p>
          <button
            onClick={() => start.mutate({ gridSize: 4 })}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-bold transition-colors"
          >
            🚀 Start Adventure
          </button>
        </div>
      )}

      {gameState && (
        <>
          {/* Game Status Bar */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 mb-5">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-3">
              <div className="text-center">
                <div className="text-white text-sm">📍 Position</div>
                <div className="text-green-500 font-bold">
                  ({gameState.agent.x}, {gameState.agent.y})
                </div>
              </div>
              <div className="text-center">
                <div className="text-white text-sm">🧭 Direction</div>
                <div className="text-blue-400 font-bold">
                  {gameState.agent.dir}
                </div>
              </div>
              <div className="text-center">
                <div className="text-white text-sm">❤️ Status</div>
                <div className={`font-bold ${gameState.agent.alive ? 'text-green-500' : 'text-red-500'}`}>
                  {gameState.agent.alive ? "Alive" : "Dead"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-white text-sm">💎 Gold</div>
                <div className={`font-bold ${gameState.agent.hasGold ? 'text-yellow-400' : 'text-gray-400'}`}>
                  {gameState.agent.hasGold ? "Found" : "Not Found"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-white text-sm">🏆 Score</div>
                <div className={`font-bold ${gameState.totalReward >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {gameState.totalReward}
                </div>
              </div>
            </div>

            {gameState.terminal && (
              <div className="text-center">
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                  gameState.totalReward >= 1000 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {gameState.totalReward >= 1000 ? "🎉 Victory!" : "💀 Game Over!"}
                </div>
              </div>
            )}
          </div>

          {/* Main Game Area */}
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Game Board */}
            <div className="flex-1 flex justify-center">
              <GameBoard 
                gameState={gameState} 
                showHidden={showHidden} 
                onCellRightClick={handleCellRightClick}
                lastAction={lastAction || undefined}
                newPercepts={newPercepts}
              />
            </div>

            {/* Controls */}
            <div className="lg:w-80 lg:min-w-80">
              <GameControls
                onAction={doStep}
                onRestart={() => {
                  setGameId(null);
                  setShowHidden(false);
                }}
                disabled={gameState.terminal}
                agentAlive={gameState.agent.alive}
                hasGold={gameState.agent.hasGold}
                hasArrow={gameState.agent.arrow > 0}
              />
            </div>
          </div>

          {/* Game History */}
          <div className="mt-5">
            <GameHistory history={gameHistory} />
          </div>

          {/* Restart Button */}
          {gameState.terminal && (
            <div className="text-center mt-5">
              <button
                onClick={() => {
                  setGameId(null);
                  setShowHidden(false);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-bold transition-colors"
              >
                🔄 Play Again
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
