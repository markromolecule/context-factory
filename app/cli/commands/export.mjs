import { handleBuildCommand } from "./build.mjs";

export async function handleExportCommand(args = [], flags = {}) {
  const out = flags.out || args[0] || "dist/context-factory-export.json";
  return handleBuildCommand([out], { ...flags, out });
}
