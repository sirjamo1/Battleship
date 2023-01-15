import { logTextToScreen } from "./textLog";
import { resetSonarButton, sonarAnimation, sonarConditions } from "./sonar";
import { wrenchConditions, repairShip } from "./wrench";
import { checkSquare } from "./checkSquare";

const disableBoardClick = (board) => {
    board.style.pointerEvents = "none";
};
const enableBoardClick = (board) => {
    board.style.pointerEvents = "all";
};
const playerOnesShot = (
    playerOne,
    x,
    y,
    player,
    square,
    playerTwo,
    audioOn
) => {
    if (playerTwo.board[x][y].isHit === true)
        return logTextToScreen("Try another square", audioOn);
    playerTwo.receiveAttack([x, y]);
    logTextToScreen(
        `Player one: ${checkSquare(playerTwo, x, y, audioOn)}`,
        audioOn
    );
    if (playerTwo.shipsLeft === 0)
        return logTextToScreen("Player One Won!", audioOn);
    if (player.board[x][y].value === null) {
        square.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
    } else {
        square.style.backgroundColor = "rgba(255, 0, 0, 0.7)";
    }
    const playerTwoBoard = document.getElementById("player-two-board");
    disableBoardClick(playerTwoBoard);
    setTimeout(() => enableBoardClick(playerTwoBoard), 6000);
    playerOne.addToSonar(20);
    playerOne.addToWrench(30);
    sonarConditions(playerOne, audioOn, playerTwo);
    wrenchConditions(playerOne, audioOn);
};

const playerTwosShot = (playerTwo, playerOne, audioOn) => {
    let hitSquares = playerTwo.hitSquaresWithShips;
    if (playerTwo.isWrenchReady() === true && hitSquares.length > 0) {
        let randomIndex = Math.floor(Math.random() * hitSquares.length);
        repairShip(
            hitSquares[randomIndex][0],
            hitSquares[randomIndex][1],
            playerTwo,
            audioOn,
            playerOne,
            playerTwo
        );
    } else if (playerOne.heatSeekingList.length > 0) {
        const heatSeekingCoord = playerOne.heatSeekingList.shift();
        playerOne.receiveAttack(heatSeekingCoord);
        logTextToScreen(
            `Player Two: ${checkSquare(
                playerOne,
                heatSeekingCoord[0],
                heatSeekingCoord[1],
                audioOn
            )}`,
            audioOn
        );
    } else if (playerOne.secondaryHeatSeeker.length > 0) {
        const secondaryHeatSeeker = playerOne.secondaryHeatSeeker.pop();
        playerOne.receiveAttack(secondaryHeatSeeker);
        logTextToScreen(
            `Player Two: ${checkSquare(
                playerOne,
                secondaryHeatSeeker[0],
                secondaryHeatSeeker[1],
                audioOn
            )}`,
            audioOn
        );
    } else if (playerTwo.isSonarReady() === true) {
        sonarAnimation(playerTwo, audioOn, playerTwo);
        playerTwo.resetSonar();
        resetSonarButton(playerTwo);
        const randomNum = Math.floor(
            Math.random() * playerOne.remainingShipCoords.length
        );
        const sonarCoord = playerOne.remainingShipCoords[randomNum];
        playerOne.receiveAttack(sonarCoord);
        logTextToScreen(`Player Two: Used Sonar HIT!`, audioOn);
    } else {
        playerOne.randomShot();
        const list = playerOne.attackList;
        const index = list.length - 1;
        logTextToScreen(
            `Player Two: ${checkSquare(
                playerOne,
                list[index][0],
                list[index][1],
                audioOn
            )}`,
            audioOn
        );
    }
    const playerTwoShot = playerOne.attackList[playerOne.attackList.length - 1];
    const playerOneSquare = document.getElementById(
        `player-one-${playerTwoShot[0]}${playerTwoShot[1]}`
    );
    playerOne.board[playerTwoShot[0]][playerTwoShot[1]].value === null
        ? (playerOneSquare.style.backgroundColor = "rgba(255, 255, 255, 0.6)")
        : (playerOneSquare.style.backgroundColor = "rgba(255, 0, 0, 0.7)");
    playerTwo.addToSonar(20);
    playerTwo.addToWrench(30);
    sonarConditions(playerTwo, audioOn, playerTwo);
    wrenchConditions(playerTwo, audioOn);
    if (playerOne.shipsLeft === 0)
        return logTextToScreen("Player Two Won!", audioOn);
};

export { playerOnesShot, playerTwosShot };
