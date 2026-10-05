/**
 * Zero-dependency Octo-Agent Mascot rendering engine.
 * Renders the Context Factory mascot (orange octopus wearing backwards terminal cap)
 * using 24-bit TrueColor ANSI half-blocks (▀ / ▄), with automatic 256-color fallback,
 * terminal width adaptation, and clean suppression on NO_COLOR / non-TTY.
 */

const PALETTE = {
  _: null, // Transparent
  C: [30, 41, 59], // Cap dark navy (#1E293B)
  c: [51, 65, 85], // Cap slate highlight (#334155)
  b: [71, 85, 105], // Cap button / brim strap (#475569)
  T: [56, 189, 248], // Terminal prompt cyan >_ (#38BDF8)
  t: [255, 255, 255], // Terminal prompt white
  O: [255, 107, 53], // Octopus vibrant orange (#FF6B35)
  o: [255, 140, 66], // Octopus bright orange (#FF8C42)
  D: [217, 72, 15], // Octopus shadow / outline (#D9480F)
  W: [255, 255, 255], // Eye white
  E: [15, 23, 42], // Eye pupil dark navy
  e: [56, 189, 248], // Eye highlight reflection
  P: [251, 113, 133], // Cheek blush pink (#FB7185)
  S: [253, 186, 116], // Suction cups soft peach (#FDBA74)
  M: [153, 27, 27], // Mouth smile (#991B1B)
};

// 26 columns x 20 rows (10 terminal half-block lines)
const OCTO_PIXELS = [
  // Row 0 - Cap top & button
  "_________cccccccc_________",
  // Row 1 - Cap crown with >_ prompt
  "_______ccCCCCCCCCcc_______",
  // Row 2 - Cap front badge (>_)
  "______cCCCCTt__TCCCCc_____",
  // Row 3 - Cap base & backwards strap
  "_____cCCCCCT_tTTCCCCCc____",
  // Row 4 - Cap visor brim & forehead
  "____ccccccccccccccccccc___",
  // Row 5 - Forehead and upper head
  "_____ooOOOOOOOOOOOOOOo____",
  // Row 6 - Eyes top & highlights
  "____oOOOWeeOOOWeeOOOOOo___",
  // Row 7 - Eyes pupil & iris
  "____oOOOWEEOWWEEWOOOOOo___",
  // Row 8 - Eyes lower & cute blush
  "___oOOOOOWWWPPWWWWOOOOOo__",
  // Row 9 - Cheeks & smile
  "___oOOOPPPOOMMOOOPPPOOOo__",
  // Row 10 - Lower head & chin
  "____oOOOOOOOMMOOOOOOOOo___",
  // Row 11 - Neck & tentacle origins
  "_____DDOOOOOOOOOOOOODD____",
  // Row 12 - Outer tentacles spreading
  "___oo_DDOOOOOOOOOOODD_oo__",
  // Row 13 - Tentacle curls
  "__oOOo_DOOOOOOOOOOOD_oOOo_",
  // Row 14 - Suction cups & tentacles
  "_oOOOOo_DOOOOOOOOOD_oOOOOo",
  // Row 15 - Middle tentacles
  "_oOOSSOo_DOOOOOOOD_oOSSOOo",
  // Row 16 - Tentacle loops
  "__oOOOo__DDOOOOODD__oOOOo_",
  // Row 17 - Suction cup details
  "___oSSo__DOOSSOOD___oSSo__",
  // Row 18 - Bottom tentacle tips
  "____oo___DOOOOOOD____oo___",
  // Row 19 - Base outline
  "__________DDDDDD__________",
];

/**
 * Detect terminal color and graphic capability.
 */
export function getTerminalCapabilities() {
  if (process.env.NO_COLOR !== undefined || process.argv.includes("--no-color")) {
    return { hasColor: false, hasTrueColor: false, isTTY: Boolean(process.stdout?.isTTY), width: 80 };
  }

  const isTTY = Boolean(process.stdout?.isTTY);
  const width = process.stdout?.columns || 80;
  const forceColor = process.argv.includes("--color") || Boolean(process.env.FORCE_COLOR);

  if (!isTTY && !forceColor) {
    return { hasColor: false, hasTrueColor: false, isTTY: false, width };
  }

  const colorTerm = (process.env.COLORTERM || "").toLowerCase();
  const termProgram = (process.env.TERM_PROGRAM || "").toLowerCase();
  const term = (process.env.TERM || "").toLowerCase();

  const hasTrueColor =
    colorTerm === "truecolor" ||
    colorTerm === "24bit" ||
    termProgram === "iterm.app" ||
    termProgram === "apple_terminal" ||
    termProgram === "vscode" ||
    termProgram === "ghostty" ||
    termProgram === "wezterm" ||
    term.includes("24bit") ||
    term.includes("truecolor") ||
    forceColor;

  return {
    hasColor: true,
    hasTrueColor,
    isTTY,
    width,
  };
}

/**
 * Convert RGB tuple to 24-bit TrueColor ANSI escape sequence.
 */
