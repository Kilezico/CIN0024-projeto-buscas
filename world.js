
class World {
  constructor(wid, hei, w, h) {
    this.width = wid;
    this.height = hei;
    this.w = w;
    this.h = h;
    this.lenW = wid/w;
    this.lenH = hei/h;

    this.GROUND = color(150, 115, 78);
    this.MUD = color(84, 59, 14);
    this.WATER = color(15, 94, 156);
    this.OBSTACLE = color(0, 0, 0);
    this.FOOD = color(255, 0, 0);
    this.AGENT = color(200, 200, 10);

    this.UNEXPLORED = color(0, 0, 0, 0);
    this.EXPLORED = color(0, 50, 10, 180);
    this.FRONTIER = color(0, 255, 80, 100);
    this.POINTER = color(255, 255, 255, 150);
    this.PATH = color(167, 0, 167, 75);
    
    this.GROUND_SPEED = 4;
    this.MUD_SPEED = 2;
    this.WATER_SPEED = 1;

    this.GROUND_COST = 1;
    this.MUD_COST = 2;
    this.WATER_COST = 4;
    
    this.noise = Array(h).fill().map(() => Array(w).fill(0));
    this.speed = Array(h).fill().map(() => Array(w).fill(0));
    this.cost = Array(h).fill().map(() => Array(w).fill(0));
    this.color = Array(h).fill().map(() => Array(w).fill(this.GROUND));
    this.taint = Array(h).fill().map(() => Array(w).fill(this.UNEXPLORED));

    this.generateMap();
    
    this.agent = null;
    this.food = null;
  }

  frontier(pos) {
    this.taint[pos.x][pos.y] = this.FRONTIER;
  }

  explore(pos) {
    this.taint[pos.x][pos.y] = this.EXPLORED;
  }

  pointer(pos) {
    this.taint[pos.x][pos.y] = this.POINTER;
  }

  path(pos) {
    this.taint[pos.x][pos.y] = this.PATH;
  }

  clear() {
    this.taint = Array(this.h).fill().map(() => Array(this.w).fill(this.UNEXPLORED));
    this.food = this.generatePosition();
  }

  inRange(pos) {
    return pos.x >= 0 && pos.x < this.h && pos.y >= 0 && pos.y < this.w;
  }
  
  generateMap() {
    this.generateNoise();
    for (let i=0; i<this.h; i++) {
      for (let j=0; j<this.w; j++) {
        if (this.noise[i][j] < 0.33) {
          this.speed[i][j] = this.WATER_SPEED;
          this.color[i][j] = this.WATER;
          this.cost[i][j] = this.WATER_COST;
        } else if (this.noise[i][j] < 0.45) {
          this.speed[i][j] = this.MUD_SPEED;
          this.color[i][j] = this.MUD;
          this.cost[i][j] = this.MUD_COST;
        } else if (this.noise[i][j] < 0.65) {
          this.speed[i][j] = this.GROUND_SPEED;
          this.color[i][j] = this.GROUND;
          this.cost[i][j] = this.GROUND_COST;
        } else {
          this.color[i][j] = this.OBSTACLE;
          this.speed[i][j] = 0;
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
    let lenW = this.width/this.w, lenH = this.height/this.h;
    for (let i=0; i<this.h; i++) {
      for (let j = 0; j < this.w; j++) {
        noStroke();
        fill(this.color[i][j]);
        rect(j*lenW, i*lenH, lenW+1, lenH+1);

        fill(this.taint[i][j]);
        rect(j*lenW, i*lenH, lenW+1, lenH+1);
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
      // translate(this.agent.y * lenW + lenW / 2, this.agent.x * lenH + lenH / 2);
      translate(this.agent.y, this.agent.x);
      rotate(frameCount / 100);
      star(0, 0, lenW * 0.2, lenH * 0.45, 5);
      pop();
    }
  }
  
  drawNoise() {
    let lenW = this.width/this.w, lenH = this.height/this.h;
    for (let i=0; i<this.h; i++) {
      for (let j=0; j<this.w; j++) {
        noStroke();
        fill(255*this.noise[i][j]);
        rect(j*lenW, i*lenH, lenW+1, lenH+1);
      }
    }
  }
}
