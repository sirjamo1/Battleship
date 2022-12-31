import { Ship } from "./ships";
const boardSize = 10;
//NEED TO:
// *make sure when adding ships they don't
//      *
//      *
//      *
//      * 
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
        this.ships = [];
        this.shipsLeft = 5;
        this.shipsNotDeployed = 5
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
        if (this.shipList[shipName].quantity <= 0) {
            return `${shipName} is already on the board`;
        }
        let coordArray = this.getCoordArray(
            coord,
            dir,
            this.shipList[shipName].length
        );
        let largestShipLength = 5;
        if (coordArray.length > largestShipLength) return coordArray;
        const ship = new Ship(this.shipList[shipName].length, shipName);
        ship.shipCoord = coordArray;
        this.ships.push(ship);
        coordArray.forEach((square) => {
            this.board[square[0]][square[1]] = shipName;
        });
        this.shipList[shipName].quantity -= 1;
        this.shipsNotDeployed -= 1;
    }
    receiveAttack(coord) {
        if (this.board[coord[0]][coord[1]].length === 0) {
            this.board[coord[0]][coord[1]] = "x";
            return this.attackList.push(coord);
        } else if (this.board[coord[0]][coord[1]] === "x") {
            return `${coord} has already been tried`;
        } else if (this.board[coord[0]][coord[1]].slice(-3) === "HIT") {
            let shipStrLength = this.board[coord[0]][coord[1]].length;
            return `${this.board[coord[0]][coord[1]].slice(
                0,
                shipStrLength - 4
            )} has already been hit`;
        } else {
            for (let i = 0; i < this.ships.length; i += 1) {
                if (this.ships[i].name === this.board[coord[0]][coord[1]]) {
                    this.ships[i].hit();
                    this.board[coord[0]][coord[1]] += " HIT";
                    this.attackList.push(coord);
                    if (this.ships[i].isSunk() === true) {
                        this.shipsLeft -= 1;
                        if (this.shipsLeft === 0) {
                            return `${this.shipsLeft} GAME OVER`;
                        }
                    }
                }
            }
        }
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
