import { PLAYER_WIDTH, PLAYER_HEIGHT } from "../config/physics";

export default function Player({ x, y, isJumping, activeColor }) {
  // Use the active color, or default to the emerald green if no obstacle is active
  const themeColor = activeColor || "rgb(16,185,129)";

  return (
    <div
      className="absolute bottom-0 transition-transform duration-75"
      style={{
        left: x,
        bottom: window.innerHeight - y,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
      }}
    >
      {/* Dynamic Glow container */}
      <div
        className={`w-full h-full bg-slate-900 flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-1000 ${
          isJumping ? "scale-y-110 scale-x-90" : "scale-100"
        }`}
        style={{
          borderColor: themeColor,
          boxShadow: `0 0 20px ${themeColor}, 0 0 40px ${themeColor}`,
        }}
      >
        {/* Dynamic Eyes & Mouth */}
        <div className="flex gap-1 mb-1">
          <div
            className="w-2 h-1.5 rounded-full transition-colors duration-1000"
            style={{
              backgroundColor: themeColor,
              boxShadow: `0 0 10px ${themeColor}`,
            }}
          />
          <div
            className="w-2 h-1.5 rounded-full transition-colors duration-1000"
            style={{
              backgroundColor: themeColor,
              boxShadow: `0 0 10px ${themeColor}`,
            }}
          />
        </div>
        <div
          className="w-6 h-1 rounded-full transition-colors duration-1000 opacity-60"
          style={{ backgroundColor: themeColor }}
        />
      </div>
    </div>
  );
}
