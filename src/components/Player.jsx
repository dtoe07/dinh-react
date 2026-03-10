import { PLAYER_WIDTH, PLAYER_HEIGHT } from "../config/physics";

export default function Player({ x, y, isJumping, activeColor, isFinished }) {
  // Use the active color, or default to the emerald green if no obstacle is active
  const themeColor = activeColor || "rgb(16,185,129)";

  return (
    <div
      className="absolute bottom-0 will-change-transform z-50 flex items-center justify-center"
      style={{
        transform: `translate(${x}px, -${window.innerHeight - y}px)`,
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
        {/* Dynamic Eyes */}
        <div className="flex gap-1.5 mb-1.5">
          <div
            className={`transition-all duration-500 ${
              isFinished ? "w-2.5 h-3" : "w-2 h-1.5"
            } rounded-full`}
            style={{
              backgroundColor: themeColor,
              boxShadow: `0 0 10px ${themeColor}`,
            }}
          />
          <div
            className={`transition-all duration-500 ${
              isFinished ? "w-2.5 h-3" : "w-2 h-1.5"
            } rounded-full`}
            style={{
              backgroundColor: themeColor,
              boxShadow: `0 0 10px ${themeColor}`,
            }}
          />
        </div>

        {/* Dynamic Mouth - Transforms into a big smile when finished! */}
        <div
          className={`transition-all duration-500 ${
            isFinished
              ? "w-6 h-3.5 rounded-b-full rounded-t-sm" // Big open smile
              : "w-6 h-1 rounded-full opacity-60" // Normal straight line
          }`}
          style={{
            backgroundColor: themeColor,
            boxShadow: isFinished ? `0 0 10px ${themeColor}` : "none",
          }}
        />
      </div>
    </div>
  );
}
