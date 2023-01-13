import _ from "lodash";
import "./style.css";
import battleship from "./assets/icons/battleship.png";
import battleshipRotated from "./assets/icons/battleshipRotated.png";
import carrier from "./assets/icons/carrier.png";
import carrierRotated from "./assets/icons/carrierRotated.png";
import cruiser from "./assets/icons/cruiser.png";
import cruiserRotated from "./assets/icons/cruiserRotated.png";
import destroyer from "./assets/icons/destroyer.png";
import destroyerRotated from "./assets/icons/destroyerRotated.png";
import submarine from "./assets/icons/submarine.png";
import submarineRotated from "./assets/icons/submarineRotated.png";
import audio from "./assets/icons/audio.png";
import wrench from "./assets/icons/wrench.png";
import hit from "./assets/sounds/hit.wav";
import miss from "./assets/sounds/miss.wav";
import sunk from "./assets/sounds/sunk.wav";
import deployment from "./assets/sounds/deployment.wav";
import sonar from "./assets/sounds/sonar.wav";
import { Player } from "./classes/player";
// import {Square, square} from "./classes/square"
// let testSquare = new Square(0,5)
// console.log(testSquare)

let playerOne = new Player("player-one");
console.log(playerOne);
let playerTwo = new Player("player-two");
let gameStarted = false;
let shipSelection = null;
let playerToRepair = null;
let shipPlacementDirection = "x";
let audioOn = false; /////////////////////////////changed this
const carrierShipRotated = new Image();
carrierShipRotated.src = carrierRotated;
const destroyerShipRotated = new Image();
destroyerShipRotated.src = destroyerRotated;
const battleshipShipRotated = new Image();
battleshipShipRotated.src = battleshipRotated;
const submarineShipRotated = new Image();
submarineShipRotated.src = submarineRotated;
const cruiserShipRotated = new Image();
cruiserShipRotated.src = cruiserRotated;
const deploymentSound = new Audio(deployment);
const hitSound = new Audio(hit);
const missSound = new Audio(miss);
const sunkSound = new Audio(sunk);
const sonarSound = new Audio(sonar);

const createPlayerBoard = (playerName, player) => {
    const board = document.createElement("div");
    board.id = `${playerName}-board`;
    for (let i = 0; i < player.playerGameBoard.board.length; i += 1) {
        const row = document.createElement("div");
        row.classList = "rows";
        for (let j = 0; j < player.playerGameBoard.board[i].length; j += 1) {
            const square = document.createElement("div");
            square.id = `${playerName}-${j}${i}`;
            square.classList = "squares";
            if (player === playerOne) {
                square.ondrop = (e) => {
                    drop(e, j, i);
                };
                square.ondragover = (e) => {
                    allowDrop(e);
                };
            }
            square.onclick = () => {
                console.log(square.id);
                if (gameStarted === false) return isGameReadyToStart(j, i);
                if (playerName === "player-one")
                    return logTextToScreen("Friendly Fire!!");
                fireShots(j, i, player, square);
            };
            row.appendChild(square);
        }
        board.appendChild(row);
    }
    if (player === playerOne) {
        const dragShipText = document.createElement("h2");
        dragShipText.id = "drag-ship-text";
        dragShipText.innerHTML = "Drag ships here";
        board.appendChild(dragShipText);
    }
    return board;
};

const isGameReadyToStart = (x, y) => {
    if (shipSelection === null)
        return logTextToScreen("Please place all ships on the board");
    playerOne.playerGameBoard.createShip(
        [x, y],
        shipPlacementDirection,
        shipSelection
    );
    putShipOnboard(playerOne);
    removeShipOption(shipSelection);
};

