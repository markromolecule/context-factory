import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  createPlanBranchName,
  planFilenameForBranch,
  releasePlanIdReservation,
  reserveNextPlanId,
} from "../../../scripts/plan-id-reservation.mjs";

const execFileAsync = promisify(execFile);

async function createRepository() {
  const directory = await mkdtemp(join(tmpdir(), "cf-plan-reservation-"));
  await execFileAsync("git", ["init", "--quiet", directory]);
  await execFileAsync("git", ["-C", directory, "config", "user.email", "test@example.com"]);
  await execFileAsync("git", ["-C", directory, "config", "user.name", "Test User"]);
  await writeFile(join(directory, "README.md"), "fixture\n");
  await execFileAsync("git", ["-C", directory, "add", "README.md"]);
  await execFileAsync("git", ["-C", directory, "commit", "--quiet", "-m", "fixture"]);
  await mkdir(join(directory, "docs", "tasks"), { recursive: true });
  return directory;
}

describe("repo-wide plan-ID reservation", () => {
  it("returns distinct IDs when two callers reserve concurrently", async () => {
    const repository = await createRepository();
    try {
      const [first, second] = await Promise.all([
        reserveNextPlanId({ repository }),
        reserveNextPlanId({ repository }),
      ]);

      assert.notEqual(first.id, second.id);
      assert.match(first.id, /^PLN-\d{4}$/);
      assert.match(second.id, /^PLN-\d{4}$/);
    } finally {
      await rm(repository, { recursive: true, force: true });
    }
  });

  it("releases an unused reservation only when its owner matches", async () => {
    const repository = await createRepository();
    try {
      const reservation = await reserveNextPlanId({ repository });
      const rejected = await releasePlanIdReservation({
        repository,
        id: reservation.id,
        owner: "another-owner",
      });
      const released = await releasePlanIdReservation({
        repository,
        id: reservation.id,
        owner: reservation.owner,
      });

      assert.equal(rejected, false);
      assert.equal(released, true);
    } finally {
      await rm(repository, { recursive: true, force: true });
    }
  });

  it("maps an allowed branch type and slug to the plan filename", () => {
    const branch = createPlanBranchName({ type: "feat", id: "PLN-0042", slug: "oauth-login" });
    assert.equal(branch, "feat/PLN-0042-oauth-login");
    assert.equal(planFilenameForBranch(branch), "feat-PLN-0042-oauth-login.md");
    assert.throws(() => createPlanBranchName({ type: "feature", id: "PLN-0042", slug: "oauth-login" }));
    assert.throws(() => createPlanBranchName({ type: "feat", id: "PLN-0042", slug: "OAuth Login" }));
  });
});
