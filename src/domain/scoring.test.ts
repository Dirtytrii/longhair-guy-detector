import { describe, expect, it } from "vitest";

import {
  ANSWER_OPTIONS,
  QUESTIONS,
  RESULT_CODES,
  answersForResultCode,
  scoreAnswers,
} from "./scoring";

describe("longhair guy scoring", () => {
  it("uses the approved five option labels and values", () => {
    expect(ANSWER_OPTIONS).toEqual([
      { label: "拉完了", value: -2 },
      { label: "有点拉", value: -1 },
      { label: "NPC", value: 0 },
      { label: "人上人", value: 1 },
      { label: "夯", value: 2 },
    ]);
  });

  it("resolves all NPC answers to OHBG through tie-break agree poles", () => {
    const answers = Object.fromEntries(QUESTIONS.map((question) => [question.id, 0]));

    expect(scoreAnswers(answers).code).toBe("OHBG");
  });

  it("uses the final question of an axis as the tie-break when the axis total is zero", () => {
    const answers = Object.fromEntries(QUESTIONS.map((question) => [question.id, 0]));
    answers[1] = 2;
    answers[6] = 2;

    const result = scoreAnswers(answers);

    expect(result.axisScores.AO.score).toBe(0);
    expect(result.axisScores.AO.pole).toBe("O");
  });

  it("can construct answers that reach every one of the 16 result codes", () => {
    for (const code of RESULT_CODES) {
      expect(scoreAnswers(answersForResultCode(code)).code).toBe(code);
    }
  });

  it("rejects incomplete answer sets", () => {
    expect(() => scoreAnswers({ 1: 2 })).toThrow(/24/);
  });
});
