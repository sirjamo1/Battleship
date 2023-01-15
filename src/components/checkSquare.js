import sunk from "../assets/sounds/sunk.wav";
import miss from "../assets/sounds/miss.wav";
import hit from "../assets/sounds/hit.wav";
const sunkSound = new Audio(sunk);
const missSound = new Audio(miss);
const hitSound = new Audio(hit);

const checkSquare = (player, x, y, audioOn) => {
    const square = player.board[x][y];
    let shipName = square.value;
    let message = "";
    player.ships.forEach((ship) => {
        if (ship.name == shipName && ship.sunk === true) {
            if (audioOn) sunkSound.play();
            message += `Hit! ${
                shipName[0].toUpperCase() + shipName.slice(1)
            } has been sunk!`;
            ship.shipCoord.forEach((coord) => {
                let square = document.getElementById(
                    `${player.className}-${coord[0]}${coord[1]}`
                );
                square.childNodes[0].style.opacity = "1";
            });
            player.clearHeatSeekingList();
            player.clearSecondaryHeatSeekingList();
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
export { checkSquare };