const sonarConditions = (player) => {
    let sonarId =
        player.className === "player-one"
            ? "player-two-sonar"
            : "player-one-sonar";
    const sonarContainer = document.getElementById(sonarId);
    if (player.playerGameBoard.isSonarReady() === true) {
        sonarContainer.style.background = "rgb(120, 247, 51)";
        sonarContainer.style.animation = "blink 1.5s linear 0s infinite normal";
        sonarContainer.innerHTML = "SONAR READY";
        if (sonarContainer.id === "player-one-sonar") {
            sonarContainer.style.cursor = "pointer";
            sonarContainer.onclick = () => {
                sonarAnimation(player);
                logTextToScreen(`Player One: Used Sonar`);
                player.playerGameBoard.resetSonar();
                resetSonarButton(player);
                // sonarContainer.style.removeProperty("animation");
                sonarContainer.style.background = `linear-gradient(90deg, rgb(120, 247, 51) ${player.playerGameBoard.sonar}%, #000000 0%)`;
            };
        }
    } else {
        sonarContainer.style.background = `linear-gradient(90deg, rgb(120, 247, 51) ${player.playerGameBoard.sonar}%, #000000 0%)`;
    }
};
const wrenchConditions = (player) => {
    // let wrenchId =
    //     player.className === "player-one"
    //         ? "player-two-wrench"
    //         : "player-one-wrench";
    const wrenchContainer = document.getElementById(
        `${player.className}-wrench`
    );
    if (player.playerGameBoard.isWrenchReady() === true) {
        wrenchContainer.style.animation =
            "blink 1.5s linear 0s infinite normal";
        wrenchContainer.style.background = `conic-gradient(rgb(120, 247, 51) 360deg, red 0deg)`;
        if (wrenchContainer.id === "player-one-wrench") {
            wrenchContainer.style.cursor = "pointer";
            wrenchContainer.onclick = () => {
                playerToRepair = playerOne;
            };
            wrenchContainer.ondragstart = () => {
                playerToRepair = playerOne;
            };
        }
    } else {
        wrenchContainer.style.background = `conic-gradient(rgb(120, 247, 51) ${player.playerGameBoard.wrench}deg, red 0deg)`;
    }
};
const resetWrenchButton = (player) => {
    let wrenchId =
        player.className === "player-one"
            ? "player-two-wrench"
            : "player-one-wrench";
    const wrenchContainer = document.getElementById(wrenchId);
    wrenchContainer.style.removeProperty("animation");
    wrenchContainer.style.background = `conic-gradient(rgb(120, 247, 51) 0deg, red 0deg)`;
};
const resetSonarButton = (player) => {
    let sonarId =
        player.className === "player-one"
            ? "player-two-sonar"
            : "player-one-sonar";
    const sonarContainer = document.getElementById(sonarId);
    sonarContainer.style.removeProperty("animation");
    sonarContainer.innerHTML = "SONAR CHARGING";
};
const wrenchAnimation = (player) => {
    const wrenchContainer = document.getElementById(
        `${player.className}-wrench`
    );
    // style.background = `conic-gradient(rgb(120, 247, 51) ${wrench num here}deg, red 0deg)`;
};
const repairShip = (x, y) => {
    console.log(playerToRepair, x, y);
    let shipName = null;
    let coordArray = null;
    // let squareFullStr = playerToRepair.playerGameBoard.board[x][y];
    playerToRepair.playerGameBoard.ships.forEach((ship) => {
        ship.shipCoord.forEach((coord) => {
            if (coord[0] === x && coord[1] === y) {
                if (ship.isSunk === true) {
                    ship.sunk = false;
                    playerToRepair.playerGameBoard.shipsLeft += 1;
                }
                shipName = ship.name;
                coordArray = ship.shipCoord;

                ship.hitCount = 0;
                console.log(ship, "coord match");
            }
        });
    });
    console.log(coordArray, "<--coord array");
    //console.log(playerToRepair.playerGameBoard.attackList, "<--attack list")
    coordArray.forEach((coord) => {
        let square = document.getElementById(
            `${playerToRepair.className}-${coord[0]}${coord[1]}`
        );
        square.style.removeProperty("background-color");
        console.log(square);
    });

    // const boardToReset = document.getElementById(
    //     `${playerToRepair.className}-board`
    // );
    console.log(shipName, "<--shipName");
    // console.log(boardToReset);
};
const sonarAnimation = (player) => {
    if (audioOn) sonarSound.play();
    const playerTwoShipCoords = player.playerGameBoard.remainingShipCoords;
    let playerBoard = document.getElementById(`${player.className}-board`);
    playerBoard.childNodes.forEach((row) => {
        row.style.animation = "sonarBoardFlash 1.1s linear 0s  normal";
    });
    if (player.className == "player-two") {
        playerTwoShipCoords.forEach((coord) => {
            document.getElementById(
                `${player.className}-${coord[0]}${coord[1]}`
            ).childNodes[0].style.animation =
                "sonarShipFlash 1.1s linear 0s  normal";
        });
    }
    setTimeout(() => {
        playerBoard.childNodes.forEach((row) => {
            row.style.removeProperty("animation");
        });
        if (player.className == "player-two") {
            playerTwoShipCoords.forEach((coord) => {
                document
                    .getElementById(
                        `${player.className}-${coord[0]}${coord[1]}`
                    )
                    .childNodes[0].style.removeProperty("animation");
            });
        }
    }, 1100);
};

