import _ from "lodash";
import "./style.css";
//import Icon from './assets/icons/allShips.png'
import { Player } from "./classes/player";
const playerOne = new Player();
const playerTwo = new Player();
let gameStarted = false;
let shipSelection = null;
let shipPlacementDirection = "x";
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
                if (gameStarted === false) {
                    if (shipSelection === null)
                        return alert("Please select a ship");
                    playerOne.playerGameBoard.createShip(
                        [j, i],
                        shipPlacementDirection,
                        shipSelection
                    );
                    putShipOnboard();
                    removeShipOption(shipSelection);
                    // console.log(playerOne.playerGameBoard.shipsNotDeployed)
                    // console.log([j, i], shipPlacementDirection, shipSelection);
                } else {
                    console.log([j, i]);
                    player.playerGameBoard.receiveAttack([j, i]);
                    if (player.playerGameBoard.board[j][i] === "x") {
                        square.style.backgroundColor = "pink";
                    } else {
                        square.style.backgroundColor = "purple";
                        console.log(player.playerGameBoard.board[j][i]);
                    }
                }
            };
            row.appendChild(square);
        }
        board.appendChild(row);
    }
    return board;
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
        const startButton = document.createElement('button');
        startButton.id = 'start-button'
        startButton.innerHTML = 'Start'
        startButton.onclick = () => {
            gameStarted = true
            container.removeChild(startButton)
            playerTwo.populateBoard()
        }
        container.replaceChild(startButton, document.getElementById("direction-button"));
    }
};
document.body.appendChild(component());