function toTrueColorAnsi(topRgb, bottomRgb) {
  if (!topRgb && !bottomRgb) {
    return " ";
  }
  if (topRgb && !bottomRgb) {
    return `\x1b[38;2;${topRgb[0]};${topRgb[1]};${topRgb[2]}m▀\x1b[0m`;
  }
  if (!topRgb && bottomRgb) {
    return `\x1b[38;2;${bottomRgb[0]};${bottomRgb[1]};${bottomRgb[2]}m▄\x1b[0m`;
  }
  if (topRgb[0] === bottomRgb[0] && topRgb[1] === bottomRgb[1] && topRgb[2] === bottomRgb[2]) {
    return `\x1b[38;2;${topRgb[0]};${topRgb[1]};${topRgb[2]}m█\x1b[0m`;
  }
  return `\x1b[38;2;${topRgb[0]};${topRgb[1]};${topRgb[2]}m\x1b[48;2;${bottomRgb[0]};${bottomRgb[1]};${bottomRgb[2]}m▀\x1b[0m`;
}

/**
 * Convert RGB to closest 256-color palette code for legacy terminals.
 */
function rgbTo256(r, g, b) {
  if (r === g && g === b) {
    if (r < 8) return 16;
    if (r > 248) return 231;
    return Math.round(((r - 8) / 247) * 23) + 232;
  }
  const toComponent = (val) => Math.min(5, Math.floor((val / 256) * 6));
  return 16 + 36 * toComponent(r) + 6 * toComponent(g) + toComponent(b);
}

function to256Ansi(topRgb, bottomRgb) {
  if (!topRgb && !bottomRgb) return " ";
  const top256 = topRgb ? rgbTo256(...topRgb) : null;
  const bottom256 = bottomRgb ? rgbTo256(...bottomRgb) : null;

  if (top256 !== null && bottom256 === null) {
    return `\x1b[38;5;${top256}m▀\x1b[0m`;
  }
  if (top256 === null && bottom256 !== null) {
    return `\x1b[38;5;${bottom256}m▄\x1b[0m`;
  }
  if (top256 === bottom256) {
    return `\x1b[38;5;${top256}m█\x1b[0m`;
  }
  return `\x1b[38;5;${top256}m\x1b[48;5;${bottom256}m▀\x1b[0m`;
}

/**
 * Return array of lines for the rendered Octo-Agent mascot.
 */
export function getMascotLines(options = {}) {
  const caps = getTerminalCapabilities();

  if (!caps.hasColor || (caps.width < 60 && !options.force)) {
    return [];
  }

  const renderPixelPair = caps.hasTrueColor ? toTrueColorAnsi : to256Ansi;
  const lines = [];

  for (let r = 0; r < OCTO_PIXELS.length; r += 2) {
    const topRow = OCTO_PIXELS[r];
    const bottomRow = OCTO_PIXELS[r + 1] || "_".repeat(topRow.length);
    let line = "";

    for (let c = 0; c < topRow.length; c++) {
      const topKey = topRow[c] || "_";
      const bottomKey = bottomRow[c] || "_";
      const topRgb = PALETTE[topKey] || null;
      const bottomRgb = PALETTE[bottomKey] || null;
      line += renderPixelPair(topRgb, bottomRgb);
    }

    lines.push(line);
  }

  return lines;
}

/**
 * Render the full multi-line Octo-Agent mascot string.
 */
export function renderMascot(options = {}) {
  const lines = getMascotLines(options);
  return lines.join("\n");
}

/**
 * Render side-by-side mascot alongside title and summary.
 */
export function renderMascotHeader(title, subtitle, options = {}) {
  const caps = getTerminalCapabilities();
  const mascotLines = getMascotLines(options);

  if (mascotLines.length === 0 || caps.width < 75) {
    // Compact header fallback
    const divider = "─".repeat(Math.max(title.length, subtitle.length) + 6);
    return [
      `┌${divider}┐`,
      `│   \x1b[1m\x1b[37m${title}\x1b[0m   │`,
      `│   \x1b[2m${subtitle}\x1b[0m   │`,
      `└${divider}┘`,
    ].join("\n");
  }

  const headerLines = [
    "",
    `\x1b[1m\x1b[38;2;255;107;53m${title}\x1b[0m`,
    `\x1b[2m\x1b[38;2;148;163;184m${subtitle}\x1b[0m`,
    "",
    `\x1b[38;2;56;189;248mVersion:\x1b[0m  v3.15.0`,
    `\x1b[38;2;56;189;248mEngine:\x1b[0m   Pure Node.js ESM (zero external deps)`,
    `\x1b[38;2;56;189;248mMascot:\x1b[0m   Octo-Agent (\x1b[38;2;255;107;53m>_\x1b[0m)`,
    "",
    `\x1b[38;2;34;197;94m● Ready\x1b[0m   Run \x1b[1mcontext-cli --help\x1b[0m for commands`,
    "",
  ];

  const combined = [];
  const maxLines = Math.max(mascotLines.length, headerLines.length);

  for (let i = 0; i < maxLines; i++) {
    const left = mascotLines[i] || " ".repeat(26);
    const right = headerLines[i] || "";
    combined.push(`${left}   ${right}`);
  }

  return combined.join("\n");
}
