
let world;
let agent = null;

function setup() {
  createCanvas(1000, 1000);

  world = new World(1000, 1000, 25, 25);

}

function draw() {
  background(220);

  if (agent) {
    agent.update();
  }
  
  world.drawMap();

  // console.log(frameRate());
}


function keyPressed() {
  switch (key) {
    case '1':
      world.clear();
      agent = new BFSAgent(world);
      break;
    case 'f':
      world.food = world.generatePosition();
      break;
    case 'c':
      world.clear();
      agent = null;
      break;
    case 'ArrowUp':
      agent.delay++;
      console.log(agent.delay);
      break;
    case 'ArrowDown':
      agent.delay = max(agent.delay - 1, 0);
      console.log(agent.delay);
      break;
    default: break;
  }
}