const fireShots = (x, y, player, square) => {
    //playerOne's shot
    if (playerTwo.playerGameBoard.board[x][y].isHit === true)
        return logTextToScreen("Try another square");
    // if (
    //     playerTwo.playerGameBoard.board[x][y].slice(-3) === "HIT" ||
    //     playerTwo.playerGameBoard.board[x][y] === "x"
    // )
    //     return logTextToScreen("Try another square");

    playerTwo.playerGameBoard.receiveAttack([x, y]);
    logTextToScreen(`Player one: ${checkSquare(playerTwo, x, y)}`);
    if (playerTwo.playerGameBoard.shipsLeft === 0)
        return logTextToScreen("Player One Won!");
    if (player.playerGameBoard.board[x][y].value === null) {
        square.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
    } else {
        square.style.backgroundColor = "rgba(255, 0, 0, 0.7)";
    }
    const playerTwoBoard = document.getElementById("player-two-board");
    playerTwoBoard.style.pointerEvents = "none";
    sonarConditions(playerTwo);
    wrenchConditions(playerOne);
    //playerTwo's shot
    setTimeout(() => {
        if (playerOne.playerGameBoard.heatSeekingList.length > 0) {
            const heatSeekingCoord =
                playerOne.playerGameBoard.heatSeekingList.shift();
            playerOne.playerGameBoard.receiveAttack(heatSeekingCoord);
            console.log(
                "if heat true",
                playerOne.playerGameBoard.heatSeekingList,
                heatSeekingCoord
            );
            logTextToScreen(
                `Player Two: ${checkSquare(
                    playerOne,
                    heatSeekingCoord[0],
                    heatSeekingCoord[1]
                )}`
            );
        } else if (playerOne.playerGameBoard.secondaryHeatSeeker.length > 0) {
            const secondaryHeatSeeker =
                playerOne.playerGameBoard.secondaryHeatSeeker.pop();
            console.log(
                "if sec == true",
                playerOne.playerGameBoard.secondaryHeatSeeker,
                secondaryHeatSeeker
            );
            playerOne.playerGameBoard.receiveAttack(secondaryHeatSeeker);
            logTextToScreen(
                `Player Two: ${checkSquare(
                    playerOne,
                    secondaryHeatSeeker[0],
                    secondaryHeatSeeker[1]
                )}`
            );
        } else if (playerOne.playerGameBoard.isSonarReady() === true) {
            sonarAnimation(playerOne);
            playerOne.playerGameBoard.resetSonar();
            resetSonarButton(playerOne);
            const randomNum = Math.floor(
                Math.random() *
                    playerOne.playerGameBoard.remainingShipCoords.length
            );
            const sonarCoord =
                playerOne.playerGameBoard.remainingShipCoords[randomNum];
            playerOne.playerGameBoard.receiveAttack(sonarCoord);
            console.log("if sonar true", sonarCoord);
            logTextToScreen(
                `Player Two: Used Sonar <br> ${checkSquare(
                    playerOne,
                    sonarCoord[0],
                    sonarCoord[1]
                )}`
            );
        } else {
            playerOne.randomShot();

            const list = playerOne.playerGameBoard.attackList;

            const index = list.length - 1;
            console.log(
                "if random",
                playerOne.playerGameBoard.attackList,
                index
            );
            logTextToScreen(
                `Player Two: ${checkSquare(
                    playerOne,
                    list[index][0],
                    list[index][1]
                )}`
            );
        }
        const playerTwoShot =
            playerOne.playerGameBoard.attackList[
                playerOne.playerGameBoard.attackList.length - 1
            ];
        const playerOneSquare = document.getElementById(
            `player-one-${playerTwoShot[0]}${playerTwoShot[1]}`
        );
        playerOne.playerGameBoard.board[playerTwoShot[0]][playerTwoShot[1]]
            .value === null
            ? (playerOneSquare.style.backgroundColor =
                  "rgba(255, 255, 255, 0.6)")
            : (playerOneSquare.style.backgroundColor = "rgba(255, 0, 0, 0.7)");
        sonarConditions(playerOne);
        wrenchConditions(playerTwo);
        if (playerOne.playerGameBoard.shipsLeft === 0)
            return logTextToScreen("Player Two Won!");
        playerTwoBoard.style.pointerEvents = "all";
    }, 1700);
};
const checkSquare = (player, x, y) => {
    const square = player.playerGameBoard.board[x][y];
    const str = player.playerGameBoard.board[x][y];
    // const firstWord = str.substring(0, str.indexOf(" "));
    let shipName = square.value;
    let message = "";
    player.playerGameBoard.ships.forEach((ship) => {
        if (ship.name == shipName && ship.sunk === true) {
            if (audioOn) sunkSound.play();
            message += `Hit! <br> ${
                shipName[0].toUpperCase() + shipName.slice(1)
            } has been sunk!`;
            ship.shipCoord.forEach((coord) => {
                let square = document.getElementById(
                    `${player.className}-${coord[0]}${coord[1]}`
                );
                square.childNodes[0].style.opacity = "1";
            });
            player.playerGameBoard.clearHeatSeekingList();
            player.playerGameBoard.clearSecondaryHeatSeekingList();
        }
    });
    if (message.length > 0) return message;
    if (square.value === null) {
        if (audioOn) missSound.play();
        return `MISSED!`;
    }
    if (square.value !== null) {
        if (audioOn) hitSound.play();
        return `HIT!`;
    }
};
const logTextToScreen = (message) => {
    document.getElementById("log-text").innerHTML = message;
};
const createShipDiv = (shipName, shipImageName) => {
    const shipImage = new Image();
    shipImage.src = shipImageName;
    shipImage.alt = shipName;
    shipImage.draggable = true;
    shipImage.ondragstart = (e) => {
        removeDragShipsHereText();
        shipSelection = shipName;
        if (shipPlacementDirection === "y") {
            if (shipName === "carrier")
                e.dataTransfer.setDragImage(carrierShipRotated, 10, 10);
            if (shipName === "battleship")
                e.dataTransfer.setDragImage(battleshipShipRotated, 10, 10);
            if (shipName === "cruiser")
                e.dataTransfer.setDragImage(cruiserShipRotated, 10, 10);
            if (shipName === "submarine")
                e.dataTransfer.setDragImage(submarineShipRotated, 10, 10);
            if (shipName === "destroyer")
                e.dataTransfer.setDragImage(destroyerShipRotated, 10, 10);
        } else {
            e.dataTransfer.setDragImage(shipImage, 10, 10);
        }
    };
    shipImage.id = `${shipName}-option`;
    shipImage.onclick = () => {
        shipSelection = shipName;
        removeDragShipsHereText();
    };
    return shipImage;
};
const removeDragShipsHereText = () => {
    let playerOneBoard = document.getElementById("player-one-board");
    let text = document.getElementById("drag-ship-text");
    if (text !== null) playerOneBoard.removeChild(text);
};
const allowDrop = (e) => {
    e.preventDefault();
};
const drop = (e, x, y) => {
    e.preventDefault();
    if (gameStarted === false) {
        playerOne.playerGameBoard.createShip(
            [x, y],
            shipPlacementDirection,
            shipSelection
        );
        putShipOnboard(playerOne);
        playerOne.playerGameBoard.ships.forEach((ship) => {
            if (ship.name === shipSelection) {
                removeShipOption(shipSelection);
            }
        });
    }
    if (gameStarted === true) {
        repairShip(x, y);
    }
};

