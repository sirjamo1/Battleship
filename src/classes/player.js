import { GameBoard } from "./gameBoard";

class Player {
    constructor(className) {
        this.playerGameBoard = new GameBoard();
        this.className = className;
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
        if (attackList.length === 0) {
            return this.playerGameBoard.receiveAttack(coord);
        }
        for (let i = 0; i < attackList.length; i += 1) {
            if (
                this.playerGameBoard.isCoordEqual(coord, attackList[i]) === true
            ) {
                return this.randomShot();
            }
        }
        this.playerGameBoard.receiveAttack(coord);
    }
}

export { Player };
