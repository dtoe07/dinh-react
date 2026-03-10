import { useMemo } from "react";
import { GROUND_Y } from "../config/physics";
import { STARS, BACKDROP_BUILDINGS } from "../data/background";

export default function Background({ worldX, active }) {
  const getTranslucentColor = (color, opacity) => {
    if (!color) return "rgba(255,255,255,0.05)";
    return color.replace("rgb", "rgba").replace(")", `, ${opacity})`);
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* SKY BASE */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#020617]" />

      {/* STARS (Moves very slowly) */}
      <div className="absolute inset-0 overflow-hidden">
        {STARS.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white shadow-[0_0_8px_white]"
            style={{
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              transform: `translateX(${-(worldX * 0.1) % 2000}px)`,
            }}
          />
        ))}
      </div>

      {/* PARALLAX BUILDINGS (Moves moderately slow) */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateX(${-worldX * 0.4}px)` }}
      >
        {BACKDROP_BUILDINGS.map((building) => (
          <div
            key={building.id}
            className="absolute bottom-0 bg-slate-800/10 border-x border-t border-white/5 transition-colors duration-1000"
            style={{
              left: building.x,
              width: building.width,
              height: building.height,
              bottom: window.innerHeight - GROUND_Y,
              borderColor: active
                ? getTranslucentColor(active.themeColor, 0.1)
                : "rgba(255,255,255,0.05)",
            }}
          >
            {/* Fake building windows */}
            <div className="grid grid-cols-4 gap-2 p-4 opacity-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-1.5 bg-white/20 rounded-sm" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
