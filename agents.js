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

    this.foods = 0;

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
        this.foods++;
        this.reset();
        this.world.clear();
        this.stage = 0;
      } else {
        let back = this.path[this.path.length-1];

        if (this.world.agent.dist(this.getRealCoords(back)) < 1) {
          this.path.pop();
        } else {
          let tgt = this.getRealCoords(back);
          let distt = tgt.dist(this.world.agent);
          let vel = tgt
          tgt.sub(this.world.agent).normalize().mult(min(distt, this.world.speed[back.x][back.y]));

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

class DFSAgent extends Agent {
  constructor(world) {
    super(world);
    this.stack = Array();
    this.queue = Array();
  }
  chooseFrontier(){
    this.world.explore(this.pos);
    if (this.stack.length == 0) { //não achou a comida porque a pilha acabou
      this.stage = -1;
      return;
    }
    let newPos = this.stack.pop();
    this.world.pointer(newPos);
    this.pos = newPos;
    if (
      this.pos.x == this.world.food.x &&
      this.pos.y == this.world.food.y
    ) {
      this.foundFood();
    }
  }
  expandFrontier(){
    for (let d = 0; d < dirX.length; d++) {
      let newPos = this.pos.copy().add(dirX[d], dirY[d]);
      if (
        this.world.inRange(newPos) &&
        this.world.color[newPos.x][newPos.y] != this.world.OBSTACLE &&
        this.world.taint[newPos.x][newPos.y] == this.world.UNEXPLORED
      ) {
        this.world.frontier(newPos);
        this.stack.push(newPos);
        this.parent[newPos.x][newPos.y] = this.pos; //salva o pai para poder reconstruir o caminho depois
      }
    }
  }
  reset() {
    this.path = Array();
    this.parent = Array(this.world.h).fill().map(() => Array(this.world.w).fill(-1));
    this.parent[this.pos.x][this.pos.y] = this.pos;
    this.start_pos = this.pos;
    this.stack = Array(); //reinicializa a pilha com a nova posição atual após comer
    this.stack.push(this.pos);
  }
}

// custo unico (ucs)
class UCSAgent extends Agent {
  constructor(world) {
    super(world);
    
    this.parent[this.pos.x][this.pos.y] = this.pos.copy(); // posicao inicial na matriz de pais

    // Lista de posicoes que ainda podem ser exploradas
    // Cada elemento guarda a posicao e o custo acumulado
    this.frontier = [];

    // Menor custo conhecido para chegar a cada posicao
    this.gScore = Array(this.world.h)
      .fill()
      .map(() => Array(this.world.w).fill(Infinity));

    // Marca as posicoes cujo menor custo ja foi confirmado
    this.closed = Array(this.world.h)
      .fill()
      .map(() => Array(this.world.w).fill(false));

    // O estado inicial tem custo zero
    this.gScore[this.pos.x][this.pos.y] = 0;

    // A posicao inicial tambem entra na fronteira
    this.frontier.push({
      pos: this.pos.copy(),
      cost: 0
    });
  }

  chooseFrontier() {
    // Marca como explorada a posicao anteriormente visitada
    this.world.explore(this.pos);

    // Se nao houver mais posicoes, nao existe caminho
    if (this.frontier.length === 0) {
      this.stage = -1;
      return;
    }

    // Ordena a fronteira pelo menor custo acumulado
    this.frontier.sort((a, b) => a.cost - b.cost);

    // Retira a posicao de menor custo
    let current = this.frontier.shift();

    // Ignora entradas antigas, caso o custo tenha sido atualizado
    while (
      current &&
      (
        current.cost !== this.gScore[current.pos.x][current.pos.y] ||
        this.closed[current.pos.x][current.pos.y]
      )
    ) {
      if (this.frontier.length === 0) {
        this.stage = -1;
        return;
      }

      current = this.frontier.shift();
    }

    // Atualiza a posicao atual do agente
    this.pos = current.pos.copy();
    this.closed[this.pos.x][this.pos.y] = true;

    // e destaca no mapa
    this.world.pointer(this.pos);

    // se ja encontrou a comida
    if (
      this.pos.x === this.world.food.x &&
      this.pos.y === this.world.food.y
    ) {
      this.foundFood();
    }
  }

  expandFrontier() {
    for (let d = 0; d < dirX.length; d++) {
      let newPos = this.pos.copy().add(dirX[d], dirY[d]);

      // verifica se a posição eh valida e nao eh um obstaculo.
      if (
        !this.world.inRange(newPos) ||
        this.world.color[newPos.x][newPos.y] === this.world.OBSTACLE ||
        this.closed[newPos.x][newPos.y]
      ) {
        continue;
      }

      // Custo para chegar ao vizinho:
      // custo acumulado atual + custo do terreno de destino
      let newCost =
        this.gScore[this.pos.x][this.pos.y] +
        this.world.cost[newPos.x][newPos.y];

      // So atualiza se encontrou um caminho de menor custo
      if (newCost < this.gScore[newPos.x][newPos.y]) {
        this.gScore[newPos.x][newPos.y] = newCost;

        // Registra o antecessor para reconstruir o caminho
        this.parent[newPos.x][newPos.y] = this.pos.copy();

        // Adiciona aa fronteira para ser avaliada
        this.frontier.push({
          pos: newPos.copy(),
          cost: newCost
        });

        // Mostra a posicao na fronteira
        this.world.frontier(newPos);
      }
    }
  }

  reset() {
    // Reinicia as estruturas apos comer comida
    this.path = [];

    this.parent = Array(this.world.h)
      .fill()
      .map(() => Array(this.world.w).fill(-1));

    this.parent[this.pos.x][this.pos.y] = this.pos.copy();
    this.start_pos = this.pos.copy();

    this.frontier = [];

    this.gScore = Array(this.world.h)
      .fill()
      .map(() => Array(this.world.w).fill(Infinity));

    this.closed = Array(this.world.h)
      .fill()
      .map(() => Array(this.world.w).fill(false));

    this.gScore[this.pos.x][this.pos.y] = 0;

    // A posicao atual passa a ser o novo estado inicial
    this.frontier.push({
      pos: this.pos.copy(),
      cost: 0
    });
  }
}

class GreedyAgent extends Agent{
  constructor(world){
    super(world);

    this.front = [];

  }

  h(pos){
    return Math.abs(pos.x - this.world.food.x) + Math.abs(pos.y - this.world.food.y);
    //return Math.sqrt(Math.pow(pos.x - this.world.food.x, 2) + Math.pow(pos.x - this.world.food.x, 2));
  }

  expandFrontier(){
    for (let i = 0; i < 4; i++){
      let vizPos = createVector(this.pos.x + dirX[i], this.pos.y + dirY[i]);

      if (
        this.world.inRange(vizPos) &&
        this.world.color[vizPos.x][vizPos.y] != this.world.OBSTACLE &&
        this.world.taint[vizPos.x][vizPos.y] == this.world.UNEXPLORED
      ) {

        this.world.frontier(vizPos);
        this.parent[vizPos.x][vizPos.y] = this.pos;

        this.front.push({pos: vizPos, h: this.h(vizPos)});

      }

    }
  }

  chooseFrontier(){
    this.world.explore(this.pos);

    if (this.front.length == 0){
      this.stage = -1; 
      return;
    }

    this.front.sort((a, b) => a.h - b.h);
    let novaPos = this.front.shift().pos;
    this.pos = novaPos;
    this.world.pointer(novaPos);

    if (this.pos.x == this.world.food.x && this.pos.y == this.world.food.y){
      this.foundFood();
    }
  }

  reset(){
    this.path = Array();
    this.parent = Array(this.world.h).fill().map(() => Array(this.world.w).fill(-1));
    this.parent[this.pos.x][this.pos.y] = this.pos;
    this.start_pos = this.pos;
    
    this.front = [];
  }

}
