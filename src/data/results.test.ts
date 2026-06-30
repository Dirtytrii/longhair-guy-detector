import { describe, expect, it } from "vitest";

import { RESULT_CODES } from "../domain/scoring";
import { GLOBAL_COPY_POOL, RESULTS, getResultByCode } from "./results";

describe("result content data", () => {
  it("contains exactly one entry for every result code", () => {
    expect(RESULTS.map((result) => result.code)).toEqual(RESULT_CODES);
  });

  it("uses the approved short names from the product naming document", () => {
    expect(Object.fromEntries(RESULTS.map((result) => [result.code, result.shortName]))).toEqual({
      ATDF: "天台终极长发男",
      ATDG: "末日人文长发男",
      ATBF: "冷静造船长发男",
      ATBG: "人间火种长发男",
      AHDF: "雾中独行长发男",
      AHDG: "温柔犬儒长发男",
      AHBF: "便利店自救长发男",
      AHBG: "河边晒衣长发男",
      OTDF: "反骨考据长发男",
      OTDG: "漂亮话稽查长发男",
      OTBF: "废墟架构师长发男",
      OTBG: "修桥长发男",
      OHDF: "体面反骨长发男",
      OHDG: "老派温柔长发男",
      OHBF: "小院掌灯长发男",
      OHBG: "人间烟火长发男",
    });
  });

  it("keeps each render-critical result field populated", () => {
    for (const result of RESULTS) {
      expect(result.sceneName).not.toHaveLength(0);
      expect(result.tagline).not.toHaveLength(0);
      expect(result.description.length).toBeGreaterThan(30);
      expect(result.danger.length).toBeGreaterThanOrEqual(2);
      expect(result.companions.length).toBe(3);
      expect(result.readings.length).toBe(3);
      expect(result.copyPool.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("keeps risky ATDF wording away from self-harm or fall imagery", () => {
    const atdf = getResultByCode("ATDF");
    const renderText = [
      atdf.shortName,
      atdf.sceneName,
      atdf.tagline,
      atdf.description,
      ...atdf.danger,
      ...atdf.copyPool,
    ].join("");

    expect(renderText).not.toMatch(/自伤|自杀|跳下|坠落|天台边缘/);
  });

  it("provides a reusable global copy pool for loading and share cards", () => {
    expect(GLOBAL_COPY_POOL.length).toBeGreaterThanOrEqual(10);
    expect(GLOBAL_COPY_POOL).toContain("长发不在头上，在精神内耗里。");
  });
});
