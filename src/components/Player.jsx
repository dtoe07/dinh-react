import { PLAYER_WIDTH, PLAYER_HEIGHT } from "../config/physics";

export default function Player({ x, y, isJumping, activeColor }) {
  return (
    <div
      className="absolute z-50 transition-colors duration-500"
      style={{
        left: x, // Uses the dynamic prop now!
        top: y - PLAYER_HEIGHT,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
      }}
    >
      <div className="w-12 h-12 bg-slate-900 rounded-xl border-2 flex flex-col items-center justify-center">
        <div className="flex gap-1 mb-1">
          <div className="w-2 h-1.5 bg-indigo-400 rounded-full" />
          <div className="w-2 h-1.5 bg-indigo-400 rounded-full" />
        </div>
        <div className="w-6 h-1 bg-indigo-400/20 rounded-full" />
      </div>
    </div>
  );
}
