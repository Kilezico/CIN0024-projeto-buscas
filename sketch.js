
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

  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  
  let startX = 640;
  let startY = 120;
  let lineHeight = 22;

  let instructions = [
    "--- Controles ---",
    "1: Agente BFS",
    "2: Agente DFS",
    "3: Agente UCS",
    "4: Agente Greedy",
    "5: Agente A*",
    "c: Reset",
    "r: Posicionar agente aleatoriamente",
    "f: Gerar nova comida",
    "m: Gerar novo mapa",
    "Seta Cima: Aumentar delay (+ lento)",
    "Seta Baixo: Diminuir delay (+ rápido)"
  ];

  for (let i = 0; i < instructions.length; i++) {
    text(instructions[i], startX, startY + i * lineHeight);
  }
}


function keyPressed() {
  switch (key) {
    case '1':
      world.clear();
      setAgentType(BFSAgent);
      break;
    case '2':
      world.clear();
      setAgentType(DFSAgent);
      break;
    case '3':
      world.clear();
      setAgentType(UCSAgent);
      break;
    case '4':
      world.clear();
      setAgentType(GreedyAgent);
      break;
    case '5':
      world.clear();
      setAgentType(AStarAgent);;
    break;
      case 'r':
      world.clear();
      randomizeAgentPosition();
      break;
    case 'f':
      world.food = world.generatePosition();
      break;
    case 'c':
      world.clear();
      setAgentType(DefaultAgent);
      break;
    case 'm':
      world.clear()
      world.generateMap();
      world.food = world.generatePosition();
      world.agent = null;
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

function setAgentType(AgentClass) {
  let currentPos = agent ? agent.start_pos.copy() : null; // Salva a posição atual
  world.clear();
  
  agent = new AgentClass(world, currentPos); // Recria o agente na mesma posição
}

function randomizeAgentPosition() {
  agent = new DefaultAgent(world, null); // Passa null para sortear nova posição
}
