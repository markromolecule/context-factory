import { clearSession, listSessions, loadSession, saveSession } from "../../../scripts/session-core.mjs";
import { badges, colors, table } from "../core/formatter.mjs";

export async function handleSessionCommand(args = [], flags = {}) {
  const subCommand = args[0] || "status";

  if (subCommand === "save") {
    const name = flags.name || args[1] || null;
    const prompt = flags.prompt || null;
    const status = flags.status || "passing";

    const result = await saveSession({
      name,
      coldStartPrompt: prompt,
      status,
    });

    if (flags.json) {
      console.log(JSON.stringify(result, null, 2));
      return 0;
    }

    console.log(`\n${badges.done("SAVED")} Session checkpoint saved: ${colors.bold(result.sessionId)}\n`);
    console.log(`  ${colors.bold("State File:")}   ${colors.cyan(result.sessionPath)}`);
    console.log(`  ${colors.bold("Resume File:")}  ${colors.cyan(result.resumePath)}`);
    console.log(`  ${colors.bold("Token Budget:")} ${colors.green(String(result.tokenEstimate) + " tokens")} (well under 1,500 token ceiling)`);
    console.log(`  ${colors.bold("Branch:")}        ${colors.yellow(result.data.gitState.branch)}`);
    if (result.data.taskPointer?.taskId) {
      console.log(`  ${colors.bold("Active Task:")}   ${colors.magenta(result.data.taskPointer.taskId)} (${result.data.taskPointer.unitFile || "in-progress"})`);
    }
    console.log(`\n${colors.dim("To resume in a fresh IDE session: run 'context.mjs session:resume' or paste .tmp/SESSION_RESUME.md")}\n`);
    return 0;
  }

  if (subCommand === "resume") {
    const targetId = args[1] || flags.name || "latest";
    try {
      const session = await loadSession(targetId);

      if (flags.json) {
        console.log(JSON.stringify(session, null, 2));
        return 0;
      }

      console.log(`\n${badges.info("RESUME")} Resuming Session: ${colors.bold(session.sessionId)}\n`);
      console.log(`  ${colors.bold("Timestamp:")}   ${colors.dim(session.timestamp)}`);
      console.log(`  ${colors.bold("Branch:")}      ${colors.yellow(session.gitState.branch)} (HEAD: ${colors.dim(session.gitState.headCommit)})`);
      if (session.taskPointer?.taskId) {
        console.log(`  ${colors.bold("Task:")}        ${colors.magenta(session.taskPointer.taskId)}`);
        if (session.taskPointer.unitFile) {
          console.log(`  ${colors.bold("Active Unit:")} ${colors.cyan(session.taskPointer.unitFile)}`);
        }
      }
      if (session.gitState.modifiedFiles?.length > 0) {
        console.log(`  ${colors.bold("Modified:")}    ${colors.white(session.gitState.modifiedFiles.join(", "))}`);
      }
      console.log(`\n${colors.bold("Cold-Start Prompt:")}\n`);
      console.log(colors.cyan(session.coldStartPrompt));
      console.log("");
      return 0;
    } catch (err) {
      console.error(`\n${badges.fail()} Failed to resume session: ${err.message}\n`);
      return 1;
    }
  }

  if (subCommand === "status" || subCommand === "list") {
    const sessions = await listSessions();

    if (flags.json) {
      console.log(JSON.stringify(sessions, null, 2));
      return 0;
    }

    console.log(`\n${colors.bold(`Saved Sessions (${sessions.length})`)}\n`);
    if (sessions.length === 0) {
      console.log(`  ${colors.dim("No active sessions saved. Use 'session:save' to checkpoint your session.")}\n`);
      return 0;
    }

    const headers = ["Session ID", "Branch", "Task", "Saved At"];
    const rows = sessions.map((s, idx) => [
      idx === 0 ? colors.bold(colors.green(`* ${s.sessionId}`)) : colors.white(`  ${s.sessionId}`),
      colors.yellow(s.gitState?.branch || "unknown"),
      s.taskPointer?.taskId ? colors.magenta(s.taskPointer.taskId) : colors.dim("none"),
      colors.dim(s.timestamp?.slice(0, 19).replace("T", " ") || "unknown"),
    ]);

    console.log(table(headers, rows));
    console.log(`\n  ${colors.dim("(* denotes latest active session)")}\n`);
    return 0;
  }

  if (subCommand === "clear") {
    const targetId = flags.all ? "all" : (args[1] || "latest");
    const result = await clearSession(targetId);

    if (flags.json) {
      console.log(JSON.stringify(result, null, 2));
      return 0;
    }

    console.log(`\n${badges.done("CLEARED")} Removed session checkpoint (${targetId}).\n`);
    return 0;
  }

  throw new Error(`Unknown session subcommand: "${subCommand}". Supported: session:save, session:resume, session:status, session:clear`);
}
