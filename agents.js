class BFSAgent {
  constructor(world) {
    this.world = world;

    this.pos = this.world.generatePosition();
    this.world.agent = this.pos;
    this.world.pointer(this.pos);

    this.parent = Array(this.world.h).fill().map(() => Array(this.world.w).fill(-1));
    this.parent[this.pos.x][this.pos.y] == this.pos;
    
    this.queue = Array();
    

    this.flip = 0;
    this.delay = 10;
    this.pause = false;
    this.run = true;
  }

  update() {
    if (this.run && !this.pause) {
      if (frameCount % this.delay == 0) {
        this.step();
      }
    }
  }

  step() {
    if ((++this.flip) % 2 != 0) {
      this.expandFrontier();
    } else {
      this.chooseFrontier();
    }
  }
  
  chooseFrontier() {
    this.world.explore(this.pos);
    if (this.queue.length == 0) {
      this.run = false;
      return;
    }
    let newPos = this.queue[0];
    this.queue.shift();
    this.world.pointer(newPos);
    this.pos = newPos;
  }
  
  expandFrontier() {
    for (let d=0; d<4; d++) {
      let newPos = this.pos.copy().add(dirX[d], dirY[d]);
      if (this.world.inRange(newPos) && this.world.color[newPos.x][newPos.y] != this.world.OBSTACLE && this.world.taint[newPos.x][newPos.y] == this.world.UNEXPLORED) {
        this.world.frontier(newPos);
        this.queue.push(newPos);
      }
    }
  }
}