const createShipPlacementContainer = () => {
    const placementContainer = document.createElement("div");
    placementContainer.id = "ship-placement-container";
    const directionButton = document.createElement("button");
    directionButton.id = "direction-button";
    directionButton.innerHTML = shipPlacementDirection;
    directionButton.onclick = () => {
        shipPlacementDirection = shipPlacementDirection === "x" ? "y" : "x";
        directionButton.innerHTML = shipPlacementDirection;
        let shipIcons = document.getElementsByTagName("img");
        for (let i = 0; i < shipIcons.length; i += 1) {
            if (shipIcons[i].parentElement === shipContainer) {
                if (shipPlacementDirection === "y") {
                    shipIcons[i].style.transform = "rotate(90deg)";
                } else {
                    shipIcons[i].style.transform = "rotate(0deg)";
                }
            }
        }
    };
    const randomPlacement = document.createElement("button");
    randomPlacement.id = "random-placement-button";
    randomPlacement.innerHTML = "Random placement";
    randomPlacement.onclick = () => {
        playerOne.populateBoard();
        removeDragShipsHereText();
        putShipOnboard(playerOne);
        removeShipOption("carrier");
    };
    const shipContainer = document.createElement("div");
    shipContainer.id = "ship-container";
    placementContainer.appendChild(randomPlacement);
    placementContainer.appendChild(directionButton);
    placementContainer.appendChild(shipContainer);
    shipContainer.appendChild(createShipDiv("carrier", carrier));
    shipContainer.appendChild(createShipDiv("battleship", battleship));
    shipContainer.appendChild(createShipDiv("destroyer", destroyer));
    shipContainer.appendChild(createShipDiv("cruiser", cruiser));
    shipContainer.appendChild(createShipDiv("submarine", submarine));

    return placementContainer;
};
const createTitle = () => {
    const title = document.createElement("h1");
    title.id = "title";
    title.innerHTML = "BATTLESHIPS";
    return title;
};
const createAudioButton = () => {
    const audioButton = new Image();
    audioButton.src = audio;
    audioButton.id = "audio-button";
    audioButton.onclick = () => {
        audioOn = !audioOn;
        audioButton.style.backgroundColor =
            audioOn === false ? "rgba(255, 0, 0, 0.6" : "rgba(0, 128, 0, 0.6)";
    };
    return audioButton;
};

