import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("allows public pages and disallows authenticated routes", () => {
    const { rules, sitemap } = robots();
    const rule = Array.isArray(rules) ? rules[0] : rules;

    expect(rule.userAgent).toBe("*");
    expect(rule.allow).toBe("/");
    expect(rule.disallow).toEqual(
      expect.arrayContaining(["/dashboard", "/my-tickets", "/verify"]),
    );
    expect(sitemap).toMatch(/\/sitemap\.xml$/);
  });

  it("disallows the bare paths without trailing slashes", () => {
    const { rules } = robots();
    const rule = Array.isArray(rules) ? rules[0] : rules;
    const disallowed = Array.isArray(rule.disallow)
      ? rule.disallow
      : [rule.disallow];

    // Prefix matching means /dashboard covers both /dashboard and /dashboard/*
    expect(disallowed).toContain("/dashboard");
    expect(disallowed).toContain("/my-tickets");
    expect(disallowed).toContain("/verify");
  });
});
