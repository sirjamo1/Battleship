class Ship {
    constructor(length, name, direction, hitCount = 0, sunk = false) {
        this.name = name;
        this.length = length;
        this.hitCount = hitCount;
        this.sunk = sunk;
        this.shipCoord = [];
        this.direction = direction;
    }
    hit() {
        return (this.hitCount += 1);
    }
    isSunk() {
        if (this.length === this.hitCount) {
            this.sunk = true;
        }
        return this.sunk;
    }
}

export { Ship };
