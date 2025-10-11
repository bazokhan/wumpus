"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playSound: (soundName: string) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
}

// Simple sound generator using Web Audio API
function createSound(frequency: number, duration: number = 200, type: OscillatorType = "sine"): void {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (error) {
    console.warn("Audio not supported:", error);
  }
}

const sounds = {
  move: () => createSound(440, 150, "sine"),
  turn: () => createSound(330, 100, "square"),
  grab: () => createSound(880, 300, "sawtooth"),
  shoot: () => createSound(660, 200, "triangle"),
  scream: () => createSound(220, 500, "sawtooth"),
  breeze: () => createSound(330, 200, "sine"),
  stench: () => createSound(165, 300, "triangle"),
  glitter: () => createSound(1320, 250, "sine"),
  bump: () => createSound(110, 100, "square"),
  death: () => {
    createSound(220, 200, "sawtooth");
    setTimeout(() => createSound(165, 200, "sawtooth"), 200);
    setTimeout(() => createSound(110, 400, "sawtooth"), 400);
  },
  victory: () => {
    createSound(523, 200, "sine"); // C5
    setTimeout(() => createSound(659, 200, "sine"), 200); // E5
    setTimeout(() => createSound(784, 300, "sine"), 400); // G5
  }
};

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    localStorage.setItem("wumpus-sound-muted", (!isMuted).toString());
  };

  const playSound = (soundName: string) => {
    if (isMuted) return;
    
    const soundFunction = sounds[soundName as keyof typeof sounds];
    if (soundFunction) {
      soundFunction();
    }
  };

  useEffect(() => {
    const savedMuteState = localStorage.getItem("wumpus-sound-muted");
    if (savedMuteState === "true") {
      setIsMuted(true);
    }
  }, []);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export function SoundToggle() {
  const { isMuted, toggleMute } = useSound();

  return (
    <button
      onClick={toggleMute}
      className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-md border border-gray-600 hover:border-gray-500 transition-colors"
      title={isMuted ? "Unmute sounds" : "Mute sounds"}
    >
      <span className="text-lg">{isMuted ? "🔇" : "🔊"}</span>
      <span className="text-sm text-gray-300 hidden sm:inline">
        {isMuted ? "Muted" : "Sound On"}
      </span>
    </button>
  );
}
