import { Player } from "./player";
const player1 = new Player();

test("check player turn === false", () => {
 expect(player1.playerTurn).toBe(false)
});
test("check length of gameBoard", () => {
 expect(player1.playerGameBoard.board.length).toBe(10);
})
test("check placement of ships", () => {
 player1.populateBoard();
 expect(player1.playerGameBoard.shipsNotDeployed).toBe(0)
})
test("random shot check", () => {
 player1.randomShot()
 
       console.log(player1.randomOrientation())
 //console.log(player1.playerGameBoard);
 expect(player1.playerGameBoard.attackList.length).toBe(1)
})
test("check orientation method returns y or x", () => {
 expect(player1.randomOrientation()).toMatch(/^x|y$/);
})
test("console.log board", () => {
 console.log(player1.playerGameBoard.board)
})
