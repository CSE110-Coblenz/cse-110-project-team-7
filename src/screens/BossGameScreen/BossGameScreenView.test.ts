import { BossGameScreenView } from "./BossGameScreenView";
import { Tile } from "./Tile";
import Konva from "konva";

// Mock Tile for testing purposes
jest.mock("./Tile", () => {
  return {
    Tile: jest.fn().mockImplementation((_: string, x: number, y: number, size: number) => ({
      getNode: () => ({
        on: jest.fn(),
        destroy: jest.fn(),
        getClientRect: jest.fn().mockReturnValue({ x, y, width: size, height: size }),
      }),
    })),
  };
});

describe("BossGameScreenView", () => {
  let view: BossGameScreenView;

  beforeEach(() => {
    view = new BossGameScreenView();
  });

  test("should create a group and UI elements", () => {
    expect(view.getGroup()).toBeInstanceOf(Konva.Group);
    expect(view["scoreText"]).toBeInstanceOf(Konva.Text);
    expect(view["timerText"]).toBeInstanceOf(Konva.Text);
    expect(view["bossNumber"]).toBeInstanceOf(Konva.Text);
    expect(view["entryBox"]).toBeInstanceOf(Konva.Rect);
    expect(view["inventory"]).toBeInstanceOf(Konva.Rect);
    expect(view["entryEquationText"]).toBeInstanceOf(Konva.Text);
  });

  test("updateScore updates the score text", () => {
    view.updateScore(42);
    expect(view["scoreText"].attrs.text).toContain("42");
  });

  test("updateTimer updates the timer text", () => {
    view.updateTimer(99);
    expect(view["timerText"].attrs.text).toContain("99");
  });

  test("updateEquationText updates the entry text", () => {
    view.updateEquationText("3+4");
    expect(view["entryEquationText"].attrs.text).toContain("3+4");
  });

  test("show and hide toggle group visibility", () => {
    view.show();
    expect(view.getGroup().attrs.visible).toBe(true);
    view.hide();
    expect(view.getGroup().attrs.visible).toBe(false);
  });

  test("updateBossNum and getBossNum work correctly", () => {
    view.updateBossNum("7");
    expect(view.getBossNum()).toBe(7);
  });

  test("updatePhaseTiles creates new Tile instances", () => {
    const newParts = ["1", "2", "3"];
    view.updatePhaseTiles(newParts);
    expect(view["tiles"].length).toBe(newParts.length);
    view["tiles"].forEach((_, i) => {
      expect(Tile).toHaveBeenCalledWith(newParts[i], expect.any(Number), expect.any(Number), expect.any(Number));
    });
  });

  test("setOnTileEntry and setOnTileRemoval register callbacks", () => {
    const entryCb = jest.fn();
    const removeCb = jest.fn();

    view.setOnTileEntry(entryCb);
    view.setOnTileRemoval(removeCb);

    expect(view["onTileEntry"]).toBe(entryCb);
    expect(view["onTileRemoval"]).toBe(removeCb);
  });

  test("flashEquationGreen changes text color temporarily", () => {
    jest.useFakeTimers();
    view.flashEquationGreen(100, 2);
    // Fast-forward all timers
    jest.runAllTimers();
    // After flashing, should reset to original
    expect(view["entryEquationText"].fill()).toBe("white");
    jest.useRealTimers();
  });
});
