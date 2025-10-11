import React from "react";

// Agent graphics based on direction
export const Agent = ({
  direction,
  hasGold,
  alive,
}: {
  direction: string;
  hasGold: boolean;
  alive: boolean;
}) => {
  const size = 32;
  const color = alive ? "#4CAF50" : "#F44336";
  const goldColor = "#FFD700";

  const getRotation = (dir: string) => {
    switch (dir) {
      case "N":
        return 0;
      case "E":
        return 90;
      case "S":
        return 180;
      case "W":
        return 270;
      default:
        return 0;
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        style={{
          transform: `rotate(${getRotation(direction)}deg)`,
          opacity: alive ? 1 : 0.5,
        }}
      >
        {/* Agent body */}
        <circle
          cx="16"
          cy="20"
          r="8"
          fill={color}
          stroke="#333"
          strokeWidth="1"
        />
        {/* Agent head */}
        <circle
          cx="16"
          cy="12"
          r="6"
          fill={color}
          stroke="#333"
          strokeWidth="1"
        />
        {/* Eyes */}
        <circle cx="13" cy="10" r="1.5" fill="#333" />
        <circle cx="19" cy="10" r="1.5" fill="#333" />
        {/* Direction indicator (arrow) */}
        <polygon points="16,6 12,12 20,12" fill="#333" />
      </svg>
      {hasGold && (
        <div
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            width: 16,
            height: 16,
            borderRadius: "50%",
            backgroundColor: goldColor,
            border: "2px solid #333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "10px",
          }}
        >
          💎
        </div>
      )}
    </div>
  );
};

// Wumpus graphic
export const Wumpus = () => (
  <svg width="32" height="32" viewBox="0 0 32 32">
    {/* Wumpus body */}
    <ellipse
      cx="16"
      cy="18"
      rx="12"
      ry="8"
      fill="#8B4513"
      stroke="#654321"
      strokeWidth="1"
    />
    {/* Wumpus head */}
    <circle
      cx="16"
      cy="12"
      r="8"
      fill="#8B4513"
      stroke="#654321"
      strokeWidth="1"
    />
    {/* Eyes */}
    <circle cx="13" cy="10" r="2" fill="#FF0000" />
    <circle cx="19" cy="10" r="2" fill="#FF0000" />
    {/* Teeth */}
    <rect x="14" y="14" width="1" height="3" fill="#FFFFFF" />
    <rect x="17" y="14" width="1" height="3" fill="#FFFFFF" />
    {/* Horns */}
    <polygon points="12,6 10,2 14,4" fill="#654321" />
    <polygon points="20,6 22,2 18,4" fill="#654321" />
  </svg>
);

// Pit graphic
export const Pit = () => (
  <svg width="32" height="32" viewBox="0 0 32 32">
    {/* Pit opening */}
    <circle cx="16" cy="16" r="14" fill="#000000" opacity="0.8" />
    {/* Pit depth illusion */}
    <circle cx="16" cy="20" r="10" fill="#000000" />
    <circle cx="16" cy="24" r="6" fill="#000000" />
    {/* Spikes around edge */}
    <polygon points="16,2 18,8 14,8" fill="#444444" />
    <polygon points="30,16 24,18 24,14" fill="#444444" />
    <polygon points="16,30 14,24 18,24" fill="#444444" />
    <polygon points="2,16 8,14 8,18" fill="#444444" />
  </svg>
);

// Gold graphic
export const Gold = () => (
  <svg width="32" height="32" viewBox="0 0 32 32">
    {/* Gold pile */}
    <circle
      cx="16"
      cy="20"
      r="8"
      fill="#FFD700"
      stroke="#B8860B"
      strokeWidth="2"
    />
    <circle
      cx="12"
      cy="18"
      r="4"
      fill="#FFD700"
      stroke="#B8860B"
      strokeWidth="1"
    />
    <circle
      cx="20"
      cy="18"
      r="4"
      fill="#FFD700"
      stroke="#B8860B"
      strokeWidth="1"
    />
    {/* Sparkles */}
    <polygon points="16,8 17,12 13,12" fill="#FFD700" />
    <polygon points="24,16 20,17 20,15" fill="#FFD700" />
    <polygon points="8,16 12,15 12,17" fill="#FFD700" />
    <polygon points="16,24 15,20 19,20" fill="#FFD700" />
  </svg>
);

// Percept indicators
export const BreezeIndicator = () => (
  <div>
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path
        d="M2,8 Q4,4 8,6 Q12,8 14,4"
        stroke="#87CEEB"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M2,10 Q4,6 8,8 Q12,10 14,6"
        stroke="#87CEEB"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  </div>
);

export const StenchIndicator = () => (
  <div>
    <svg width="16" height="16" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="6" fill="#8B4513" opacity="0.7" />
      <circle cx="6" cy="6" r="2" fill="#8B4513" opacity="0.5" />
      <circle cx="10" cy="6" r="2" fill="#8B4513" opacity="0.5" />
      <circle cx="8" cy="10" r="2" fill="#8B4513" opacity="0.5" />
    </svg>
  </div>
);

export const GlitterIndicator = () => (
  <div>
    <svg width="16" height="16" viewBox="0 0 16 16">
      <polygon points="8,2 9,6 5,6" fill="#FFD700" />
      <polygon points="14,8 10,9 10,7" fill="#FFD700" />
      <polygon points="2,8 6,7 6,9" fill="#FFD700" />
      <polygon points="8,14 7,10 11,10" fill="#FFD700" />
      <circle cx="8" cy="8" r="1" fill="#FFD700" />
    </svg>
  </div>
);

export const BumpIndicator = () => (
  <div>
    <svg width="16" height="16" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="6" fill="#FF6B6B" opacity="0.8" />
      <text x="8" y="11" textAnchor="middle" fontSize="10" fill="white">
        !
      </text>
    </svg>
  </div>
);

export const ScreamIndicator = () => (
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }}
  >
    <svg width="20" height="20" viewBox="0 0 20 20">
      <path
        d="M10,2 L12,8 L18,8 L13,12 L15,18 L10,14 L5,18 L7,12 L2,8 L8,8 Z"
        fill="#FF4444"
        opacity="0.9"
      />
    </svg>
  </div>
);
