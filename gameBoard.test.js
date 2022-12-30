import { GameBoard } from "./gameBoard";

const boardTest = new GameBoard();


test("check squares", () => {
expect(boardTest.board.length).toBe(10)
})
test("Adding ship (carrier)(horizontal), and check board for it", () => {
    boardTest.createShip([1, 1], "hor", "carrier");
    expect(boardTest.board[1][1] && boardTest.board[1][5]).toBe("carrier");
});
test("check either side carrier ship === []", () => {
 expect(boardTest.board[1][0] && boardTest.board[1][6]).toStrictEqual([])
})

test("check attackList is empty(before any attacks)", () => {
 expect(boardTest.attackList).toStrictEqual([]);
})
test("check attackList after receiveAttack is run", () => {
 boardTest.receiveAttack([1, 5])
 expect(boardTest.attackList).toStrictEqual([[1, 5]]);
});
test("check attackList after receiveAttack is run again", () => {
    boardTest.receiveAttack([2, 6]);
    expect(boardTest.attackList).toStrictEqual([[1, 5],[2, 6]]);
});
test("check board to see if previous attacks has logged", () => {
    expect(boardTest.board[2][6]).toBe("x");
});

