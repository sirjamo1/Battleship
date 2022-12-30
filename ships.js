class Ship {
    constructor(length, hitCount = 0, sunk = false) {
        this.length = length;
        this.hitCount = hitCount;
        this.sunk = sunk;
        this.shipCoord = []
    }
    hit() {
     return this.hitCount += 1
    }
    isSunk() {
     if(this.length === this.hitCount) {
      this.sunk = true
     }
     return this.sunk
    }
}


export { Ship };
