import { useState, useEffect } from "react";
import { PLAYER_WIDTH, PLAYER_HEIGHT } from "../config/physics";

export default function Player({ x, y, isJumping, activeColor, isFinished }) {
  const [isLanding, setIsLanding] = useState(false);

  // Trigger bouncy squash effect when jumping finishes
  useEffect(() => {
    if (!isJumping) {
      setIsLanding(true);
      // Give it 600ms to complete the multi-bounce animation
      const timer = setTimeout(() => setIsLanding(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isJumping]);

  // If we are finished, turn gold. Otherwise, use active color or default white.
  const themeColor = isFinished ? "#fbbf24" : activeColor || "#ffffff";
  const glowColor = isFinished
    ? "rgba(251, 191, 36, 0.8)"
    : activeColor || "rgba(255, 255, 255, 0.5)";

  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        left: x,
        top: y - PLAYER_HEIGHT,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
      }}
    >
      {/* Inject custom keyframes for the settling bounce effect */}
      <style>
        {`
          @keyframes multi-bounce {
            0%   { transform: translateY(0) scale(1.1, 0.9); }
            30%  { transform: translateY(-16px) scale(0.95, 1.05); }
            50%  { transform: translateY(0) scale(1.05, 0.95); }
            70%  { transform: translateY(-8px) scale(0.98, 1.02); }
            85%  { transform: translateY(0) scale(1.02, 0.98); }
            93%  { transform: translateY(-3px) scale(1, 1); }
            100% { transform: translateY(0) scale(1, 1); }
          }
          .animate-multi-bounce {
            animation: multi-bounce 0.6s ease-out forwards;
          }
        `}
      </style>

      {/* 
        THE CHARACTER WRAPPER
        Applies continuous multi-bounce when landing, or normal stretch when jumping.
      */}
      <div
        className={`relative w-full h-full transition-transform duration-150 ${
          isLanding ? "animate-multi-bounce" : ""
        }`}
        style={{
          transform:
            isJumping && !isLanding
              ? "scale(0.85, 1.15)" // Stretch up while jumping
              : "scale(1, 1)", // Controlled by animation when landing
        }}
      >
        {/* JETPACK THRUSTER (Only visible when jumping, doesn't spin!) */}
        <div
          className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-6 bg-gradient-to-b from-orange-400 to-transparent blur-sm transition-all duration-100 ${
            isJumping ? "opacity-100 animate-pulse" : "opacity-0"
          }`}
        />

        {/* --- MAIN BODY --- */}
        <div
          className="absolute inset-0 rounded-xl border-2 transition-colors duration-500 overflow-hidden bg-slate-900"
          style={{
            borderColor: themeColor,
            boxShadow: `0 0 15px ${glowColor}, inset 0 0 10px ${glowColor}`,
          }}
        >
          {/* Internal gradient shine */}
          <div className="absolute inset-0 opacity-20 bg-gradient-to-t from-transparent to-white" />

          {/* --- ROBOT SCREEN / VISOR --- */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-slate-950 rounded border border-white/20 flex items-center justify-center gap-1.5 overflow-hidden">
            {/* EYES (They become '> <' when jumping, and blink) */}
            <div
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: themeColor,
                boxShadow: `0 0 5px ${themeColor}`,
                transform: isJumping ? "scaleY(0.2)" : "scale(1)", // Squints when jumping!
              }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                backgroundColor: themeColor,
                boxShadow: `0 0 5px ${themeColor}`,
                transform: isJumping ? "scaleY(0.2)" : "scale(1)",
              }}
            />
          </div>

          {/* FINISH MODE - CSS mouth/smile if completed */}
          {isFinished && (
            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-2 rounded-b-full border-b-2 transition-all duration-300"
              style={{
                borderColor: themeColor,
                boxShadow: `0 2px 4px ${glowColor}`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
