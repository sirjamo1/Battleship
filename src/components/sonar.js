import sonar from "../assets/sounds/sonar.wav";
import { logTextToScreen } from "./textLog";
const sonarSound = new Audio(sonar);

const sonarAnimation = (player, audioOn, playerTwo) => {
    let playerBoardId =
        player.className === "player-one"
            ? "player-two-board"
            : "player-one-board";
    if (audioOn) sonarSound.play();
    const playerTwoShipCoords = playerTwo.remainingShipCoords;
    let playerBoard = document.getElementById(playerBoardId);
    playerBoard.childNodes.forEach((row) => {
        row.style.animation = "sonarBoardFlash 1.1s linear 0s  normal";
    });
    if (player.className === "player-one") {
        playerTwoShipCoords.forEach((coord) => {
            document.getElementById(
                `player-two-${coord[0]}${coord[1]}`
            ).childNodes[0].style.animation =
                "sonarShipFlash 1.1s linear 0s  normal";
        });
    }
    setTimeout(() => {
        playerBoard.childNodes.forEach((row) => {
            row.style.removeProperty("animation");
        });
        if (player.className == "player-one") {
            playerTwoShipCoords.forEach((coord) => {
                document
                    .getElementById(`player-two-${coord[0]}${coord[1]}`)
                    .childNodes[0].style.removeProperty("animation");
            });
        }
    }, 1100);
};
const resetSonarButton = (player) => {
    const sonarContainer = document.getElementById(`${player.className}-sonar`);
    sonarContainer.style.removeProperty("animation");
    sonarContainer.innerHTML = "SONAR CHARGING";
};
const sonarConditions = (player, audioOn, playerTwo) => {
    const sonarContainer = document.getElementById(`${player.className}-sonar`);
    if (player.isSonarReady() === true) {
        sonarContainer.style.background = "rgb(120, 247, 51)";
        sonarContainer.style.animation = "blink 1.5s linear 0s infinite normal";
        sonarContainer.innerHTML = "SONAR READY";
        if (sonarContainer.id === "player-one-sonar") {
            sonarContainer.style.cursor = "pointer";
            sonarContainer.onclick = () => {
                sonarAnimation(player, audioOn, playerTwo);
                logTextToScreen(`Player One: Used Sonar`, audioOn);
                player.resetSonar();
                resetSonarButton(player);
                sonarContainer.style.background = `linear-gradient(90deg, rgb(120, 247, 51) ${player.sonar}%, #000000 0%)`;
            };
        }
    } else {
        sonarContainer.style.background = `linear-gradient(90deg, rgb(120, 247, 51) ${player.sonar}%, #000000 0%)`;
    }
};

export { sonarAnimation, resetSonarButton, sonarConditions };
