class Agent {
  constructor(world) {
    this.world = world;
    
    this.pos = this.world.generatePosition();
    this.start_pos = this.pos;
    this.world.agent = this.getRealCoords(this.pos);
    this.world.pointer(this.pos);
    
    this.parent = Array(this.world.h).fill().map(() => Array(this.world.w).fill(-1));
    this.parent[this.pos.x][this.pos.y] = this.pos;

    this.flip = 0;
    this.delay = 1;
    this.counter = 0;
    
    this.stage = 0;

    this.path = Array();
  }

  update() {
    this.counter++;
    if (this.stage == 0) {
      if (this.counter >= this.delay) {
        this.step();
        this.counter = 0;
      }
    } else if (this.stage == 1) {
      if (this.counter >= 60) {
        this.counter = 0;
        this.stage++;
      }
    } else if (this.stage == 2) {
      if (this.path.length <= 0) {
        this.reset();
        this.world.clear();
        this.stage = 0;
      } else {
        let back = this.path[this.path.length-1];

        if (this.world.agent.dist(this.getRealCoords(back)) < 1) {
          this.path.pop();
        } else {
          let tgt = this.getRealCoords(back);
          let dist = tgt.dist(this.world.agent);
          let vel = tgt
          tgt.sub(this.world.agent).normalize().mult(min(dist, this.world.speed[back.x][back.y]));

          this.world.agent.add(vel);
        }
      }
    }
  }

  getRealCoords(pos) {
    return createVector((2*pos.x+1)*this.world.lenH/2, (2*pos.y+1)*this.world.lenW/2);
  }
  
  step() {
    if ((++this.flip) % 2 != 0) {
      this.expandFrontier();
    } else {
      this.chooseFrontier();
    }
  }
  
  foundFood() {
    this.stage++;
    let opa = this.world.food;
    while (opa.x != this.start_pos.x || opa.y != this.start_pos.y) {
      this.world.path(opa);
      this.path.push(opa);
      opa = this.parent[opa.x][opa.y];
    }
    this.world.path(opa);

    this.counter = 0;
  }
  
  chooseFrontier() {
    // Me implemente
  }
  
  expandFrontier() {
    // Me implemente
  } 

  reset() {
    // Me implemente
  }
}

class BFSAgent extends Agent {
  constructor(world) {
    super(world);

    this.queue = Array();
  }

  chooseFrontier() {
    this.world.explore(this.pos);
    if (this.queue.length == 0) {
      this.stage = -1;
      return;
    }
    let newPos = this.queue[0];
    this.queue.shift();
    this.world.pointer(newPos);
    this.pos = newPos;

    if (
      this.pos.x == this.world.food.x &&
      this.pos.y == this.world.food.y
    ) {
      this.foundFood();
    }
  }
  
  expandFrontier() {
    for (let d=0; d<dirX.length; d++) {
      let newPos = this.pos.copy().add(dirX[d], dirY[d]);
      if (
        this.world.inRange(newPos) &&
        this.world.color[newPos.x][newPos.y] != this.world.OBSTACLE &&
        this.world.taint[newPos.x][newPos.y] == this.world.UNEXPLORED
      ) {
        this.world.frontier(newPos);
        this.queue.push(newPos);
        this.parent[newPos.x][newPos.y] = this.pos;
      }
    }
  }

  reset() {
    this.path = Array();
    this.parent = Array(this.world.h).fill().map(() => Array(this.world.w).fill(-1));
    this.parent[this.pos.x][this.pos.y] = this.pos;
    this.start_pos = this.pos;
    
    this.queue = Array();
  }
}
