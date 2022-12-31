import { GameBoard } from "./gameBoard";

class Player {
    constructor(playerTurn = false) {
        this.playerGameBoard = new GameBoard();
        this.playerTurn = playerTurn;
    }
    populateBoard() {
        this.playerGameBoard.createShip(this.randomCoord(), "x", "carrier");
        this.playerGameBoard.createShip(this.randomCoord(), "y", "battleship");
        this.playerGameBoard.createShip(this.randomCoord(), "x", "cruiser");
        this.playerGameBoard.createShip(this.randomCoord(), "y", "submarine");
        this.playerGameBoard.createShip(this.randomCoord(), "x", "destroyer");
        while(this.playerGameBoard.shipsNotDeployed !== 0) {
         this.populateBoard()
        }
    }
    randomCoord() {
     return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
    }
}

export { Player };




//  populateBoard() {
    //     this.playerGameBoard.createShip(
    //         [0, 1],
    //         "x",
    //         Object.keys(this.playerGameBoard.shipList)[0]
    //     );
    //     this.playerGameBoard.createShip(
    //         [2, 1],
    //         "y",
    //         Object.keys(this.playerGameBoard.shipList)[1]
    //     );
    //     this.playerGameBoard.createShip(
    //         [4, 1],
    //         "x",
    //         Object.keys(this.playerGameBoard.shipList)[2]
    //     );
    //     this.playerGameBoard.createShip(
    //         [7, 6],
    //         "y",
    //         Object.keys(this.playerGameBoard.shipList)[3]
    //     );
    //     this.playerGameBoard.createShip(
    //         [8, 1],
    //         "x",
    //         Object.keys(this.playerGameBoard.shipList)[4]
    //     );
    // }
