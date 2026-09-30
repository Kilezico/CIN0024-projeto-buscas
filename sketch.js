
let world;

let i = 0;
function setup() {
  createCanvas(600, 600);

  world = new World(25, 25);
  world.generateMap(0);
  
}

function draw() {
  background(220);
  
  world.drawMap();
}