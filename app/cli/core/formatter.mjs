/**
 * Zero-dependency terminal formatting utilities.
 * Supports ANSI colors, styles, boxes, badges, and tables with automatic
 * color suppression when NO_COLOR is set or when stdout is not a TTY.
 */

const isColorSupported = (() => {
  if (process.env.NO_COLOR !== undefined || process.argv.includes("--no-color")) {
    return false;
  }
  if (process.argv.includes("--color") || process.env.FORCE_COLOR) {
    return true;
  }
  return Boolean(process.stdout && process.stdout.isTTY);
})();

function wrap(start, end) {
  return (text) => (isColorSupported ? `\x1b[${start}m${text}\x1b[${end}m` : String(text));
}

export const colors = {
  reset: wrap(0, 0),
  bold: wrap(1, 22),
  dim: wrap(2, 22),
  italic: wrap(3, 23),
  underline: wrap(4, 24),
  inverse: wrap(7, 27),

  black: wrap(30, 39),
  red: wrap(31, 39),
  green: wrap(32, 39),
  yellow: wrap(33, 39),
  blue: wrap(34, 39),
  magenta: wrap(35, 39),
  cyan: wrap(36, 39),
  white: wrap(37, 39),
  gray: wrap(90, 39),

  bgRed: wrap(41, 49),
  bgGreen: wrap(42, 49),
  bgYellow: wrap(43, 49),
  bgBlue: wrap(44, 49),
  bgMagenta: wrap(45, 49),
  bgCyan: wrap(46, 49),
  bgWhite: wrap(47, 49),
};

export const badges = {
  pass: (text = "PASS") => colors.bgGreen(colors.black(` ${text} `)),
  fail: (text = "FAIL") => colors.bgRed(colors.white(` ${text} `)),
  warn: (text = "WARN") => colors.bgYellow(colors.black(` ${text} `)),
  info: (text = "INFO") => colors.bgCyan(colors.black(` ${text} `)),
  done: (text = "DONE") => colors.bgGreen(colors.black(` ${text} `)),
  sync: (text = "SYNC") => colors.bgMagenta(colors.white(` ${text} `)),
  lock: (text = "LOCK") => colors.bgBlue(colors.white(` ${text} `)),
  bridge: (text = "BRIDGE") => colors.bgCyan(colors.black(` ${text} `)),
  init: (text = "INIT") => colors.bgCyan(colors.black(` ${text} `)),
  dryRun: (text = "DRY RUN") => colors.bgYellow(colors.black(` ${text} `)),
};

export function banner(title = "CONTEXT FACTORY CLI", subtitle = "Deterministic context engineering & agent orchestration") {
  const width = Math.max(title.length, subtitle.length) + 6;
  const line = "─".repeat(width);
  return [
    colors.cyan(`┌${line}┐`),
    colors.cyan(`│   `) + colors.bold(colors.white(title.padEnd(width - 3))) + colors.cyan(`│`),
    colors.cyan(`│   `) + colors.dim(subtitle.padEnd(width - 3)) + colors.cyan(`│`),
    colors.cyan(`└${line}┘`),
  ].join("\n");
}

export function box(content, { title, borderColor = "cyan", padding = 1 } = {}) {
  const lines = Array.isArray(content) ? content : String(content).split("\n");
  const colorFn = colors[borderColor] || colors.cyan;

  const strippedLength = (str) => str.replace(/\x1b\[\d+m/g, "").length;
  const maxContentLength = Math.max(...lines.map(strippedLength), title ? title.length + 4 : 0);
  const innerWidth = maxContentLength + padding * 2;

  const topBorder = title
    ? `┌─ ${colors.bold(title)} ${"─".repeat(Math.max(0, innerWidth - title.length - 4))}┐`
    : `┌${"─".repeat(innerWidth)}┐`;

  const bottomBorder = `└${"─".repeat(innerWidth)}┘`;
  const pad = " ".repeat(padding);

  const formattedLines = lines.map((line) => {
    const len = strippedLength(line);
    const rightPad = " ".repeat(Math.max(0, innerWidth - len - padding * 2));
    return `${colorFn("│")}${pad}${line}${rightPad}${pad}${colorFn("│")}`;
  });

  return [colorFn(topBorder), ...formattedLines, colorFn(bottomBorder)].join("\n");
}

export function table(headers, rows, { align = [] } = {}) {
  const strippedLength = (str) => String(str ?? "").replace(/\x1b\[\d+m/g, "").length;
  const colWidths = headers.map((h, i) => {
    const rowMax = rows.reduce((max, r) => Math.max(max, strippedLength(r[i])), 0);
    return Math.max(strippedLength(h), rowMax);
  });

  function formatRow(cells, isHeader = false) {
    return cells.map((cell, i) => {
      const str = String(cell ?? "");
      const len = strippedLength(str);
      const diff = colWidths[i] - len;
      const pad = " ".repeat(Math.max(0, diff));
      const alignment = align[i] || "left";
      let formatted = alignment === "right" ? `${pad}${str}` : `${str}${pad}`;
      if (isHeader) formatted = colors.bold(formatted);
      return formatted;
    }).join("  ");
  }

  const divider = colWidths.map((w) => "─".repeat(w)).join("  ");
  const headerLine = formatRow(headers, true);
  const rowLines = rows.map((r) => formatRow(r));

  return [headerLine, colors.dim(divider), ...rowLines].join("\n");
}
