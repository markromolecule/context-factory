// Deliberate module boundary violation: illegal upward relative traversal past package boundary
import { coreUtils } from "../../../src/internal/private-utils.ts";

export function callUtils() {
  return coreUtils();
}
