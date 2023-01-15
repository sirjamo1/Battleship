import { Square } from "../classes/square";

test("all", () => {
    const testSquare = new Square(6, 9);
    expect(testSquare.x).toBe(6);
    expect(testSquare.y).toBe(9);
    expect(testSquare.isHit).toBe(false);
    expect(testSquare.value).toBe(null);
});
