import { GameBoard } from "./gameBoard";

class Player {
    constructor(playerTurn = false) {
        this.playerGameBoard = new GameBoard();
        this.playerTurn = playerTurn;
    }
    populateBoard() {
        this.playerGameBoard.createShip([0, 1], "x", "carrier");
        this.playerGameBoard.createShip([2, 1], "y", "battleship");
        this.playerGameBoard.createShip([3, 4], "x", "cruiser");
        this.playerGameBoard.createShip([7, 6], "y", "submarine");
        this.playerGameBoard.createShip([8, 1], "x", "destroyer");
    }
}

export { Player };
