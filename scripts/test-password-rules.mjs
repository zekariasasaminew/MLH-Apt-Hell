import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/app/signin/password-rules.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const generatedModule = { exports: {} };
new Function("module", "exports", compiled)(generatedModule, generatedModule.exports);
const { DEMO_PASSWORD, PASSWORD_RULES, validateRules } = generatedModule.exports;

test("the deterministic demo password completes every progressive rule", () => {
  const results = validateRules(DEMO_PASSWORD, PASSWORD_RULES, {
    year: 2026,
    exemptions: true,
    demoMode: true,
  });

  assert.equal(PASSWORD_RULES.length >= 15, true);
  assert.deepEqual(results.filter((rule) => !rule.passed), []);
});

test("the sacred-number rule rejects impostors", () => {
  const primeRule = PASSWORD_RULES.find((rule) => rule.id === "prime");
  assert.ok(primeRule);
  assert.equal(primeRule.validate("66", { year: 2026, exemptions: false, demoMode: false }), false);
  assert.equal(primeRule.validate("67", { year: 2026, exemptions: false, demoMode: false }), true);
});

