//import { BossGameScreenController } from "../screens/BossGameScreen/BossGameScreenController.ts";
import { BossGameScreenModel } from "../src/screens/BossGameScreen/BossGameScreenModel.ts";
//import { BossGameScreenView } from "../screens/BossGameScreen/BossGameScreenView.ts";

describe("BossGameScreenModel", () => {

  it("starts with score 0 and time 60", () => {
    const m = new BossGameScreenModel();
    expect(m.getScore()).toBe(0);
    expect(m.getTime()).toBe(60);
  });

  it("adds score correctly", () => {
    const m = new BossGameScreenModel();
    m.addScore(10);
    expect(m.getScore()).toBe(10);
  });

  it("tickTimer reduces time by 1", () => {
    const m = new BossGameScreenModel();
    m.tickTimer();
    expect(m.getTime()).toBe(59);
  });

  it("reset restores default values", () => {
    const m = new BossGameScreenModel();
    m.addScore(20);
    m.tickTimer();
    m.reset();
    expect(m.getScore()).toBe(0);
    expect(m.getTime()).toBe(120);
  });

});