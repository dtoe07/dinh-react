export function getTranslucentColor(color, opacity) {
  return color.replace("rgb", "rgba").replace(")", `, ${opacity})`);
}
