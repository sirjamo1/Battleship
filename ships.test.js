import { Ship } from "./ships";
const shipTest = new Ship(2);
test("check ships length", () => {
    expect(shipTest.length).toBe(2);
});
test("check ships hit count", () => {
    expect(shipTest.hitCount).toBe(0);
});
test("check ships hit count after been hit", () => {
    shipTest.hit();
    expect(shipTest.hitCount).toBe(1);
});

test("check if ship is sunk", () => {
    expect(shipTest.isSunk()).toBe(false);
});
test("check ships length", () => {
    shipTest.hit();
    expect(shipTest.hitCount).toBe(2);
});
test("check if ship is sunk", () => {
    expect(shipTest.isSunk()).toBe(true);
});
