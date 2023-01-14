import { Ship } from "./ships";
import { Square } from "./square";
const boardSize = 10;
class GameBoard {
    constructor(className) {
        this.board = [];
        this.className = className
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
        this.shipsNotDeployed = 5;
        this.attackList = [];
        this.heatSeekingList = [];
        this.secondaryHeatSeeker = [];
        this.prevHit = [];
        this.hitSquaresWithShips = [];
        this.remainingShipCoords = [];
        this.sonar = 0;
        this.wrench = 0;
        this.createBoard();
        this.assignBoardSquareDirections();
    }
    createBoard() {
        for (let x = 0; x < boardSize; x += 1) {
            this.board[x] = [];
            for (let y = 0; y < boardSize; y += 1) {
                this.board[x][y] = new Square(x, y);
            }
        }
    }
    assignBoardSquareDirections() {
        for (let x = 0; x < boardSize; x += 1) {
            for (let y = 0; y < boardSize; y += 1) {
                this.board[x][y].left =
                    x - 1 <= 9 && x - 1 >= 0 ? this.board[x - 1][y] : null;
                this.board[x][y].right =
                    x + 1 <= 9 && x + 1 >= 0 ? this.board[x + 1][y] : null;
                this.board[x][y].up =
                    y - 1 <= 9 && y - 1 >= 0 ? this.board[x][y - 1] : null;
                this.board[x][y].down =
                    y + 1 <= 9 && y + 1 >= 0 ? this.board[x][y + 1] : null;
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
        const ship = new Ship(this.shipList[shipName].length, shipName, dir);
        ship.shipCoord = coordArray;
        this.ships.push(ship);
        coordArray.forEach((square) => {
            this.remainingShipCoords.push(square);
            this.board[square[0]][square[1]].value = shipName;
        });
        this.shipList[shipName].quantity -= 1;
        this.shipsNotDeployed -= 1;
    }
//////////////////////////////added in below
    populateBoard() {
        this.createShip(
            this.randomCoord(),
            this.randomOrientation(),
            "carrier"
        );
        this.createShip(
            this.randomCoord(),
            this.randomOrientation(),
            "battleship"
        );
        this.createShip(
            this.randomCoord(),
            this.randomOrientation(),
            "cruiser"
        );
        this.createShip(
            this.randomCoord(),
            this.randomOrientation(),
            "submarine"
        );
        this.createShip(
            this.randomCoord(),
            this.randomOrientation(),
            "destroyer"
        );
        while (this.shipsNotDeployed !== 0) {
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
        let attackList = this.attackList;
        if (attackList.length === 0) {
            return this.receiveAttack(coord);
        }
        for (let i = 0; i < attackList.length; i += 1) {
            if (
                this.isCoordEqual(coord, attackList[i]) === true
            ) {
                return this.randomShot();
            }
        }
        this.receiveAttack(coord);
    }
//////////////////////added in above
    addToSonar(num) {
        if (this.sonar < 100) this.sonar += num;
    }
    addToWrench(num) {
        if (this.wrench < 360) this.wrench += num;
    }
    resetSonar() {
        this.sonar = 0;
    }
    resetWrench() {
        this.wrench = 0;
    }
    isSonarReady() {
        return this.sonar >= 100 ? true : false;
    }
    isWrenchReady() {
        return this.wrench >= 360 ? true : false;
    }
    receiveAttack(coord) {
        if (this.board[coord[0]][coord[1]].isHit === true) {
            return `${coord} has already been tried`;
        }
        if (
            this.board[coord[0]][coord[1]].isHit === false &&
            this.board[coord[0]][coord[1]].value === null
        ) {
            this.board[coord[0]][coord[1]].isHit = true;

            this.attackList.push(coord);
        } else {
            this.board[coord[0]][coord[1]].isHit = true;
            this.attackList.push(coord);
            this.hitSquaresWithShips.push(coord);
            this.createHeatSeeker(coord);
            this.getSecondaryHeatSeeker(coord);
            for (let i = 0; i < this.remainingShipCoords.length; i += 1) {
                if (
                    this.isCoordEqual(coord, this.remainingShipCoords[i]) ===
                    true
                ) {
                    this.remainingShipCoords.splice(i, 1);
                }
            }
            for (let i = 0; i < this.ships.length; i += 1) {
                if (
                    this.ships[i].name === this.board[coord[0]][coord[1]].value
                ) {
                    this.ships[i].hit();
                    this.board[coord[0]][coord[1]].isHit = true;
                    if (this.ships[i].isSunk() === true) {
                        this.shipsLeft -= 1;
                        this.prevHit = [];
                        if (this.shipsLeft === 0) {
                            return `${this.shipsLeft} GAME OVER`;
                        }
                    }
                    this.prevHit = coord;
                }
            }
        }
    }

    createHeatSeeker(coord) {
        let square = this.board[coord[0]][coord[1]];
        if (square.left !== null) {
            if (
                this.prevHit[0] === square.left.x &&
                this.prevHit[1] === square.left.y
            ) {
                this.loadSeekersToArray(square, square.right, "left");
            }
        }
        if (square.right !== null) {
            if (
                this.prevHit[0] === square.right.x &&
                this.prevHit[1] === square.right.y
            ) {
                this.loadSeekersToArray(square, square.left, "right");
            }
        }
        if (square.up !== null) {
            if (
                this.prevHit[0] === square.up.x &&
                this.prevHit[1] === square.up.y
            ) {
                this.loadSeekersToArray(square, square.down, "up");
            }
        }
        if (square.down !== null) {
            if (
                this.prevHit[0] === square.down.x &&
                this.prevHit[1] === square.down.y
            ) {
                this.loadSeekersToArray(square, square.up, "down");
            }
        }
    }

    loadSeekersToArray = (square, targetSquare, oppositeDirStr) => {
        if (targetSquare !== null && targetSquare.isHit === false) {
            this.heatSeekingList.unshift([targetSquare.x, targetSquare.y]);
        }
        let oppositeDir = this.findOppositeSeeker(square, oppositeDirStr, 0);
        if (oppositeDir !== null) {
            this.heatSeekingList.push([oppositeDir.x, oppositeDir.y]);
            let oneMoreSquare = this.findOppositeSeeker(
                oppositeDir,
                oppositeDirStr,
                -1
            );
            if (oneMoreSquare !== null) {
                this.heatSeekingList.push([oneMoreSquare.x, oneMoreSquare.y]);
            }
        }
    };
    findOppositeSeeker(square, direction, count) {
        if (count >= 5 || square === null) return null;
        if (square.isHit === false && count >= 0) {
            return square;
        }
        if (direction === "left") {
            return this.findOppositeSeeker(
                square.left,
                direction,
                (count += 1)
            );
        }
        if (direction === "right") {
            return this.findOppositeSeeker(
                square.right,
                direction,
                (count += 1)
            );
        }
        if (direction === "up") {
            return this.findOppositeSeeker(square.up, direction, (count += 1));
        }
        if (direction === "down") {
            return this.findOppositeSeeker(
                square.down,
                direction,
                (count += 1)
            );
        }
    }
    isCoordEqual(coordA, coordB) {
        if (coordA[0] === coordB[0] && coordA[1] === coordB[1]) return true;
        return false;
    }
    getSecondaryHeatSeeker(coord) {
        this.secondaryHeatSeeker = [];
        const square = this.board[coord[0]][coord[1]];
        if (square.left !== null && square.left.isHit === false) {
            this.secondaryHeatSeeker.push([square.left.x, square.left.y]);
        }
        if (square.right !== null && square.right.isHit === false) {
            this.secondaryHeatSeeker.push([square.right.x, square.right.y]);
        }
        if (square.up !== null && square.up.isHit === false) {
            this.secondaryHeatSeeker.push([square.up.x, square.up.y]);
        }
        if (square.down !== null && square.down.isHit === false) {
            this.secondaryHeatSeeker.push([square.down.x, square.down.y]);
        }
    }
    clearHeatSeekingList() {
        return (this.heatSeekingList = []);
    }
    clearSecondaryHeatSeekingList() {
        return (this.secondaryHeatSeeker = []);
    }
    getCoordArray(coord, dir, shipLength) {
        let coordArray = [];
        for (let i = 0; i < shipLength; i += 1) {
            let x = dir === "x" ? coord[0] + i : coord[0];
            let y = dir === "x" ? coord[1] : coord[1] + i;
            if (y > 9 || y < 0 || x > 9 || x < 0) {
                return "Ship must be placed on board";
            } else if (this.board[x][y].value !== null) {
                return `${this.board[x][y].value} occupies this space`;
            } else {
                coordArray.push([x, y]);
            }
        }
        return coordArray;
    }
}

export { GameBoard };


