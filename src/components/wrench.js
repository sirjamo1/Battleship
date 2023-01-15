import repair from "../assets/sounds/repair.wav";
import { logTextToScreen } from "./textLog";
import { playerTwosShot } from "./playerShots";
const repairSound = new Audio(repair);
const wrenchConditions = (player) => {
    const wrenchIcon = document.getElementById(`${player.className}-wrench`);
    if (player.isWrenchReady() === true) {
        wrenchIcon.style.animation = "blink 1.5s linear 0s infinite normal";
        wrenchIcon.style.background = `conic-gradient(rgb(120, 247, 51) 360deg, red 0deg)`;
        if (wrenchIcon.id === "player-one-wrench") {
            wrenchIcon.style.cursor = "pointer";
            wrenchIcon.ondragstart = () => {};
        }
    } else {
        wrenchIcon.style.background = `conic-gradient(rgb(120, 247, 51) ${player.wrench}deg, red 0deg)`;
    }
};
const resetWrenchButton = (player) => {

    const wrenchIcon = document.getElementById(`${player.className}-wrench`);
    wrenchIcon.style.removeProperty("animation");
    wrenchIcon.style.background = `conic-gradient(rgb(120, 247, 51) 0deg, red 0deg)`;
};
const repairShip = (x, y, playerToRepair, audioOn, playerOne, playerTwo) => {
    const square = playerToRepair.board[x][y];
    const shipName = square.value;
    if (shipName === null) return logTextToScreen("No ship found...", audioOn);
    if (audioOn) repairSound.play();
    const playerTextName =
        playerToRepair.className === "player-one" ? "Player one" : "Player two";
    logTextToScreen(`${playerTextName}: Used repair`, audioOn);
    let coordArray = null;
    playerToRepair.ships.forEach((ship) => {
        if (shipName === ship.name) {
            if (ship.sunk === true) {
                ship.sunk = false;
                playerToRepair.shipsLeft += 1;
            }
            coordArray = ship.shipCoord;
            ship.hitCount = 0;
        }
    });

    let attackList = playerToRepair.attackList;
    let hitSquaresWithShips = playerToRepair.hitSquaresWithShips;
    coordArray.forEach((coord) => {
        for (let i = 0; i < attackList.length; i += 1) {
            if (
                coord[0] === attackList[i][0] &&
                coord[1] === attackList[i][1]
            ) {
                attackList.splice(i, 1);
            }
        }
        for (let i = 0; i < hitSquaresWithShips.length; i += 1) {
            if (
                coord[0] === hitSquaresWithShips[i][0] &&
                coord[1] === hitSquaresWithShips[i][1]
            ) {
                hitSquaresWithShips.splice(i, 1);
            }
        }
        let boardSquare = playerToRepair.board[coord[0]][coord[1]];
        if (boardSquare.isHit === true) {
            playerToRepair.remainingShipCoords.push([coord[0], coord[1]]);
            boardSquare.isHit = false
        }
        let displaySquare = document.getElementById(
                `${playerToRepair.className}-${coord[0]}${coord[1]}`)
                displaySquare.style.removeProperty("background-color");
                if (playerToRepair.className === "player-two") {
                    displaySquare.childNodes[0].style.opacity = "0";
                }
    });
    resetWrenchButton(playerToRepair);
    playerToRepair.resetWrench();
    if (playerToRepair.className === "player-one")
        return setTimeout(
            () => playerTwosShot(playerTwo, playerToRepair, audioOn),
            3000
        );
};
export { wrenchConditions, resetWrenchButton, repairShip };
