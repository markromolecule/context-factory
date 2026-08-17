#!/usr/bin/env node
import { handleCli } from "./harness-cli.mjs";

handleCli(process.argv.slice(2)).then((code) => {
  if (code !== 0) process.exit(code);
}).catch((err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
