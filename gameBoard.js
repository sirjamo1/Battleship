import { Ship } from "./ships";
const boardSize = 10;
//NEED TO:
// *make sure when adding ships they don't
//      * overlap
//      * duplicate ships (only 1 of each)
//      * go of board when creating
//      * register when hit
//      *
class GameBoard {
    constructor(attackList = []) {
        this.board = [];
        this.shipList = {
            carrier: {
                length: 5,
                quantity: 1,
            },
            battleship: {
                length: 4,
                quantity: 1,
            },
            cruiser: {
                length: 3,
                quantity: 1,
            },
            submarine: {
                length: 3,
                quantity: 1,
            },
            destroyer: {
                length: 2,
                quantity: 1,
            },
        };

        this.attackList = attackList;
        this.createBoard();
    }

    createBoard() {
        for (let i = 0; i < boardSize; i += 1) {
            this.board[i] = [];
            for (let j = 0; j < boardSize; j += 1) {
                this.board[i][j] = [];
            }
        }
    }
    createShip(coord, dir, shipName) {
        const ship = new Ship(this.shipList[shipName].length);
        let coordArray = this.getCoordArray(coord, dir, ship.length);
        let largestShipLength = 5;
        if (coordArray.length > largestShipLength) return coordArray;
        ship.shipCoord = coordArray;
        coordArray.forEach((square) => {
            this.board[square[0]][square[1]] = shipName;
        });
    }
    receiveAttack(coord) {
        this.board[coord[0]][coord[1]] = "x";
        return this.attackList.push(coord);
    }
    getCoordArray(coord, dir, shipLength) {
        let coordArray = [];
        for (let i = 0; i < shipLength; i += 1) {
            let y = dir === "x" ? coord[0] : coord[0] + i;
            let x = dir === "x" ? coord[1] + i : coord[1];
            if (this.board[y][x].length !== 0) {
                return `${this.board[y][x]} occupies this space`;
            } else if (y > 9 && y < 0 && x > 9 && x < 0) {
                return console.log("Ship must be placed on board");
            } else {
                coordArray.push([y, x]);
            }
        }
        return coordArray;
    }
}

export { GameBoard };
