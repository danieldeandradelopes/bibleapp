import { describe, expect, it } from "vitest";
import { canShareReadyMessage } from "@/features/auth/permissions";

describe("canShareReadyMessage", () => {
  it("allows admin", () => {
    expect(canShareReadyMessage("admin")).toBe(true);
  });

  it("blocks user and anonymous roles", () => {
    expect(canShareReadyMessage("user")).toBe(false);
    expect(canShareReadyMessage(null)).toBe(false);
    expect(canShareReadyMessage(undefined)).toBe(false);
  });
});
