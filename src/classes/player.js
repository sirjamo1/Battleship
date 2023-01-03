import { GameBoard } from "./gameBoard";
//NEED TO:
//       *
class Player {
    constructor(playerTurn = false) {
        this.playerGameBoard = new GameBoard();
        this.playerTurn = playerTurn;
    }
    populateBoard() {
        this.playerGameBoard.createShip(
            this.randomCoord(),
            this.randomOrientation(),
            "carrier"
        );
        this.playerGameBoard.createShip(
            this.randomCoord(),
            this.randomOrientation(),
            "battleship"
        );
        this.playerGameBoard.createShip(
            this.randomCoord(),
            this.randomOrientation(),
            "cruiser"
        );
        this.playerGameBoard.createShip(
            this.randomCoord(),
            this.randomOrientation(),
            "submarine"
        );
        this.playerGameBoard.createShip(
            this.randomCoord(),
            this.randomOrientation(),
            "destroyer"
        );
        while (this.playerGameBoard.shipsNotDeployed !== 0) {
            this.populateBoard();
        }
    }
    randomCoord() {
        return [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
    }
    randomOrientation() {
        return Math.round(Math.random()) === 0 ? "x" : "y";
    }
    randomShot() {
        let coord = this.randomCoord();
        let attackList = this.playerGameBoard.attackList;
        if (attackList.length === 0)
            return this.playerGameBoard.receiveAttack(coord);
        for (let i = 0; i < attackList.length; i += 1) {
            if (coord === attackList[i]) {
                return this.randomShot();
            }
        }
        this.playerGameBoard.receiveAttack(coord);
    }
}

export {  Player };

