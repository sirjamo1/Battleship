import { GameBoard } from "./gameBoard";

const boardTest = new GameBoard();

test("check squares", () => {
    expect(boardTest.board.length).toBe(10);
});
test("Adding ship (carrier)(horizontal), and check board for it", () => {
    boardTest.createShip([1, 1], "x", "carrier");
    expect(boardTest.board[1][1] && boardTest.board[1][5]).toBe("carrier");
});
test("Adding duplicate ship (carrier)(horizontal)", () => {
    expect(boardTest.createShip([1, 1], "x", "carrier")).toBe(
        "carrier is already on the board"
    );
});

test("Try adding ship (destroyer) to same space as carrier", () => {
    expect(boardTest.createShip([1, 3], "x", "destroyer")).toBe(
        "carrier occupies this space"
    );
});
test("Try adding ship (destroyer) off the board", () => {
    expect(boardTest.createShip([11, 3], "x", "destroyer")).toBe(
        "Ship must be placed on board"
    );
});
test("adding ship (cruiser) (vertical) and check board for it", () => {
    boardTest.createShip([4, 4], "y", "cruiser");
    expect(boardTest.board[4][4] && boardTest.board[6][4]).toBe("cruiser");
});
test("check either side carrier ship === []", () => {
    expect(boardTest.board[1][0] && boardTest.board[1][6]).toStrictEqual([]);
});

test("check attackList is empty(before any attacks)", () => {
    expect(boardTest.attackList).toStrictEqual([]);
});
test("check attackList after receiveAttack is run", () => {
    boardTest.receiveAttack([3, 5]);
    expect(boardTest.attackList).toStrictEqual([[3, 5]]);
});
test("check attackList after receiveAttack is run again", () => {
    boardTest.receiveAttack([2, 6]);
    expect(boardTest.attackList).toStrictEqual([
        [3, 5],
        [2, 6],
    ]);
});
test("check board to see if previous attacks has logged", () => {
    expect(boardTest.board[2][6]).toBe("x");
});

test("log board", () => {
    console.log(boardTest.board);
});
