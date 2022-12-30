import { Ship } from "./ships";
const boardSize = 10;
class GameBoard {
    constructor(attackList = []) {
        this.board = [];
        this.shipList = {
            carrier: {
                length: 5,
            },
            battleship: {
                length: 4,
            },
            cruiser: {
                length: 3,
            },
            submarine: {
                length: 3,
            },
            destroyer: {
                length: 2,
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
    createShip(coord, dir, type) {
        const ship = new Ship(this.shipList[type].length);
        if (dir === "hor") {
            for (let i = 0; i < ship.length; i += 1) {   
             ship.shipCoord.push([coord[0], coord[1] + i]);      
                this.board[coord[0]][coord[1] + i] = type;
                
            }
        } else if (dir === "ver") {
            for (let i = 0; i < ship.length; i += 1){
             ship.shipCoord.push([coord[0] + i, coord[1]]); 
             this.board[coord[0] + i][coord[1]] = type;
        }
       }
        console.log(ship)
    }
    receiveAttack(coord) {
        this.board[coord[0]][coord[1]] = "x";
        return this.attackList.push(coord);
    }
}

export { GameBoard };
