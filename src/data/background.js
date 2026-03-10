export const STARS = Array.from({ length: 100 }).map((_, i) => ({
  id: `star-${i}`,
  x: Math.random() * 2000,
  y: Math.random() * 400,
  size: Math.random() * 2 + 1,
  opacity: Math.random(),
}));

export const BACKDROP_BUILDINGS = Array.from({ length: 25 }).map((_, i) => ({
  id: `bg-b-${i}`,
  x: i * 350 + Math.random() * 100,
  width: 100 + Math.random() * 150,
  height: 200 + Math.random() * 400,
}));
