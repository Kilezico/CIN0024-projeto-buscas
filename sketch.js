
let world;
let agent = null;

function setup() {
  createCanvas(1000, 1000);
  world = new World(600,500,25,25);
  

}

function draw() {
  background(0);

  if (agent) {
    agent.update();
  }
  
  world.drawMap();

   if (agent) {
      fill(255);          
      textSize(24);    
      textAlign(LEFT, TOP); 
      text("Comidas coletadas: " + agent.foods, 640, 50);
    }
  
  // console.log(frameRate());
}


function keyPressed() {
  switch (key) {
    case '1':
      world.clear();
      agent = new BFSAgent(world);
      break;
    case '2':
      world.clear();
      agent = new DFSAgent(world);
      break;
    case '3':
      world.clear();
      agent = new UCSAgent(world);
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
