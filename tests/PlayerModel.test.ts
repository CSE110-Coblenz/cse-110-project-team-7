import { Player } from "../src/models/PlayerModel"

describe("PlayerModel Class", () => {
    test("initializes with max health and score 0", () => {
        const p = new Player("Test");
        expect(p.get_health()).toBe(5);
        expect(p.get_score()).toBe(0);
        expect(p.name).toBe("Test");
    });

    test("reset_health sets health back to MAX_HEALTH", () => {
        const p = new Player();
        p.take_damage(3);
        expect(p.get_health()).toBe(2);

        p.reset_health();
        expect(p.get_health()).toBe(5);
    });

    test("is_alive returns true when health > 0", () => {
        const p = new Player();
        expect(p.is_alive()).toBe(true);

        p.take_damage(5);
        expect(p.is_alive()).toBe(false);
    });

    test("take_damage reduces health correctly", () => {
        const p = new Player();
        p.take_damage(2);
        expect(p.get_health()).toBe(3);
    });

    test("increase_score adds to score and returns new score", () => {
        const p = new Player();
        const newScore = p.increase_score(10);

        expect(newScore).toBe(10);
        expect(p.get_score()).toBe(10);
    });

    test("decrease_score subtracts from score but not below 0", () => {
        const p = new Player();
        p.increase_score(10);

        let newScore = p.decrease_score(4);
        expect(newScore).toBe(6);

        newScore = p.decrease_score(20);
        expect(newScore).toBe(0); // should clamp
        expect(p.get_score()).toBe(0);
    });

    test("get_score returns the current score", () => {
        const p = new Player();
        p.increase_score(7);
        expect(p.get_score()).toBe(7);
    });
});
