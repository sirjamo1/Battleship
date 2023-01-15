import { GameBoard } from "../classes/gameBoard";

const boardTest = new GameBoard();

test("check squares", () => {
    expect(boardTest.board.length).toBe(10);
});
// check square directions
test("check square directions after 'assignBoardSquareDirections()' has run", () => {
    expect(boardTest.board[5][5].left).toBe(boardTest.board[4][5]);
    expect(boardTest.board[5][5].right).toBe(boardTest.board[6][5]);
    expect(boardTest.board[5][5].up).toBe(boardTest.board[5][4]);
    expect(boardTest.board[5][5].down).toBe(boardTest.board[5][6]);
    expect(boardTest.board[0][0].up).toBe(null);
    expect(boardTest.board[0][0].left).toBe(null);
    expect(boardTest.board[9][9].down).toBe(null);
    expect(boardTest.board[9][9].right).toBe(null);
});
// Adding ship tests
test("Adding ship (carrier)(horizontal), and check board for it", () => {
    boardTest.createShip([1, 1], "x", "carrier");
    expect(boardTest.board[1][1].value && boardTest.board[5][1].value).toBe(
        "carrier"
    );
});
test("Try adding ship (destroyer) to same space as carrier", () => {
    expect(boardTest.createShip([3, 1], "x", "destroyer")).toBe(
        "carrier occupies this space"
    );
});
test("Try adding ship (destroyer) off the board", () => {
    expect(boardTest.createShip([11, 3], "x", "destroyer")).toBe(
        "Ship must be placed on board"
    );
});
test("adding ship (cruiser) (vertical) and check board for it", () => {
    boardTest.createShip([4, 4], "y", "cruiser");
    expect(boardTest.board[4][4].value && boardTest.board[4][6].value).toBe(
        "cruiser"
    );
});
test("check either side carrier ship === []", () => {
    expect(
        boardTest.board[1][0].value && boardTest.board[5][2].value
    ).toStrictEqual(null);
});

// //Attacking tests

test("check attackList is empty(before any attacks)", () => {
    expect(boardTest.attackList).toStrictEqual([]);
});
test("check attackList after receiveAttack is run", () => {
    boardTest.receiveAttack([3, 5]);
    expect(boardTest.attackList).toStrictEqual([[3, 5]]);
});
test("check attackList after receiveAttack is run again", () => {
    boardTest.receiveAttack([2, 6]);
    expect(boardTest.attackList).toStrictEqual([
        [3, 5],
        [2, 6],
    ]);
});
test("check board to see if previous attacks has logged", () => {
    expect(boardTest.board[2][6].isHit).toBe(true);
});

test("check random coord is return 2 numbers between 0-9", () => {
    let randomNum = boardTest.randomCoord();
    expect(randomNum[0]).toBeLessThanOrEqual(9);
    expect(randomNum[0]).toBeGreaterThanOrEqual(0);
    expect(randomNum[1]).toBeLessThanOrEqual(9);
    expect(randomNum[1]).toBeGreaterThanOrEqual(0);
});
test("check  random orientation", () => {
    expect(boardTest.randomOrientation()).toMatch(/x||y/);
});
//sonar test
test("sonar", () => {
    expect(boardTest.sonar).toBe(0);
    boardTest.addToSonar(35);
    expect(boardTest.sonar).toBe(35);
    expect(boardTest.isSonarReady()).toBe(false);
    boardTest.addToSonar(65);
    expect(boardTest.sonar).toBe(100);
    expect(boardTest.isSonarReady()).toBe(true);
    boardTest.resetSonar();
    expect(boardTest.sonar).toBe(0);
    expect(boardTest.isSonarReady()).toBe(false);
});
//wrench test
test("wrench", () => {
    expect(boardTest.wrench).toBe(0);
    boardTest.addToWrench(300);
    expect(boardTest.wrench).toBe(300);
    expect(boardTest.isWrenchReady()).toBe(false);
    boardTest.addToWrench(60);
    expect(boardTest.wrench).toBe(360);
    expect(boardTest.isWrenchReady()).toBe(true);
    boardTest.resetWrench();
    expect(boardTest.wrench).toBe(0);
    expect(boardTest.isWrenchReady()).toBe(false);
});

// Heat Seeker
test("Heat Seekers: *Put ship on board -> *Attack ship (a hit logs coord to preHit) -> *Attack ship again (if preHit matches 1 square away, heat seekers are created)***NOTE: end result depends on spaces around second hit being on board, already being hit ", () => {
    boardTest.createShip([5, 5], "y", "submarine");
    boardTest.receiveAttack([5, 6]);
    expect(boardTest.prevHit).toStrictEqual([5, 6]);
    expect(boardTest.heatSeekingList.length).toBe(0);
    boardTest.receiveAttack([5, 7]);
    expect(boardTest.prevHit).toStrictEqual([5, 7]);
    expect(boardTest.heatSeekingList).toStrictEqual([
        [5, 8],
        [5, 5],
        [5, 4],
    ]);
});
// get square opposite direction
test("find opposite seeker", () => {
    const oppositeSquareLeft = boardTest.findOppositeSeeker(
        boardTest.board[8][7],
        "left",
        -1
    );
    expect(oppositeSquareLeft).toBe(boardTest.board[7][7]);
    const oppositeSquareRight = boardTest.findOppositeSeeker(
        boardTest.board[8][7],
        "right",
        -1
    );
    expect(oppositeSquareRight).toBe(boardTest.board[9][7]);
    const oppositeSquareUp = boardTest.findOppositeSeeker(
        boardTest.board[8][7],
        "up",
        -1
    );
    expect(oppositeSquareUp).toBe(boardTest.board[8][6]);
    const oppositeSquareDown = boardTest.findOppositeSeeker(
        boardTest.board[8][7],
        "down",
        -1
    );
    expect(oppositeSquareDown).toBe(boardTest.board[8][8]);
});
// secondary heat seekers
test("checks squares around a hit ship, if squares haven't been tried, adds them to secondaryHeatSeeker, all sibling squares have not been hit", () => {
    boardTest.clearSecondaryHeatSeekingList(); //clear for test
    expect(boardTest.secondaryHeatSeeker.length).toBe(0);
    boardTest.getSecondaryHeatSeeker([3, 3]);
    expect(boardTest.secondaryHeatSeeker).toStrictEqual([
        [2, 3],
        [4, 3],
        [3, 2],
        [3, 4],
    ]);
});
test("same test as above but with some squares already been hit", () => {
    boardTest.clearSecondaryHeatSeekingList(); //clear for test
    expect(boardTest.secondaryHeatSeeker.length).toBe(0);
    boardTest.board[4][3].isHit = true;
    expect(boardTest.board[4][3].isHit).toBe(true);
    boardTest.board[3][2].isHit = true;
    expect(boardTest.board[3][2].isHit).toBe(true);
    boardTest.getSecondaryHeatSeeker([3, 3]);
    expect(boardTest.secondaryHeatSeeker).toStrictEqual([
        [2, 3],
        [3, 4],
    ]);
});

test("check if two coords are equal", () => {
    expect(boardTest.isCoordEqual([1, 1], [1, 1])).toBe(true);
    expect(boardTest.isCoordEqual([1, 2], [1, 1])).toBe(false);
});
const testBoard2 = new GameBoard()
test("populate board test", () => {
    expect(testBoard2.shipsNotDeployed).toBe(5)
    testBoard2.populateBoard();
    expect(testBoard2.shipsNotDeployed).toBe(0);
})
