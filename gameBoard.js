import { Ship } from "./ships";
const boardSize = 10;
//NEED TO:
// *make sure when adding ships they don't
//      * 
//      * 
//      * 
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
        if (this.shipList[shipName].quantity <= 0)
            return `${shipName} is already on the board`;
        const ship = new Ship(this.shipList[shipName].length);
        let coordArray = this.getCoordArray(coord, dir, ship.length);
        let largestShipLength = 5;
        if (coordArray.length > largestShipLength) return coordArray;
        ship.shipCoord = coordArray;
        coordArray.forEach((square) => {
            this.board[square[0]][square[1]] = shipName;
        });
        this.shipList[shipName].quantity -= 1;
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
            if (y > 9 || y < 0 || x > 9 || x < 0) {
                return "Ship must be placed on board";
            } else if (this.board[y][x].length !== 0) {
                return `${this.board[y][x]} occupies this space`;
            } else {
                coordArray.push([y, x]);
            }
        }
        return coordArray;
    }
}

export { GameBoard };
