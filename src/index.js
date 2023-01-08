import _ from "lodash";
import "./style.css";
//import Icon from './assets/icons/allShips.png'
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
import { Player } from "./classes/player";
let playerOne = new Player("player-one");
let playerTwo = new Player("player-two");
let gameStarted = false;
let shipSelection = null;
let shipPlacementDirection = "x";
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

//let playerOneTurn = false

//NEED TO DO
//          * End the game
//          *
//          *
//          *
//          *
//          *
//          *move log

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
                    return logToText("Friendly Fire!!");
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
        return logToText("Please place all ships on the board");
    playerOne.playerGameBoard.createShip(
        [x, y],
        shipPlacementDirection,
        shipSelection
    );
    putShipOnboard(playerOne);
    removeShipOption(shipSelection);
};
const fireShots = (x, y, player, square) => {
    if (
        playerTwo.playerGameBoard.board[x][y].slice(-3) === "HIT" ||
        playerTwo.playerGameBoard.board[x][y] === "x"
    )
        return logToText("Try another square");
    //playerOne's shot
    playerTwo.playerGameBoard.receiveAttack([x, y]);
    logToText(`Player one: ${checkSquare(playerTwo, x, y)}`);
    if (playerTwo.playerGameBoard.shipsLeft === 0)
        return logToText("Player One Won!");
    if (player.playerGameBoard.board[x][y] === "x") {
        square.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
    } else {
        square.style.backgroundColor = "rgba(255, 0, 0, 0.7)";
        //  console.log(player.playerGameBoard.board[x][y]);
        //(square.childNodes[0].style.opacity = "1");
    }

    //playerTwo's shot
    setTimeout(() => {
        // playerOne.playerGameBoard.secondaryHeatSeeker =
        //     playerOne.playerGameBoard.getSecondaryHeatSeeker();
        // if heat seekers are available
        if (playerOne.playerGameBoard.heatSeekingList.length > 0) {
            let heatSeekingCoord =
                playerOne.playerGameBoard.heatSeekingList.shift();
            playerOne.playerGameBoard.receiveAttack(heatSeekingCoord);
            console.log("heat seeker ran", heatSeekingCoord);
            logToText(
                `Player Two: ${checkSquare(
                    playerOne,
                    heatSeekingCoord[0],
                    heatSeekingCoord[1]
                )}`
            );

            // if secondary heat seekers are available
        } else if (playerOne.playerGameBoard.secondaryHeatSeeker.length > 0) {
            // playerOne.playerGameBoard.secondaryHeatSeeker =
            //     playerOne.playerGameBoard.getSecondaryHeatSeeker();

            let secondaryHeatSeeker =
                playerOne.playerGameBoard.secondaryHeatSeeker.pop();
            // console.log(secondaryHeatSeeker, "sec heat");
            playerOne.playerGameBoard.receiveAttack(secondaryHeatSeeker);
            console.log(" second heat seeker ran", secondaryHeatSeeker);
            logToText(
                `Player Two: ${checkSquare(
                    playerOne,
                    secondaryHeatSeeker[0],
                    secondaryHeatSeeker[1]
                )}`
            );
            // take a random shot
        } else {
            playerOne.randomShot();
            console.log("random shot ran");
            //console.log(playerOne);
            let list = playerOne.playerGameBoard.attackList;
            let index = list.length - 1;
            // checkSquare(playerOne, list[index][0], list[index][1]);
            logToText(
                `Player Two: ${checkSquare(
                    playerOne,
                    list[index][0],
                    list[index][1]
                )}`
            );
        }
        // get where shot hit
        let playerTwoShot =
            playerOne.playerGameBoard.attackList[
                playerOne.playerGameBoard.attackList.length - 1
            ];
        // get corresponding div
        let playerOneSquare = document.getElementById(
            `player-one-${playerTwoShot[0]}${playerTwoShot[1]}`
        );
        // change div background color
        playerOne.playerGameBoard.board[playerTwoShot[0]][playerTwoShot[1]] ===
        "x"
            ? (playerOneSquare.style.backgroundColor =
                  "rgba(255, 255, 255, 0.6)")
            : (playerOneSquare.style.backgroundColor = "rgba(255, 0, 0, 0.7)");
        if (playerOne.playerGameBoard.shipsLeft === 0)
            return logToText("Player Two Won!");
    }, 1400);
};
const checkSquare = (player, x, y) => {
    const str = player.playerGameBoard.board[x][y];
    const firstWord = str.substring(0, str.indexOf(" "));
    let message = "";
    player.playerGameBoard.ships.forEach((ship) => {
        if (ship.name == firstWord && ship.sunk === true) {
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
    if (str === "x") return `MISSED!`;
    if (str.slice(-3) === "HIT") return `HIT!`;
};
const logToText = (message) => {
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

const shipPlacement = () => {
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
            if (shipPlacementDirection === "y") {
                shipIcons[i].style.transform = "rotate(90deg)";
            } else {
                shipIcons[i].style.transform = "rotate(0deg)";
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
        removeShipOption("battleship");
        removeShipOption("cruiser");
        removeShipOption("submarine");
        removeShipOption("destroyer");
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
function component() {
    const mainContainer = document.createElement("div");
    mainContainer.id = "main-container";
    mainContainer.appendChild(createTitle());
    const playerOneContainer = document.createElement("div");
    playerOneContainer.id = "player-one-container";
    playerOneContainer.appendChild(createPlayerBoard("player-one", playerOne));
    mainContainer.appendChild(playerOneContainer);
    const playerTwoContainer = document.createElement("div");
    playerTwoContainer.id = "player-two-container";
    playerTwoContainer.appendChild(createPlayerBoard("player-two", playerTwo));
    mainContainer.appendChild(playerTwoContainer);
    mainContainer.appendChild(shipPlacement());

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
    mainContainer.replaceChild(shipPlacement(), shipPlacementContainer);
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
    let element = document.getElementById(`${ship}-option`);
    if (element.parentElement === shipContainer) {
        console.log(ship);
        shipContainer.removeChild(element);
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
            logToText("Player one fire!");
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
        console.log("do nothing");
    };
};
document.body.appendChild(component());
