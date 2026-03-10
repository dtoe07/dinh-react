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
import { ArrowLeft, ArrowRight, ArrowUp, Github } from "lucide-react"; // Added Github import

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
    progress: 0, // Add this to track percentage
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

    // Calculate completion percentage with offset
    const currentProgress = Math.min(
      100,
      Math.max(
        0,
        Math.round(
          ((s.worldX - PLAYER_START_X) / (WORLD_WIDTH - PLAYER_START_X)) * 100
        )
      )
    );

    setVisualState({
      x: cameraX,
      playerScreenX: screenX,
      y: s.playerY,
      isJumping: s.isJumping,
      active: currentAsset,
      progress: currentProgress, // Store it in state
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

  // Helper for mobile touch buttons
  const setKey = (code, isDown) => {
    stateRef.current.keys[code] = isDown;
  };

  return (
    // Added touch-none to prevent native mobile swiping/zooming behaviors
    <div className="w-full h-screen bg-[#020617] overflow-hidden relative transition-colors duration-1000 touch-none select-none">
      {/* WORLD WRAPPER - Shifts the whole visual engine up on mobile! */}
      <div className="absolute inset-0 transition-transform duration-500 -translate-y-[20vh] md:translate-y-0 pointer-events-none">
        <Background worldX={visualState.x} active={visualState.active} />

        {/* AMBIENCE GLOW - Changes based on the active obstacle */}
        <div
          className={`absolute inset-0 transition-all duration-1000 opacity-60 bg-gradient-to-b ${
            visualState.active
              ? visualState.active.bgGradient
              : "from-indigo-950/20"
          } to-transparent pointer-events-none`}
        />

        {/* INSPIRATIONAL QUOTE OVERLAY (Inside wrapper so player is in front, but counter-translates to stay safely below the site title!) */}
        <div className="absolute top-24 md:top-28 left-1/2 w-[85%] md:w-[60%] max-w-4xl -translate-x-1/2 text-center pointer-events-none flex flex-col gap-1 md:gap-2 z-0 transition-transform duration-500 translate-y-[20vh] md:translate-y-0">
          <h3
            className="text-[8px] md:text-sm lg:text-lg font-black font-mono uppercase tracking-widest leading-normal transition-all duration-1000 opacity-20 md:opacity-30"
            style={{
              color: visualState.active
                ? visualState.active.themeColor
                : "#f97316",
              textShadow: `0 0 20px ${
                visualState.active
                  ? visualState.active.themeColor
                  : "rgba(249, 115, 22, 0.5)"
              }`,
            }}
          >
            "Computers are incredibly fast, accurate, and stupid. Human beings
            are incredibly slow, inaccurate, and brilliant. Together they are
            powerful beyond imagination."
          </h3>
          <p
            className="text-[6px] md:text-xs font-bold tracking-[0.4em] transition-all duration-1000 opacity-30 md:opacity-50 uppercase"
            style={{
              color: visualState.active
                ? visualState.active.themeColor
                : "#f97316",
            }}
          >
            - Albert Einstein
          </p>
        </div>

        {/* GAME SCENE CAMERA - Zooms out physical elements on mobile */}
        <div
          className="absolute inset-0 md:scale-100 scale-[0.55] transition-transform duration-500"
          style={{ transformOrigin: `center ${GROUND_Y}px` }}
        >
          {/* MAIN GAME WORLD - Moves opposite to player */}
          <div
            className="absolute inset-0 pointer-events-auto"
            style={{ transform: `translateX(${-visualState.x}px)` }}
          >
            {/* Background Grid - Extended 2000px to the left! */}
            <div className="absolute bottom-0 -left-[2000px] h-[800px] w-[12000px] bg-[#020617] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:100px_100px] opacity-10" />

            {/* STREET LINE */}
            <div
              className="absolute w-[10000px] h-[60px]"
              style={{ top: GROUND_Y }}
            >
              {/* Visual Road Elements - Extended 2000px to the left */}
              <div className="absolute top-0 bottom-0 -left-[2000px] w-[12000px] bg-slate-950 border-t-2 border-slate-800" />
              <div className="absolute top-1/2 -translate-y-1/2 -left-[2000px] w-[12000px] h-1 bg-[linear-gradient(to_right,#334155_50%,transparent_50%)] bg-[length:60px_100%] opacity-30" />

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

              {/* Top glowing edge of the road - Extended 2000px to the left */}
              <div
                className="absolute top-0 -left-[2000px] w-[12000px] h-[1px] transition-all duration-1000"
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
                        className="w-10 h-10 md:w-16 md:h-16 relative z-10"
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

          <Player
            x={visualState.playerScreenX}
            y={visualState.y}
            isJumping={visualState.isJumping}
            activeColor={visualState.active?.themeColor} // Add this line!
          />
        </div>

        {/* DATA DISPLAY UNDER ROAD (Fixed to screen) */}
        <div
          className="absolute w-full px-6 md:px-12 pointer-events-none"
          style={{ top: GROUND_Y + 60 }} // Lifted up slightly for small screens
        >
          <div className="relative max-w-7xl mx-auto">
            {visualState.active ? (
              <div className="animate-in fade-in duration-700">
                <div className="flex items-end gap-3 md:gap-6 mb-2 md:mb-3">
                  <h2
                    className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter leading-none transition-all duration-1000"
                    style={{
                      color: "white",
                      textShadow: `0 0 15px ${visualState.active.themeColor}, 0 0 30px ${visualState.active.themeColor}`,
                    }}
                  >
                    {visualState.active.name}
                  </h2>
                  <div className="h-px flex-1 bg-white/10 mb-1 md:mb-2" />
                </div>

                <div className="flex flex-col md:flex-row md:flex-wrap items-start md:items-baseline gap-x-12 gap-y-2 md:gap-y-4 pt-2">
                  {visualState.active.type === "school" ? (
                    <div className="flex flex-col gap-3 md:gap-4 max-w-full md:max-w-4xl">
                      <span
                        className="text-xl md:text-3xl font-black font-mono tracking-tighter transition-all duration-1000 uppercase"
                        style={{
                          color: visualState.active.themeColor,
                          textShadow: `0 0 10px ${visualState.active.themeColor}`,
                        }}
                      >
                        {visualState.active.details.degree}
                      </span>

                      {/* ADD THIS NEW DESCRIPTION BLOCK */}
                      {visualState.active.details.description && (
                        <p className="text-xs md:text-sm font-medium text-white/70 leading-relaxed">
                          {visualState.active.details.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3 md:gap-8 mt-1">
                        {visualState.active.details.highlights.map((h, i) => (
                          <span
                            key={i}
                            className="text-[9px] md:text-[11px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 md:gap-3"
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
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-3 max-w-full md:max-w-4xl">
                        <span
                          className="text-lg md:text-3xl font-bold font-mono tracking-tighter transition-all duration-1000 leading-tight"
                          style={{
                            color: visualState.active.themeColor,
                            textShadow: `0 0 8px ${visualState.active.themeColor}`,
                          }}
                        >
                          {visualState.active.details.description}
                        </span>

                        {/* GITHUB LINK BUTTON */}
                        {visualState.active.details.github && (
                          <a
                            href={visualState.active.details.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/5 hover:bg-white/20 border border-white/20 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest text-white transition-all w-fit backdrop-blur-sm"
                            style={{
                              borderColor: visualState.active.themeColor,
                              boxShadow: `0 0 10px ${visualState.active.themeColor}30`,
                            }}
                          >
                            <Github
                              className="w-4 h-4"
                              style={{ color: visualState.active.themeColor }}
                            />
                            View Source Code
                          </a>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 md:gap-4 mt-2 md:mt-2 w-full">
                        {visualState.active.details.tech.map((t, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 md:px-4 md:py-1.5 border border-white/10 bg-white/5 rounded-md text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/60"
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
      </div>
      {/* ----- END OF WORLD WRAPPER ----- */}

      {/* SITE TITLE (Placed outside wrapper so it stays perfectly at the top margin) */}
      <div
        className="absolute top-8 left-6 md:left-12 z-[100] cursor-pointer pointer-events-auto"
        onClick={() => window.location.reload()}
      >
        <h1
          className="text-lg md:text-2xl font-black italic uppercase tracking-widest transition-all duration-1000"
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

      {/* WORLD PROGRESS TRACKER (Top Right) */}
      <div className="absolute top-8 right-6 md:right-12 z-[100] pointer-events-none">
        <h2
          className="text-lg md:text-2xl font-black font-mono italic tracking-widest transition-all duration-1000"
          style={{
            color: visualState.active
              ? visualState.active.themeColor
              : "#f97316",
            textShadow: `0 0 12px ${
              visualState.active
                ? visualState.active.themeColor
                : "rgba(249, 115, 22, 0.5)"
            }`,
          }}
        >
          {visualState.progress}%
        </h2>
      </div>

      {/* MOBILE TOUCH CONTROLS (Hidden on large screens, perfectly bottom-aligned) */}
      <div className="absolute bottom-8 left-0 w-full px-6 flex justify-between z-[200] md:hidden pointer-events-auto">
        <div className="flex gap-4">
          <button
            className="w-16 h-16 bg-white/10 active:bg-white/30 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white/70"
            onPointerDown={(e) => {
              e.preventDefault();
              setKey("ArrowLeft", true);
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              setKey("ArrowLeft", false);
            }}
            onPointerLeave={(e) => {
              e.preventDefault();
              setKey("ArrowLeft", false);
            }}
          >
            <ArrowLeft className="w-8 h-8" />
          </button>
          <button
            className="w-16 h-16 bg-white/10 active:bg-white/30 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white/70"
            onPointerDown={(e) => {
              e.preventDefault();
              setKey("ArrowRight", true);
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              setKey("ArrowRight", false);
            }}
            onPointerLeave={(e) => {
              e.preventDefault();
              setKey("ArrowRight", false);
            }}
          >
            <ArrowRight className="w-8 h-8" />
          </button>
        </div>
        <button
          className="w-16 h-16 bg-indigo-500/20 active:bg-indigo-500/50 backdrop-blur-md rounded-full border border-indigo-500/50 flex items-center justify-center text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
          onPointerDown={(e) => {
            e.preventDefault();
            setKey("Space", true);
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            setKey("Space", false);
          }}
          onPointerLeave={(e) => {
            e.preventDefault();
            setKey("Space", false);
          }}
        >
          <ArrowUp className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
