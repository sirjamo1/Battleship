class Square {
    constructor(x, y) {
        this.coord = { x: x, y: y };
        this.left =
            x - 1 >= 0 && x - 1 <= 9
                ? {
                      x: x - 1,
                      y: y,
                  }
                : null;
        this.right =
            x + 1 >= 0 && x + 1 <= 9
                ? {
                      x: x + 1,
                      y: y,
                  }
                : null;
        this.up =
            y - 1 >= 0 && y - 1 <= 9
                ? {
                      x: x,
                      y: y - 1,
                  }
                : null;
        this.down =
            y + 1 >= 0 && y + 1 <= 9
                ? {
                      x: x,
                      y: y + 1,
                  }
                : null;
        this.isHit = false;
        this.value = null;
    }
}

export { Square };
