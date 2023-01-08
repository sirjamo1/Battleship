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
                    this.getSecondaryHeatSeeker();
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
    //         * add on more coord to opposite dir so it continues if it hits
    createHeatSeeker(currHit) {
        let heatSeekerArray = [];
        let left = [currHit[0] - 1, currHit[1]];
        let right = [currHit[0] + 1, currHit[1]];
        let down = [currHit[0], currHit[1] + 1];
        let up = [currHit[0], currHit[1] - 1];

        if (this.isCoordEqual(this.prevHit, left) === true) {
            if (this.seekerConditions(right) === true) {
                heatSeekerArray.unshift(right);
            }
            let oppositeDir = this.findOppositeSeeker(currHit, "left", 0);
            if (oppositeDir != null) {
                let oneMoreSquare = [oppositeDir[0] - 1, oppositeDir[1]];
                if (
                    this.seekerConditions(oneMoreSquare) === true &&
                    this.board[oppositeDir[0]][oppositeDir[1]].length > 0
                ) {
                    heatSeekerArray.push(oppositeDir);
                    heatSeekerArray.push(oneMoreSquare);
                } else {
                    heatSeekerArray.push(oppositeDir);
                }
            }
        }

        if (this.isCoordEqual(this.prevHit, right) === true) {
            if (this.seekerConditions(left) === true) {
                heatSeekerArray.unshift(left);
            }
            let oppositeDir = this.findOppositeSeeker(currHit, "right", 0);
            if (oppositeDir != null) {
                let oneMoreSquare = [oppositeDir[0] + 1, oppositeDir[1]];
                if (
                    this.seekerConditions(oneMoreSquare) === true &&
                    this.board[oppositeDir[0]][oppositeDir[1]].length > 0
                ) {
                    heatSeekerArray.push(oppositeDir);
                    heatSeekerArray.push(oneMoreSquare);
                } else {
                    heatSeekerArray.push(oppositeDir);
                }
            }
        }

        if (this.isCoordEqual(this.prevHit, up) === true) {
            if (this.seekerConditions(down) === true) {
                heatSeekerArray.unshift(down);
            }
            let oppositeDir = this.findOppositeSeeker(currHit, "up", 0);
            if (oppositeDir != null) {
                let oneMoreSquare = [oppositeDir[0], oppositeDir[1] - 1];
                if (
                    this.seekerConditions(oneMoreSquare) === true &&
                    this.board[oppositeDir[0]][oppositeDir[1]].length > 0
                ) {
                    heatSeekerArray.push(oppositeDir);
                    heatSeekerArray.push(oneMoreSquare);
                } else {
                    heatSeekerArray.push(oppositeDir);
                }
            }
        }

        if (this.isCoordEqual(this.prevHit, down) === true) {
            if (this.seekerConditions(up) === true) {
                heatSeekerArray.unshift(up);
            }
            let oppositeDir = this.findOppositeSeeker(currHit, "down", 0);
            if (oppositeDir != null) {
                let oneMoreSquare = [oppositeDir[0], oppositeDir[1] + 1];
                if (
                    this.seekerConditions(oneMoreSquare) === true &&
                    this.board[oppositeDir[0]][oppositeDir[1]].length > 0
                ) {
                    heatSeekerArray.push(oppositeDir);
                    heatSeekerArray.push(oneMoreSquare);
                } else {
                    heatSeekerArray.push(oppositeDir);
                }
            }
        }
        return heatSeekerArray;
    }
    isCoordEqual(coordA, coordB) {
        if (coordA[0] === coordB[0] && coordA[1] === coordB[1]) return true;
        return false;
    }
    findOppositeSeeker(coord, dir, count) {
        if (
            count >= 5 ||
            coord[0] > 9 ||
            coord[0] < 0 ||
            coord[1] > 9 ||
            coord[2] < 0
        )
            return;
        //if spot is "x" return (wont be first spot because we know it's a ship hit)
        if (this.board[coord[0]][coord[1]] === "x") return;
        //if spot is on board and is  (empty || unhit ship) return that coord
        if (this.seekerConditions(coord) === true) return coord;

        if (dir === "left")
            return this.findOppositeSeeker(
                [coord[0] - 1, coord[1]],
                dir,
                (count += 1)
            );
        if (dir === "right")
            return this.findOppositeSeeker(
                [coord[0] + 1, coord[1]],
                dir,
                (count += 1)
            );
        if (dir === "down")
            return this.findOppositeSeeker(
                [coord[0], coord[1] + 1],
                dir,
                (count += 1)
            );
        if (dir === "up")
            return this.findOppositeSeeker(
                [coord[0], coord[1] - 1],
                dir,
                (count += 1)
            );
    }
    getSecondaryHeatSeeker() {
        this.secondaryHeatSeeker = []
        for (let i = 0; i < this.confirmedHits.length; i += 1) {
            let coordX = this.confirmedHits[i][0];
            let coordY = this.confirmedHits[i][1];
            let left = [coordX - 1, coordY];
            let right = [coordX + 1, coordY];
            let down = [coordX, coordY + 1];
            let up = [coordX, coordY - 1];
            if (this.seekerConditions(left) === true)
                this.secondaryHeatSeeker.push(left);
            if (this.seekerConditions(right) === true)
                this.secondaryHeatSeeker.push(right);
            if (this.seekerConditions(up) === true)
                this.secondaryHeatSeeker.push(up);
            if (this.seekerConditions(down) === true)
                this.secondaryHeatSeeker.push(down);
        }
    }
    clearHeatSeekingList() {
      return this.heatSeekingList = []
    }
    clearSecondaryHeatSeekingList() {
        return this.secondaryHeatSeeker = []
    }
    seekerConditions(coord) {
        if (
            coord[0] < 10 &&
            coord[0] >= 0 &&
            coord[1] < 10 &&
            coord[1] >= 0 &&
            this.board[coord[0]][coord[1]] !== "x" &&
            this.board[coord[0]][coord[1]].slice(-3) !== "HIT"
        )
            return true;
    }
    getCoordArray(coord, dir, shipLength) {
        let coordArray = [];
        for (let i = 0; i < shipLength; i += 1) {
            let x = dir === "x" ? coord[0] + i : coord[0]; // reveresed changed
            let y = dir === "x" ? coord[1] : coord[1] + i;
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
