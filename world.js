
class World {
  constructor(w, h) {
    this.w = w;
    this.h = h;

    this.GROUND = color(150, 115, 78);
    this.MUD = color(84, 59, 14);
    this.WATER = color(15, 94, 156);
    this.OBSTACLE = color(0, 0, 0);

    this.GROUND_COST = 1;
    this.MUD_COST = 5;
    this.WATER_COST = 13;

    this.UNEXPLORED = color(0, 0, 0, 0);
    this.EXPLORED = color(92, 92, 0);
    this.FRONTIER = color(255, 92, 0);
    this.START = color(255, 255, 255);
    this.END = color(0, 255, 0);

    this.start = createVector(h-1, 0);
    this.end = createVector(0, w-1);
    
    this.noise = Array(h).fill().map(() => Array(w).fill(0));
    this.cost = Array(h).fill().map(() => Array(w).fill(0));;
    this.color = Array(h).fill().map(() => Array(w).fill(this.GROUND));
    this.stroke = Array(h).fill().map(() => Array(w).fill(this.UNEXPLORED));

    this.stroke[this.start.x][this.start.y] = this.START;
    this.stroke[this.end.x][this.end.y] = this.END;
  }

  frontier(i, j) {
    this.stroke[i][j] = this.FRONTIER;
  }

  explore(i, j) {
    this.stroke[i][j] = this.EXPLORED;
  }

  clear() {
    this.stroke = Array(h).fill().map(() => Array(w).fill(this.UNEXPLORED));

    this.stroke[this.start.x][this.start.y] = this.START;
    this.stroke[this.end.x][this.end.y] = this.END;
  }
  
  generateMap(offset) {
    this.generateNoise(offset);
    for (let i=0; i<this.h; i++) {
      for (let j=0; j<this.w; j++) {
        if (this.noise[i][j] < 0.33) {
          this.cost[i][j] = this.WATER_COST;
          this.color[i][j] = this.WATER;
        } else if (this.noise[i][j] < 0.45) {
          this.cost[i][j] = this.MUD_COST;
          this.color[i][j] = this.MUD;
        } else if (this.noise[i][j] < 0.65) {
          this.cost[i][j] = this.GROUND_COST;
          this.color[i][j] = this.GROUND;
        } else {
          this.color[i][j] = this.OBSTACLE;
        }
      }
    }
  }
  
  generateNoise(offset) {
    for (let i=0; i<this.h; i++) {
      for (let j=0; j<this.w; j++) {
        this.noise[i][j] = noise(i/this.h*10 + offset, j/this.w*10 + offset);
      }
    }
  }

  drawMap() {
    let lenW = width/this.w, lenH = height/this.h;
    for (let i=0; i<this.h; i++) {
      for (let j=0; j<this.w; j++) {
        stroke(this.stroke[i][j]);
        fill(this.color[i][j]);
        strokeWeight(2);
        rect(j*lenW, i*lenH, lenW, lenH);
      }
    }
  }
  
  drawNoise() {
    let lenW = width/this.w, lenH = height/this.h;
    for (let i=0; i<this.h; i++) {
      for (let j=0; j<this.w; j++) {
        noStroke();
        fill(255*this.noise[i][j]);
        rect(j*lenW, i*lenH, lenW, lenH);
      }
    }
  }
}