import _ from "lodash";
import "./style.css";
//import Icon from './assets/icons/allShips.png'
import { Player } from "./classes/player";
const playerOne = new Player();
const playerTwo = new Player();
let gameStarted = false;
let shipSelection = null;
let shipPlacementDirection = "x";
//let playerOneTurn = false

//NEED TO DO
//          *stop computer taking turn if clicked square is clicked again
//          *reset button
//          *if computer hits ship, continue trying to hit around it
//          *delay 0.3 sec before computer turn
//          *add ships images over squares
//          *fix x / y placement bug
//          *move ship placement menu to middle of screen (maybe make half red/blue)
//          *title
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
            square.onclick = () => {
                if (gameStarted === false) return isGameReadyToStart(j, i);
                if (playerName === "player-one") return alert("Wrong board");
                fireShots(j, i, player, square);
            };
            row.appendChild(square);
        }
        board.appendChild(row);
    }
    return board;
};
const isGameReadyToStart = (x, y) => {
    if (shipSelection === null) return alert("Please select a ship");
    playerOne.playerGameBoard.createShip(
        [x, y],
        shipPlacementDirection,
        shipSelection
    );
    putShipOnboard();
    removeShipOption(shipSelection);
};
const fireShots = (x, y, player, square) => {
    if (square.style.backgroundColor === "pink" || square.style.backgroundColor === "purple") return alert("Try another square")
    playerTwo.playerGameBoard.receiveAttack([x, y]);
    if (player.playerGameBoard.board[x][y] === "x") {
        square.style.backgroundColor = "pink";
        playerOne.randomShot();
        let playerTwoShot =
            playerOne.playerGameBoard.attackList[
                playerOne.playerGameBoard.attackList.length - 1
            ];
        let playerOneSquare = document.getElementById(
            `player-one-${playerTwoShot[0]}${playerTwoShot[1]}`
        );
        if (
            playerOne.playerGameBoard.board[playerTwoShot[0]][
                playerTwoShot[1]
            ] === "x"
        ) {
            playerOneSquare.style.backgroundColor = "pink";
        } else {
            playerOneSquare.style.backgroundColor = "purple";
        }
    } else {
        square.style.backgroundColor = "purple";
        playerOne.randomShot();
        console.log(playerOne.playerGameBoard.attackList);
        let playerTwoShot =
            playerOne.playerGameBoard.attackList[
                playerOne.playerGameBoard.attackList.length - 1
            ];
        console.log(playerTwoShot);
        let playerOneSquare = document.getElementById(
            `player-one-${playerTwoShot[0]}${playerTwoShot[1]}`
        );
        if (
            playerOne.playerGameBoard.board[playerTwoShot[0]][
                playerTwoShot[1]
            ] === "x"
        ) {
            playerOneSquare.style.backgroundColor = "pink";
        } else {
            playerOneSquare.style.backgroundColor = "purple";
        }
    }
};
const createShipDiv = (shipName) => {
    const container = document.createElement("div");
    container.id = `${shipName}-option`;
    container.innerHTML = `Place ${shipName}`;
    container.onclick = () => {
        shipSelection = shipName;
    };

    return container;
};
const shipPlacement = (playerName, player) => {
    const placementContainer = document.createElement("div");
    placementContainer.id = "ship-placement-container";
    const directionButton = document.createElement("button");
    directionButton.id = "direction-button";
    directionButton.innerHTML = shipPlacementDirection;
    directionButton.onclick = () => {
        shipPlacementDirection = shipPlacementDirection === "x" ? "y" : "x";
        directionButton.innerHTML = shipPlacementDirection;
    };
    placementContainer.appendChild(directionButton);
    placementContainer.appendChild(createShipDiv("carrier"));
    placementContainer.appendChild(createShipDiv("battleship"));
    placementContainer.appendChild(createShipDiv("cruiser"));
    placementContainer.appendChild(createShipDiv("submarine"));
    placementContainer.appendChild(createShipDiv("destroyer"));
    return placementContainer;
};
function component() {
    const mainContainer = document.createElement("div");
    mainContainer.id = "main-container";
    const playerOneContainer = document.createElement("div");
    playerOneContainer.id = "player-one-container";
    playerOneContainer.appendChild(createPlayerBoard("player-one", playerOne));
    playerOneContainer.appendChild(shipPlacement());
    mainContainer.appendChild(playerOneContainer);
    const playerTwoContainer = document.createElement("div");
    playerTwoContainer.id = "player-two-container";
    playerTwoContainer.appendChild(createPlayerBoard("player-two", playerTwo));
    mainContainer.appendChild(playerTwoContainer);
    // const myIcon = new Image();
    // myIcon.src = Icon;
    // mainContainer.appendChild(myIcon)

    return mainContainer;
}

const putShipOnboard = () => {
    for (let i = 0; i < playerOne.playerGameBoard.ships.length; i += 1) {
        playerOne.playerGameBoard.ships[i].shipCoord.forEach((coord) => {
            document.getElementById(
                `player-one-${coord[0]}${coord[1]}`
            ).style.backgroundColor = "grey";
        });
    }
};
const removeShipOption = (ship) => {
    let container = document.getElementById("ship-placement-container");
    let element = document.getElementById(`${ship}-option`);
    container.removeChild(element);
    if (playerOne.playerGameBoard.shipsNotDeployed <= 0) {
        const startButton = document.createElement("button");
        startButton.id = "start-button";
        startButton.innerHTML = "Start";
        startButton.onclick = () => {
            gameStarted = true;
            container.removeChild(startButton);
            playerTwo.populateBoard();
            disablePlayerOneBoardClick();
        };
        container.replaceChild(
            startButton,
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
