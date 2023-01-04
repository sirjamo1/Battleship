import { Ship } from "./ships";
const boardSize = 10;
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
        this.shipsNotDeployed = 5;
        this.attackList = attackList;
        this.heatSeekingList = [];
        this.secondaryHeatSeeker = [];
        this.prevHit = [];
        this.confirmedHits = [];
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
        const ship = new Ship(this.shipList[shipName].length, shipName, dir);
        ship.shipCoord = coordArray;
        this.ships.push(ship);
        coordArray.forEach((square) => {
            this.board[square[0]][square[1]] = shipName;
        });
        this.shipList[shipName].quantity -= 1;
        this.shipsNotDeployed -= 1;
    }
    receiveAttack(coord) {
        //this.secondaryHeatSeeker = this.getSecondaryHeatSeeker();
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
                    this.prevHit.push(coord);
                    this.confirmedHits.push(coord);
                    this.heatSeekingList = this.createHeatSeeker(coord);
                    if (this.ships[i].isSunk() === true) {
                        this.shipsLeft -= 1;
                        this.prevHit = coord;
                        if (this.shipsLeft === 0) {
                            return `${this.shipsLeft} GAME OVER`;
                        }
                    }
                    this.prevHit = coord;
                }
            }
        }
    }
    //things:
    //         *
    //         *
    createHeatSeeker(currHit) {
        let heatSeekerArray = [];
        let left = [currHit[0] - 1, currHit[1]];
        let right = [currHit[0] + 1, currHit[1]];
        let down = [currHit[0], currHit[1] + 1];
        let up = [currHit[0], currHit[1] - 1];
        if (this.seekerConditions(right) === true) {
            this.prevHit[0] === left[0] && this.prevHit[1] === left[1]
                ? heatSeekerArray.unshift(right)
                : heatSeekerArray.push(right);
        }
        if (this.seekerConditions(left) === true) {
            this.prevHit[0] === right[0] && this.prevHit[1] === right[1]
                ? heatSeekerArray.unshift(left)
                : heatSeekerArray.push(left);
        }
        if (this.seekerConditions(down) === true) {
            this.prevHit[0] === up[0] && this.prevHit[1] === up[1]
                ? heatSeekerArray.unshift(down)
                : heatSeekerArray.push(down);
        }
        if (this.seekerConditions(up) === true) {
            this.prevHit[0] === down[0] && this.prevHit[1] === down[1]
                ? heatSeekerArray.unshift(up)
                : heatSeekerArray.push(up);
        }
        // if (
        //     this.prevHit[0] === left[0] &&
        //     this.prevHit[1] === left[1] &&
        //     this.seekerConditions(right) === true
        // ) {
        //     heatSeekerArray.unshift(right);
        // } else if (this.seekerConditions(right) === true) {
        //     heatSeekerArray.push(right);
        // }
        // if (
        //     this.prevHit[0] === right[0] &&
        //     this.prevHit[1] === right[1] &&
        //     this.seekerConditions(left) === true
        // ) {
        //     heatSeekerArray.unshift(left);
        // } else if (this.seekerConditions(left) === true) {
        //     heatSeekerArray.push(left);
        // }
        // if (
        //     this.prevHit[0] === up[0] &&
        //     this.prevHit[1] === up[1] &&
        //     this.seekerConditions(down) === true
        // ) {
        //     heatSeekerArray.unshift(down);
        // } else if (this.seekerConditions(down) === true) {
        //     heatSeekerArray.push(down);
        // }
        // if (
        //     this.prevHit[0] === down[0] &&
        //     this.prevHit[1] === down[1] &&
        //     this.seekerConditions(up)
        // ) {
        //     heatSeekerArray.unshift(up);
        // } else if (this.seekerConditions(up) === true) {
        //     heatSeekerArray.push(up);
        // }
        return heatSeekerArray;
    }

    getSecondaryHeatSeeker() {
        let secondaryHeatSeeker = [];
        for (let i = 0; i < this.confirmedHits.length; i += 1) {
            let coordX = this.confirmedHits[i][0];
            let coordY = this.confirmedHits[i][1];
            let left = [coordX - 1, coordY];
            let right = [coordX + 1, coordY];
            let down = [coordX, coordY + 1];
            let up = [coordX, coordY - 1];
            if (this.seekerConditions(left) === true)
                secondaryHeatSeeker.push(left);
            if (this.seekerConditions(right) === true)
                secondaryHeatSeeker.push(right);
            if (this.seekerConditions(up) === true)
                secondaryHeatSeeker.push(up);
            if (this.seekerConditions(down) === true)
                secondaryHeatSeeker.push(down);
        }
        return secondaryHeatSeeker;
    }
    seekerConditions(direction) {
        if (
            direction[0] < 10 &&
            direction[0] >= 0 &&
            direction[1] < 10 &&
            direction[1] >= 0 &&
            this.board[direction[0]][direction[1]] !== "x" &&
            this.board[direction[0]][direction[1]].slice(-3) !== "HIT"
        )
            return true;
    }
    getCoordArray(coord, dir, shipLength) {
        let coordArray = [];
        for (let i = 0; i < shipLength; i += 1) {
            let x = dir === "x" ? coord[0] : coord[0] + i;
            let y = dir === "x" ? coord[1] + i : coord[1];
            if (y > 9 || y < 0 || x > 9 || x < 0) {
                return "Ship must be placed on board";
            } else if (this.board[x][y].length !== 0) {
                return `${this.board[x][y]} occupies this space`;
            } else {
                coordArray.push([x, y]);
            }
        }
        return coordArray;
    }
}

export { GameBoard };
