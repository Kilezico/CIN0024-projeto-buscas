
class World {
  constructor(w, h) {
    this.w = w;
    this.h = h;

    this.GROUND = color(150, 115, 78);
    this.MUD = color(84, 59, 14);
    this.WATER = color(15, 94, 156);
    this.OBSTACLE = color(0, 0, 0);
    this.FOOD = color(255, 0, 0);
    this.AGENT = color(200, 200, 10);

    this.UNEXPLORED = color(0, 0, 0, 0);
    this.EXPLORED = color(0, 50, 10);
    this.FRONTIER = color(0, 255, 80);
    this.POINTER = color(255, 255, 255);
    
    this.GROUND_COST = 1;
    this.MUD_COST = 5;
    this.WATER_COST = 13;
    
    this.strokeWeight = 3;

    this.noise = Array(h).fill().map(() => Array(w).fill(0));
    this.cost = Array(h).fill().map(() => Array(w).fill(0));
    this.color = Array(h).fill().map(() => Array(w).fill(this.GROUND));
    this.stroke = Array(h).fill().map(() => Array(w).fill(this.UNEXPLORED));

    this.generateMap();
    
    this.agent = null;
    this.food = null;
  }

  frontier(pos) {
    this.stroke[pos.x][pos.y] = this.FRONTIER;
  }

  explore(pos) {
    this.stroke[pos.x][pos.y] = this.EXPLORED;
  }

  pointer(pos) {
    this.stroke[pos.x][pos.y] = this.POINTER;
  }

  clear() {
    this.stroke = Array(this.h).fill().map(() => Array(this.w).fill(this.UNEXPLORED));
    this.food = null;
    this.agent = null;
  }

  inRange(pos) {
    return pos.x >= 0 && pos.x < this.h && pos.y >= 0 && pos.y < this.w;
  }
  
  generateMap() {
    this.generateNoise();
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
  
  generateNoise() {
    for (let i=0; i<this.h; i++) {
      for (let j=0; j<this.w; j++) {
        this.noise[i][j] = noise(i/this.h*10, j/this.w*10);
      }
    }
  }

  generatePosition() {
    let pos = createVector(randint(0, this.h - 1), randint(0, this.w - 1));
    while ((this.color[pos.x][pos.y] == this.OBSTACLE)) 
      pos = createVector(randint(0, this.h - 1), randint(0, this.w - 1));
    return pos;
  }
  
  drawMap() {
    let lenW = width/this.w, lenH = height/this.h;
    for (let i=0; i<this.h; i++) {
      for (let j = 0; j < this.w; j++) {
        if (this.stroke[i][j] == this.UNEXPLORED) {
          noStroke();
          fill(this.color[i][j]);
          rect(j*lenW, i*lenH, lenW+1, lenH+1);
        } else {
          noStroke();
          fill(this.stroke[i][j]);
          rect(j*lenW, i*lenH, lenW+1, lenH+1);
  
          fill(this.color[i][j]);
          rect(j*lenW + this.strokeWeight, i*lenH + this.strokeWeight, lenW - 2*this.strokeWeight, lenH - 2*this.strokeWeight);
        }
      }
    }

    if (this.food) {
      stroke(0);
      fill(this.FOOD);
      ellipse(this.food.y*lenW + lenW/2, this.food.x*lenH + lenH/2, lenW*0.7, lenH*0.7);
    }

    if (this.agent) {
      push();
      stroke(0);
      fill(this.AGENT);
      translate(this.agent.y * lenW + lenW / 2, this.agent.x * lenH + lenH / 2);
      // translate(this.agent.x, this.agent.y);
      rotate(frameCount / 100);
      star(0, 0, lenW * 0.2, lenH * 0.45, 5);
      pop();
    }
  }
  
  drawNoise() {
    let lenW = width/this.w, lenH = height/this.h;
    for (let i=0; i<this.h; i++) {
      for (let j=0; j<this.w; j++) {
        noStroke();
        fill(255*this.noise[i][j]);
        rect(j*lenW, i*lenH, lenW+1, lenH+1);
      }
    }
  }
}