function component() {
    const mainContainer = document.createElement("div");
    mainContainer.id = "main-container";
    mainContainer.appendChild(createTitle());
    mainContainer.appendChild(createAudioButton());
    const playerOneContainer = document.createElement("div");
    playerOneContainer.id = "player-one-container";
    playerOneContainer.appendChild(createPlayerBoard("player-one", playerOne));
    mainContainer.appendChild(playerOneContainer);
    const playerTwoContainer = document.createElement("div");
    playerTwoContainer.id = "player-two-container";
    playerTwoContainer.appendChild(createPlayerBoard("player-two", playerTwo));
    mainContainer.appendChild(playerTwoContainer);
    mainContainer.appendChild(createShipPlacementContainer());

    return mainContainer;
}

const putShipOnboard = (player) => {
    for (let i = 0; i < player.playerGameBoard.ships.length; i += 1) {
        let num = 0;
        player.playerGameBoard.ships[i].shipCoord.forEach((coord) => {
            let shipName = player.playerGameBoard.ships[i].name;
            let dir = player.playerGameBoard.ships[i].direction;
            let square = document.getElementById(
                `${player.className}-${coord[0]}${coord[1]}`
            );
            const imageDiv = document.createElement("div");
            imageDiv.classList.add(`${shipName}-sprite-${num}`);
            if (square.childNodes.length === 0) {
                square.appendChild(imageDiv);
                num += 1;
                if (player.className === "player-two") {
                    imageDiv.style.opacity = ".7";     /////NEED TO CHANGE BACK TO 0
                }
                if (dir === "y") {
                    imageDiv.style.transform = "rotate(90deg)";
                }
            }
        });
    }
};
const resetGame = () => {
    playerOne = new Player("player-one");
    playerTwo = new Player("player-two");
    gameStarted = false;
    shipSelection = null;
    shipPlacementDirection = "x";
    let mainContainer = document.getElementById("main-container");
    let playerOneContainer = document.getElementById("player-one-container");
    let playerTwoContainer = document.getElementById("player-two-container");
    let shipPlacementContainer = document.getElementById(
        "ship-placement-container"
    );
    let playerOneBoard = document.getElementById("player-one-board");
    let playerTwoBoard = document.getElementById("player-two-board");
    playerOneContainer.replaceChild(
        createPlayerBoard("player-one", playerOne),
        playerOneBoard
    );
    playerTwoContainer.replaceChild(
        createPlayerBoard("player-two", playerTwo),
        playerTwoBoard
    );
    mainContainer.replaceChild(
        createShipPlacementContainer(),
        shipPlacementContainer
    );
    if (mainContainer.contains(document.getElementById("start-button"))) {
        mainContainer.removeChild(document.getElementById("start-button"));
    }
};

