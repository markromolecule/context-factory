import { spawn } from "node:child_process";

/**
 * Safe, injection-resistant process runner service (shell: false, argv array only).
 */
export async function executeCommand({
  command,
  args = [],
  cwd = process.cwd(),
  timeoutMs = 15000,
  maxOutputBytes = 1024 * 1024,
  env = {},
} = {}) {
  const startTime = Date.now();

  if (typeof command !== "string" || !command.trim()) {
    throw new Error("executeCommand: command must be a non-empty string.");
  }

  return new Promise((resolve) => {
    let stdoutBuffer = "";
    let stderrBuffer = "";
    let timedOut = false;
    let notFound = false;
    let finished = false;

    let child = null;
    let timer = null;

    try {
      child = spawn(command, args, {
        cwd,
        env: { ...process.env, ...env },
        shell: false, // Strict injection prevention: no shell interpolation
      });
    } catch (err) {
      return resolve({
        exitCode: 127,
        stdout: "",
        stderr: err.message,
        durationMs: Date.now() - startTime,
        timedOut: false,
        notFound: true,
      });
    }

    timer = setTimeout(() => {
      timedOut = true;
      if (child && !child.killed) {
        child.kill("SIGTERM");
        setTimeout(() => {
          if (child && !child.killed) child.kill("SIGKILL");
        }, 1000).unref?.();
      }
    }, timeoutMs);

    if (typeof timer.unref === "function") {
      timer.unref();
    }

    child.on("error", (err) => {
      if (finished) return;
      finished = true;
      if (timer) clearTimeout(timer);
      if (err.code === "ENOENT") notFound = true;
      resolve({
        exitCode: notFound ? 127 : 1,
        stdout: stdoutBuffer,
        stderr: stderrBuffer ? `${stderrBuffer}\n${err.message}` : err.message,
        durationMs: Date.now() - startTime,
        timedOut,
        notFound,
      });
    });

    child.stdout?.on("data", (chunk) => {
      if (stdoutBuffer.length < maxOutputBytes) {
        stdoutBuffer += chunk.toString("utf8");
      }
    });

    child.stderr?.on("data", (chunk) => {
      if (stderrBuffer.length < maxOutputBytes) {
        stderrBuffer += chunk.toString("utf8");
      }
    });

    child.on("close", (code) => {
      if (finished) return;
      finished = true;
      if (timer) clearTimeout(timer);
      resolve({
        exitCode: code ?? (timedOut ? 124 : 0),
        stdout: stdoutBuffer,
        stderr: stderrBuffer,
        durationMs: Date.now() - startTime,
        timedOut,
        notFound,
      });
    });
  });
}
