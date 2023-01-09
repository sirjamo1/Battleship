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
        this.remainingShipCoords = [];
        this.sonar = 0;
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
            this.remainingShipCoords.push(square);
            this.board[square[0]][square[1]] = shipName;
        });
        this.shipList[shipName].quantity -= 1;
        this.shipsNotDeployed -= 1;
    }
    addToSonar(num) {
        if (this.sonar < 100) this.sonar += num;
    }
    resetSonar() {
        this.sonar = 0
    }
    isSonarReady() {
        return this.sonar >= 100 ? true : false;
    }
    sonarAttack() {
        
    }
    receiveAttack(coord) {
        if (this.board[coord[0]][coord[1]].length === 0) {
            this.board[coord[0]][coord[1]] = "x";
            this.addToSonar(50);
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
            this.addToSonar(50);
            console.log(coord, this.remainingShipCoords);
            for (let i = 0; i < this.remainingShipCoords.length; i += 1) {
                if (
                    this.isCoordEqual(coord, this.remainingShipCoords[i]) ===
                    true
                ) {
                    this.remainingShipCoords.splice(i, 1);
                }
            }
            for (let i = 0; i < this.ships.length; i += 1) {
                if (this.ships[i].name === this.board[coord[0]][coord[1]]) {
                    this.ships[i].hit();
                    this.board[coord[0]][coord[1]] += " HIT";
                    this.attackList.push(coord);
                    this.prevHit.push(coord);
                    this.heatSeekingList = this.createHeatSeeker(coord);
                    this.getSecondaryHeatSeeker(coord);
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
    loadSeekersToArray = (array, currHit, dir, oppositeDirStr) => {
        if (this.seekerConditions(dir) === true) {
            array.unshift(dir);
        }
        let oppositeDir = this.findOppositeSeeker(currHit, oppositeDirStr, 0);
        if (oppositeDir != null) {
            let oneMoreSquare = [oppositeDir[0] - 1, oppositeDir[1]];
            if (
                this.seekerConditions(oneMoreSquare) === true &&
                this.board[oppositeDir[0]][oppositeDir[1]].length > 0
            ) {
                array.push(oppositeDir);
                array.push(oneMoreSquare);
            } else {
                array.push(oppositeDir);
            }
        }
    };
    createHeatSeeker(currHit) {
        let heatSeekerArray = [];
        let left = [currHit[0] - 1, currHit[1]];
        let right = [currHit[0] + 1, currHit[1]];
        let down = [currHit[0], currHit[1] + 1];
        let up = [currHit[0], currHit[1] - 1];
        if (this.isCoordEqual(this.prevHit, left) === true) {
            this.loadSeekersToArray(heatSeekerArray, currHit, right, "left");
        }
        if (this.isCoordEqual(this.prevHit, right) === true) {
            this.loadSeekersToArray(heatSeekerArray, currHit, left, "right");
        }
        if (this.isCoordEqual(this.prevHit, up) === true) {
            this.loadSeekersToArray(heatSeekerArray, currHit, down, "up");
        }
        if (this.isCoordEqual(this.prevHit, down) === true) {
            this.loadSeekersToArray(heatSeekerArray, currHit, up, "down");
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
        if (this.board[coord[0]][coord[1]] === "x") return;
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
    getSecondaryHeatSeeker(coord) {
        this.secondaryHeatSeeker = [];
        let left = [coord[0] - 1, coord[1]];
        let right = [coord[0] + 1, coord[1]];
        let down = [coord[0], coord[1] + 1];
        let up = [coord[0], coord[1] - 1];
        if (this.seekerConditions(left) === true)
            this.secondaryHeatSeeker.push(left);
        if (this.seekerConditions(right) === true)
            this.secondaryHeatSeeker.push(right);
        if (this.seekerConditions(up) === true)
            this.secondaryHeatSeeker.push(up);
        if (this.seekerConditions(down) === true)
            this.secondaryHeatSeeker.push(down);
    }
    clearHeatSeekingList() {
        return (this.heatSeekingList = []);
    }
    clearSecondaryHeatSeekingList() {
        return (this.secondaryHeatSeeker = []);
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
            let x = dir === "x" ? coord[0] + i : coord[0];
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