const CreateMoveLogContainer = () => {
    const logTextContainer = document.createElement("div");
    const playerOneSonar = document.createElement("div");
    playerOneSonar.id = "player-one-sonar";
    playerOneSonar.innerHTML = "SONAR CHARGING";
    logTextContainer.appendChild(playerOneSonar);
    const playerOneWrench = new Image();
    playerOneWrench.src = wrench;
    playerOneWrench.id = "player-one-wrench";
    logTextContainer.appendChild(playerOneWrench);
    const playerTwoSonar = document.createElement("div");
    playerTwoSonar.id = "player-two-sonar";
    playerTwoSonar.innerHTML = "SONAR CHARGING";
    logTextContainer.appendChild(playerTwoSonar);
    const playerTwoWrench = new Image();
    playerTwoWrench.src = wrench;
    playerTwoWrench.id = "player-two-wrench";
    logTextContainer.appendChild(playerTwoWrench);
    logTextContainer.id = "log-text-container";
    const logText = document.createElement("h3");
    logText.id = "log-text";
    logText.innerHTML = "Click Start to Play";
    logTextContainer.appendChild(logText);
    return logTextContainer;
};
const removeShipOption = (ship) => {
    let mainContainer = document.getElementById("main-container");
    let shipPlacementContainer = document.getElementById(
        "ship-placement-container"
    );
    let shipContainer = document.getElementById("ship-container");
    let shipOption = document.getElementById(`${ship}-option`);
    if (shipOption?.parentElement) {
        if (shipOption.parentElement === shipContainer) {
            shipContainer.removeChild(shipOption);
            if (audioOn) deploymentSound.play();
        }
    }
    if (playerOne.playerGameBoard.shipsNotDeployed <= 0) {
        const resetButton = document.createElement("button");
        resetButton.id = "reset-button";
        resetButton.innerHTML = "Reset";
        resetButton.onclick = () => {
            resetGame();
        };
        const startButton = document.createElement("button");
        startButton.id = "start-button";
        startButton.innerHTML = "Start";
        startButton.onclick = () => {
            gameStarted = true;
            mainContainer.removeChild(startButton);
            playerTwo.populateBoard();
            putShipOnboard(playerTwo);
            disablePlayerOneBoardClick();
            logTextToScreen("Player one fire!");
        };
        mainContainer.appendChild(startButton);
        shipPlacementContainer.replaceChild(
            CreateMoveLogContainer(),
            shipContainer
        );
        shipPlacementContainer.replaceChild(
            resetButton,
            document.getElementById("random-placement-button")
        );
        shipPlacementContainer.removeChild(
            document.getElementById("direction-button")
        );
    }
};
const disablePlayerOneBoardClick = () => {
    const playerBoard = document.getElementById("player-one-board");
    playerBoard.onclick = (e) => {
        e.stopPropagation();
    };
};
document.body.appendChild(component());
