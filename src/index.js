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
import hit from "./assets/sounds/hit.wav";
import miss from "./assets/sounds/miss.wav";
import sunk from "./assets/sounds/sunk.wav";
import deployment from "./assets/sounds/deployment.wav";
import { Player } from "./classes/player";
let playerOne = new Player("player-one");
let playerTwo = new Player("player-two");
let gameStarted = false;
let shipSelection = null;
let shipPlacementDirection = "x";
let audioOn = true;
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
const fireShots = (x, y, player, square) => {
    //playerOne's shot
    if (
        playerTwo.playerGameBoard.board[x][y].slice(-3) === "HIT" ||
        playerTwo.playerGameBoard.board[x][y] === "x"
    )
        return logTextToScreen("Try another square");

    playerTwo.playerGameBoard.receiveAttack([x, y]);
    logTextToScreen(`Player one: ${checkSquare(playerTwo, x, y)}`);
    if (playerTwo.playerGameBoard.shipsLeft === 0)
        return logTextToScreen("Player One Won!");
    if (player.playerGameBoard.board[x][y] === "x") {
        square.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
    } else {
        square.style.backgroundColor = "rgba(255, 0, 0, 0.7)";
    }
    const playerTwoBoard = document.getElementById("player-two-board");
    playerTwoBoard.style.pointerEvents = "none";
    //playerTwo's shot
    setTimeout(() => {
        if (playerOne.playerGameBoard.heatSeekingList.length > 0) {
            const heatSeekingCoord =
                playerOne.playerGameBoard.heatSeekingList.shift();
            playerOne.playerGameBoard.receiveAttack(heatSeekingCoord);
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
            playerOne.playerGameBoard.receiveAttack(secondaryHeatSeeker);
            logTextToScreen(
                `Player Two: ${checkSquare(
                    playerOne,
                    secondaryHeatSeeker[0],
                    secondaryHeatSeeker[1]
                )}`
            );
        } else {
            playerOne.randomShot();
            const list = playerOne.playerGameBoard.attackList;
            const index = list.length - 1;
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
        playerOne.playerGameBoard.board[playerTwoShot[0]][playerTwoShot[1]] ===
        "x"
            ? (playerOneSquare.style.backgroundColor =
                  "rgba(255, 255, 255, 0.6)")
            : (playerOneSquare.style.backgroundColor = "rgba(255, 0, 0, 0.7)");
        if (playerOne.playerGameBoard.shipsLeft === 0)
            return logTextToScreen("Player Two Won!");
        playerTwoBoard.style.pointerEvents = "all";
    }, 1700);
};
const checkSquare = (player, x, y) => {
    const str = player.playerGameBoard.board[x][y];
    const firstWord = str.substring(0, str.indexOf(" "));
    let message = "";
    player.playerGameBoard.ships.forEach((ship) => {
        if (ship.name == firstWord && ship.sunk === true) {
            if (audioOn) sunkSound.play();
            message += `Hit! <br> ${
                firstWord[0].toUpperCase() + firstWord.slice(1)
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
    if (str === "x") {
        if (audioOn) missSound.play();
        return `MISSED!`;
    }
    if (str.slice(-3) === "HIT") {
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
                    imageDiv.style.opacity = "0";
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
