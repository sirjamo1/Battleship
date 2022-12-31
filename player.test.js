import { Player } from "./player";
const player1 = new Player();

test("check player turn === false", () => {
 expect(player1.playerTurn).toBe(false)
});
test("check length of gameBoard", () => {
 expect(player1.playerGameBoard.board.length).toBe(10);
})
test("check placement of ships", () => {
 player1.populateBoard()
 console.log(player1.playerGameBoard.board)
})
