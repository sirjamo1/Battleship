import _ from "lodash";
import "./style.css";
//import Icon from './assets/icons/allShips.png'
import battleship from './assets/icons/battleship.png'
import carrier from "./assets/icons/carrier.png";
import cruiser from "./assets/icons/cruiser.png";
import destroyer from "./assets/icons/destroyer.png";
import submarine from "./assets/icons/submarine.png";
import { Player } from "./classes/player";
import { GameBoard } from "./classes/gameBoard";
let playerOne = new Player();
let playerTwo = new Player();
let gameStarted = false;
let shipSelection = null;
let shipPlacementDirection = "x";
//let playerOneTurn = false

//NEED TO DO
//          * End the game
//          *
//          *
//          *
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
    if (
        playerTwo.playerGameBoard.board[x][y].slice(-3) === "HIT" ||
        playerTwo.playerGameBoard.board[x][y] === "x"
    )
        return alert("Try another square");
    //playerOne's shot
    playerTwo.playerGameBoard.receiveAttack([x, y]);
    if (playerTwo.playerGameBoard.shipsLeft === 0)
        return alert("Player One Won!");
    player.playerGameBoard.board[x][y] === "x"
        ? (square.style.backgroundColor = "pink")
        : (square.style.backgroundColor = "purple");

    //playerTwo's shot
    setTimeout(() => {
        playerOne.playerGameBoard.secondaryHeatSeeker =
            playerOne.playerGameBoard.getSecondaryHeatSeeker();
        // if heat seekers are available
        if (playerOne.playerGameBoard.heatSeekingList.length > 0) {
            let heatSeekingCoord =
                playerOne.playerGameBoard.heatSeekingList.shift();
            playerOne.playerGameBoard.receiveAttack(heatSeekingCoord);
            // if secondary heat seekers are available
        } else if (playerOne.playerGameBoard.secondaryHeatSeeker.length > 0) {
            playerOne.playerGameBoard.secondaryHeatSeeker =
                playerOne.playerGameBoard.getSecondaryHeatSeeker();

            let secondaryHeatSeeker =
                playerOne.playerGameBoard.secondaryHeatSeeker.pop();
            // console.log(secondaryHeatSeeker, "sec heat");
            playerOne.playerGameBoard.receiveAttack(secondaryHeatSeeker);
            // take a random shot
        } else {
            playerOne.randomShot();
        }
        // get where shot hit
        let playerTwoShot =
            playerOne.playerGameBoard.attackList[
                playerOne.playerGameBoard.attackList.length - 1
            ];
        console.log(playerTwoShot, "<-- player twos shot");
        // get corresponding div
        let playerOneSquare = document.getElementById(
            `player-one-${playerTwoShot[0]}${playerTwoShot[1]}`
        );
        // change div background color
        playerOne.playerGameBoard.board[playerTwoShot[0]][playerTwoShot[1]] ===
        "x"
            ? (playerOneSquare.style.backgroundColor = "pink")
            : (playerOneSquare.style.backgroundColor = "purple");
        if (playerOne.playerGameBoard.shipsLeft === 0)
            return alert("Player Two Won!");
    }, 1000);
};
const createShipDiv = (shipName, shipImageName) => {

    const shipImage = new Image()
    shipImage.src = shipImageName;

    shipImage.id = `${shipName}-option`;
    //container.innerHTML = `Place ${shipName}`;
    shipImage.onclick = () => {
        shipSelection = shipName;
    };
    // const container = document.createElement("div");
    // container.id = `${shipName}-option`;
    // container.innerHTML = `Place ${shipName}`;
    // container.onclick = () => {
    //     shipSelection = shipName;
    // };
    // const myIcon = new Image();
    // myIcon.src = Icon;
    // mainContainer.appendChild(myIcon)
    return shipImage;
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
    };
    const randomPlacement = document.createElement("button");
    randomPlacement.id = "random-placement-button";
    randomPlacement.innerHTML = "Random placement";
    randomPlacement.onclick = () => {
        playerOne.populateBoard();
        playerOne.playerGameBoard.ships.forEach((ship) => {
            ship.shipCoord.forEach((coord) => {
                let square = document.getElementById(
                    `player-one-${coord[0]}${coord[1]}`
                );
                square.style.backgroundColor = "grey";
            });
        });

        placementContainer.removeChild(
            document.getElementById("carrier-option")
        );
        placementContainer.removeChild(
            document.getElementById("battleship-option")
        );
        placementContainer.removeChild(
            document.getElementById("cruiser-option")
        );
        placementContainer.removeChild(
            document.getElementById("submarine-option")
        );
        removeShipOption("destroyer");
    };
    placementContainer.appendChild(randomPlacement);
    placementContainer.appendChild(directionButton);
    placementContainer.appendChild(createShipDiv("carrier", carrier));
    placementContainer.appendChild(createShipDiv("battleship", battleship));
    placementContainer.appendChild(createShipDiv("cruiser", cruiser));
    placementContainer.appendChild(createShipDiv("submarine", submarine));
    placementContainer.appendChild(createShipDiv("destroyer", destroyer));
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
const resetGame = () => {
    playerOne = new Player();
    playerTwo = new Player();
    gameStarted = false;
    shipSelection = null;
    shipPlacementDirection = "x";
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
    playerOneContainer.replaceChild(shipPlacement(), shipPlacementContainer);
};
const removeShipOption = (ship) => {
    let container = document.getElementById("ship-placement-container");
    let element = document.getElementById(`${ship}-option`);
    container.removeChild(element);
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
            container.removeChild(startButton);
            playerTwo.populateBoard();
            disablePlayerOneBoardClick();
        };
        container.replaceChild(
            startButton,
            document.getElementById("direction-button")
        );
        container.replaceChild(
            resetButton,
            document.getElementById("random-placement-button")
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
