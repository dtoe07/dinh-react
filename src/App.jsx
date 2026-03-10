import { useState, useEffect, useRef, useCallback } from "react";
import Player from "./components/Player";
import Background from "./components/Background";

import {
  GRAVITY,
  JUMP_FORCE,
  GROUND_Y,
  MOVEMENT_SPEED,
  WORLD_WIDTH,
  PLAYER_START_X,
  SCROLL_THRESHOLD,
  PLAYER_WIDTH,
} from "./config/physics";
import { ASSETS } from "./data/assets";

export default function App() {
  const stateRef = useRef({
    worldX: PLAYER_START_X, // Now starts at 200
    playerY: GROUND_Y,
    velY: 0,
    isJumping: false,
    keys: {},
  });

  const [visualState, setVisualState] = useState({
    x: 0, // This is now cameraX
    playerScreenX: PLAYER_START_X,
    y: GROUND_Y,
    active: null,
  });

  const gameLoopRef = useRef();

  const update = useCallback(() => {
    const s = stateRef.current;

    s.velY += GRAVITY;
    if (
      (s.keys["Space"] || s.keys["ArrowUp"] || s.keys["KeyW"]) &&
      !s.isJumping
    ) {
      s.velY = JUMP_FORCE;
      s.isJumping = true;
    }

    let nextWorldX = s.worldX;
    if (s.keys["ArrowRight"] || s.keys["KeyD"]) nextWorldX += MOVEMENT_SPEED;
    if (s.keys["ArrowLeft"] || s.keys["KeyA"]) nextWorldX -= MOVEMENT_SPEED;

    // Prevent walking out of bounds
    nextWorldX = Math.max(PLAYER_START_X, Math.min(nextWorldX, WORLD_WIDTH));

    // Collision Detection Logic
    const playerLeft = nextWorldX; // player is just at nextWorldX
    const playerRight = playerLeft + PLAYER_WIDTH;
    const nextFeetY = s.playerY + s.velY;
    const prevFeetY = s.playerY;

    let blocked = false;
    let landingPlatform = null;

    for (const asset of ASSETS) {
      const assetTop = GROUND_Y - asset.height;
      const assetLeft = asset.x;
      const assetRight = asset.x + asset.width;

      const xOverlap = playerRight > assetLeft && playerLeft < assetRight;

      if (xOverlap) {
        if (nextFeetY > assetTop + 10) {
          const prevPlayerLeft = s.worldX;
          const prevPlayerRight = prevPlayerLeft + PLAYER_WIDTH;
          if (prevPlayerRight <= assetLeft || prevPlayerLeft >= assetRight) {
            blocked = true;
          }
        }

        if (s.velY >= 0 && nextFeetY >= assetTop && prevFeetY <= assetTop + 5) {
          landingPlatform = asset;
        }
      }
    }

    if (!blocked) s.worldX = nextWorldX;

    if (landingPlatform) {
      s.playerY = GROUND_Y - landingPlatform.height;
      s.velY = 0;
      s.isJumping = false;
    } else if (nextFeetY >= GROUND_Y) {
      s.playerY = GROUND_Y;
      s.velY = 0;
      s.isJumping = false;
    } else {
      s.playerY = nextFeetY;
    }

    // Determine current active asset
    const absX = s.worldX + PLAYER_WIDTH / 2;
    const currentAsset =
      ASSETS.find((a) => absX >= a.x && absX <= a.x + a.width) || null;

    // --- CAMERA CALCULATION ---
    let cameraX = 0;
    let screenX = s.worldX;

    if (s.worldX > SCROLL_THRESHOLD) {
      cameraX = s.worldX - SCROLL_THRESHOLD; // World moves
      screenX = SCROLL_THRESHOLD; // Player stays fixed
    }

    setVisualState({
      x: cameraX,
      playerScreenX: screenX,
      y: s.playerY,
      isJumping: s.isJumping,
      active: currentAsset,
    });

    gameLoopRef.current = requestAnimationFrame(update);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      stateRef.current.keys[e.code] = true;
    };

    const handleKeyUp = (e) => {
      stateRef.current.keys[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    gameLoopRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(gameLoopRef.current);
    };
  }, [update]);

  return (
    <div className="w-full h-screen bg-[#020617] overflow-hidden relative transition-colors duration-1000">
      <Background worldX={visualState.x} active={visualState.active} />

      {/* SITE TITLE */}
      <div
        className="absolute top-8 left-12 z-[100] cursor-pointer"
        onClick={() => window.location.reload()}
      >
        <h1
          className="text-2xl font-black italic uppercase tracking-widest transition-all duration-1000"
          style={{
            color: visualState.active
              ? visualState.active.themeColor
              : "#f97316", // Starts orange (#f97316 text-orange-500)
            textShadow: `0 0 12px ${
              visualState.active
                ? visualState.active.themeColor
                : "rgba(249, 115, 22, 0.5)"
            }`,
          }}
        >
          Dinh Nguyen{" "}
          <span className="text-white/70 transition-colors duration-1000">
            Portfolio
          </span>
        </h1>
      </div>

      {/* AMBIENCE GLOW - Changes based on the active obstacle */}
      <div
        className={`absolute inset-0 transition-all duration-1000 opacity-60 bg-gradient-to-b ${
          visualState.active
            ? visualState.active.bgGradient
            : "from-indigo-950/20"
        } to-transparent pointer-events-none`}
      />

      {/* MAIN GAME WORLD - Moves opposite to player */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateX(${-visualState.x}px)` }}
      >
        {/* Background Grid */}
        <div className="absolute bottom-0 h-[800px] w-[10000px] bg-[#020617] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:100px_100px] opacity-10" />

        {/* STREET LINE */}
        <div
          className="absolute w-[10000px] h-[60px]"
          style={{ top: GROUND_Y }}
        >
          <div className="absolute inset-0 bg-slate-950 border-t-2 border-slate-800" />
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-[linear-gradient(to_right,#334155_50%,transparent_50%)] bg-[length:60px_100%] opacity-30" />

          {/* Label Markers on the road */}
          {ASSETS.map((asset) => (
            <div
              key={`label-${asset.id}`}
              className="absolute top-4 font-mono font-black italic uppercase transition-all duration-500"
              style={{
                left: asset.x + asset.width / 2,
                transform: "translateX(-50%)",
                color: asset.themeColor,
                textShadow: `0 0 10px ${asset.themeColor}`,
                fontSize: "11px",
                letterSpacing: "0.4em",
              }}
            >
              {asset.type}
            </div>
          ))}

          {/* Top glowing edge of the road */}
          <div
            className="absolute top-0 w-full h-[1px] transition-all duration-1000"
            style={{
              backgroundColor: visualState.active
                ? visualState.active.themeColor
                : "rgb(99, 102, 241)",
              boxShadow: `0 0 20px ${
                visualState.active
                  ? visualState.active.themeColor
                  : "rgba(99, 102, 241, 0.5)"
              }`,
            }}
          />
        </div>

        {/* Render the Assets/Obstacles */}
        {ASSETS.map((asset) => {
          const IconComp = asset.icon;
          return (
            <div
              key={asset.id}
              className="absolute transition-all duration-500"
              style={{
                left: asset.x,
                bottom: window.innerHeight - GROUND_Y,
                width: asset.width,
                height: asset.height,
              }}
            >
              <div
                className={`relative w-full h-full bg-slate-900/90 border-t-4 rounded-t-2xl shadow-2xl flex items-center justify-center ${
                  visualState.active?.id === asset.id
                    ? "brightness-125"
                    : "brightness-75"
                }`}
                style={{ borderColor: asset.themeColor }}
              >
                <div className="relative group">
                  <div
                    className="absolute inset-0 blur-2xl opacity-40"
                    style={{ backgroundColor: asset.themeColor }}
                  />
                  <IconComp
                    className="w-16 h-16 relative z-10"
                    style={{
                      color: asset.themeColor,
                      filter: `drop-shadow(0 0 8px ${asset.themeColor})`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DATA DISPLAY UNDER ROAD (Fixed to screen) */}
      <div
        className="absolute w-full px-12 pointer-events-none"
        style={{ top: GROUND_Y + 95 }}
      >
        <div className="relative max-w-7xl mx-auto">
          {visualState.active ? (
            <div className="animate-in fade-in duration-700">
              <div className="flex items-end gap-6 mb-3">
                <h2
                  className="text-6xl font-black italic uppercase tracking-tighter leading-none transition-all duration-1000"
                  style={{
                    color: "white",
                    textShadow: `0 0 15px ${visualState.active.themeColor}, 0 0 30px ${visualState.active.themeColor}`,
                  }}
                >
                  {visualState.active.name}
                </h2>
                <div className="h-px flex-1 bg-white/10 mb-2" />
              </div>

              <div className="flex flex-wrap items-baseline gap-x-12 gap-y-4">
                {visualState.active.type === "school" ? (
                  <>
                    <span
                      className="text-3xl font-black font-mono tracking-tighter transition-all duration-1000 uppercase"
                      style={{
                        color: visualState.active.themeColor,
                        textShadow: `0 0 10px ${visualState.active.themeColor}`,
                      }}
                    >
                      {visualState.active.details.degree}
                    </span>
                    <div className="flex gap-8">
                      {visualState.active.details.highlights.map((h, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-3"
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: visualState.active.themeColor,
                            }}
                          />{" "}
                          {h}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <span
                      className="text-3xl font-bold font-mono tracking-tighter transition-all duration-1000 max-w-4xl leading-tight"
                      style={{
                        color: visualState.active.themeColor,
                        textShadow: `0 0 8px ${visualState.active.themeColor}`,
                      }}
                    >
                      {visualState.active.details.description}
                    </span>
                    <div className="flex gap-4">
                      {visualState.active.details.tech.map((t, i) => (
                        <span
                          key={i}
                          className="px-4 py-1.5 border border-white/10 bg-white/5 rounded-md text-[10px] font-black uppercase tracking-widest text-white/60"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <Player
        x={visualState.playerScreenX}
        y={visualState.y}
        isJumping={visualState.isJumping}
      />
    </div>
  );
}
