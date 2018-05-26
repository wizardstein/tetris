let _game;
var gameLoopHandle;
let possibleShapes = ["square","line","leftS","rightS","podium"];
let shapeRotationMap = {
  "line0": [
    {x:0, y:0},      
    {x:0, y:1},
    {x:0, y:2},
    {x:0, y:3},
   ],
   "line1": [
    {x:0, y:0},      
    {x:1, y:0},
    {x:2, y:0},
    {x:3, y:0},
   ],
   "leftS0": [
      {x:0, y:0},      
      {x:1, y:0},
      {x:1, y:1},
      {x:2, y:1},
    ],
   "leftS1": [
      {x:0, y:1},      
      {x:0, y:2},
      {x:1, y:0},
      {x:1, y:1},
    ],
   "rightS0": [
      {x:0, y:1},      
      {x:1, y:1},
      {x:1, y:0},
      {x:2, y:0},
    ],
   "rightS1": [
      {x:0, y:0},      
      {x:0, y:1},
      {x:1, y:1},
      {x:1, y:2},
    ],
    "podium0": [
      {x:0, y:1},      
      {x:1, y:0},
      {x:1, y:1},
      {x:1, y:2},
    ],
    "podium1": [
      {x:0, y:0},      
      {x:1, y:0},
      {x:1, y:1},
      {x:2, y:0},
    ],
    "podium2": [
      {x:0, y:0},      
      {x:0, y:1},
      {x:0, y:2},
      {x:1, y:1},
    ],
    "podium3": [
      {x:0, y:1},      
      {x:1, y:0},
      {x:1, y:1},
      {x:2, y:1},
    ]
   
   
}
shapeRotationMap["line2"] = shapeRotationMap["line0"];
shapeRotationMap["line3"] = shapeRotationMap["line1"];
shapeRotationMap["leftS2"] = shapeRotationMap["leftS0"];
shapeRotationMap["leftS3"] = shapeRotationMap["leftS1"];
shapeRotationMap["rightS2"] = shapeRotationMap["rightS0"];
shapeRotationMap["rightS3"] = shapeRotationMap["rightS1"];

["square0", "square1", "square2","square3"].forEach(function(key){
  shapeRotationMap[key] = [
        {x:0, y:0},      
        {x:0, y:1},
        {x:1, y:0},
        {x:1, y:1},
      ];
})
let TetrisBlock = function(shapeStr){
  this.rotation = 0; // 0, 1, 2, 3;
  this.stepsDown = 0;
  this.shape = shapeStr;
  this.body = shapeRotationMap[shapeStr+this.rotation];
  switch(shapeStr){
    case "line":
      this.color = "green";
      break;
    case "podium":
      this.color = "brown";
      break;
    case "leftS":
      this.color = "lime";
      break;
    case "rightS":
      this.color = "yellow";
      break;
    case "square":
    default:
      this.color = "red";
      break;
  }
  this.getLowestSquare = function(){
    let lowestSquare;
    for (let i=0; i<this.body.length;i++){
      let thisSquare = this.body[i];
      if (!lowestSquare) {
        lowestSquare = thisSquare;
      } else {
        if (thisSquare.y > lowestSquare.y){
          lowestSquare = thisSquare;
        }
      }
      
    }
    
    return lowestSquare;
  }

  this.rotate = function(){
    this.rotation = this.rotation == 3 ? 0 : this.rotation + 1;
    this.body = shapeRotationMap[shapeStr+this.rotation];
  }
  
  this.moveDown = function(){
    
    for (let i=0; i<this.body.length;i++){
      let thisSquare = this.body[i];
      thisSquare.x++;
    }
    this.stepsDown++;
  }
  
  this.moveLeft = function(){
    
    for (let i=0; i<this.body.length;i++){
      let thisSquare = this.body[i];
      thisSquare.y--;
    }
  }
  
  this.moveRight = function(){
    
    for (let i=0; i<this.body.length;i++){
      let thisSquare = this.body[i];
      thisSquare.y++;
    }
  }
  
}

let TetrisGame = function(){
  this.board = [];
  this.score = 0;
  this.speed = 1000;
  this.ended = false;
  this.boardSizeX = 40;
  this.boardSizeY = 20;
  this.manager = {};
  this.fallingBlock = new TetrisBlock(possibleShapes[getRandomInt(0,possibleShapes.length-1)]);
  this.blocksFallen = [];
}

TetrisGame.prototype.init = function(options){
  options = options || {};
  this.boardSizeX = options.boardSizeX || 40;
  this.boardSizeY = options.boardSizeY || 20;

  
}

TetrisGame.prototype.generateBoard = function(){
  this.board = [];
  for (let i=0;i<this.boardSizeX;i++){
    let boardRow=[];
    for (let j = 0; j < this.boardSizeY; j++) {
      let hadBlock = false;
      for (let k = 0; k<this.fallingBlock.body.length;k++){
        if(this.fallingBlock.body[k].x == i &&
          this.fallingBlock.body[k].y == j) {
            boardRow.push(this.fallingBlock.color);
            hadBlock = true;
          }
      }
      for (let l = 0; l<this.blocksFallen.length;l++){
        for (let k = 0; k<this.blocksFallen[l].body.length;k++){
        if(this.blocksFallen[l].body[k].x == i &&
          this.blocksFallen[l].body[k].y == j) {
            boardRow.push(this.blocksFallen[l].color);
            hadBlock = true;
          }
        }
      }
      
      if (!hadBlock)
        boardRow.push(0);
    }
    this.board.push(boardRow);
  }
}

TetrisGame.prototype.setSpeed = function(speed){
  this.speed = speed;
}

TetrisGame.prototype.setScore = function(score){
  this.score = score;
}
function outOfBoundsDown(game,tetrisBody){
  game.generateBoard();
  let gameBoard = game.board;
  for (let i = 0; i<tetrisBody.length;i++){
    let tetrisBlock = tetrisBody[i];
    if (tetrisBlock.x > game.boardSizeX) return true;
  };
  return false;
}
function haveCollision(game,tetrisBody){
  game.generateBoard();
  let gameBoard = game.board;
  for (let i = 0; i<tetrisBody.length;i++){
    let tetrisBlock = tetrisBody[i];
    if (tetrisBlock.x <0) return true;
    if (tetrisBlock.y <0 || tetrisBlock.y > game.boardSizeY) return true;
    for(let j = 0; j<gameBoard.length;j++){
      for(let k = 0; k<gameBoard[i].length;k++){
        let gameBlock = gameBoard[i][j];
        if (gameBlock) {
          if (tetrisBlock.x == gameBlock.x && tetrisBlock.y == gameBlock.y) return true;
        }
      }
    }
  };
  return false;
}
TetrisGame.prototype.rotateIfCan = function(){
  let rawBlock = new TetrisBlock(this.fallingBlock.shape);
  let rotationDegree = this.fallingBlock.rotation == 3 ? 0 : this.fallingBlock.rotation + 1;
  rawBlock.rotate();
  let rawBlockRotated = rawBlock;
  for (let i = 0; i< rawBlockRotated.body.length;i++){
    rawBlockRotated.body[i].x += this.fallingBlock.stepsDown;
  }
  if (!haveCollision(this,rawBlockRotated.body)) this.fallingBlock.rotate();

}

TetrisGame.prototype.moveLeftIfCan = function(){
  let rawBlock = new TetrisBlock(this.fallingBlock.shape);
  for (let i = 0; i< rawBlock.body.length;i++){
    rawBlock.body[i].x += this.fallingBlock.stepsDown;
  }
  rawBlock.moveLeft();

  if (!haveCollision(this,rawBlock.body)) this.fallingBlock.moveLeft();

}
TetrisGame.prototype.generateNewBlockOrGameOver = function(){
  this.fallingBlock = new TetrisBlock(possibleShapes[getRandomInt(0,possibleShapes.length-1)]);

  if (haveCollision(this,this.fallingBlock))
    this.ended = true;

}

TetrisGame.prototype.moveDownOrNewBlock = function(){
  console.log(this.fallingBlock.shape);
  console.log(this.fallingBlock.rotation);
  let rawBlock = new TetrisBlock(this.fallingBlock.shape);
  for (let i = 0; i< rawBlock.body.length;i++){
    rawBlock.body[i].x += this.fallingBlock.stepsDown;

  }
  rawBlock.moveDown();

  if (!haveCollision(this,rawBlock.body)) this.fallingBlock.moveDown()
  else if (outOfBoundsDown(this,rawBlock.body)) {
    rawBlock = new TetrisBlock(this.fallingBlock.shape);
    for (let i = 0; i< rawBlock.body.length;i++){
      rawBlock.body[i].x += this.fallingBlock.stepsDown;

    }
    this.blocksFallen.push(rawBlock);
    this.generateNewBlockOrGameOver();
    
  }
}

TetrisGame.prototype.moveRightIfCan = function(){
  let rawBlock = new TetrisBlock(this.fallingBlock.shape);
  for (let i = 0; i< rawBlock.body.length;i++){
    rawBlock.body[i].x += this.fallingBlock.stepsDown;
    rawBlock.body[i].y += this.fallingBlock.stepsDown;
  }
  rawBlock.moveRight();

  if (!haveCollision(this,rawBlock.body)) this.fallingBlock.moveRight();

}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let genericDiv = function(color){
  let returnDiv = document.createElement("div");
  returnDiv.style.height = "10px";
  returnDiv.style.width = "10px";
  returnDiv.style.background = color;

  return returnDiv;
}



let emptyDiv = function(){
  return genericDiv("black");
}

function updateDOM(game) {
  var el = document.getElementById("gameboard");
  el.innerHTML = "";
  el.style.position = "relative";
  var scoreEl = document.getElementById("score");
  scoreEl.innerText = game.score;


  for (let i =0;i<game.board.length;i++){
    let snakeRowDiv = document.createElement("div");
    //snakeRowDiv.style.position = "absolute";
    for (let j=0;j<game.board[i].length;j++){
      if (game.board[i][j]){
        whichDiv = genericDiv(game.board[i][j]);
      } else {
        whichDiv = emptyDiv();
      }
       
      whichDiv.style.position = "absolute";
      whichDiv.style.left = j * (parseInt(whichDiv.style.width)) + "px";
      whichDiv.style.top = (i * (parseInt(whichDiv.style.height)) + 100)  + "px";
      snakeRowDiv.appendChild(whichDiv);
    
    }

    el.appendChild(snakeRowDiv);
  }
}

function generateDomListener(game){
  return function(event){
    switch (event.key) {
      case "ArrowUp":
        game.rotateIfCan();
        break;
      case "ArrowDown":
        game.moveDownOrNewBlock();
        break;
      case "ArrowLeft":
        game.moveLeftIfCan();
        
        break;
      case "ArrowRight":
        game.moveRightIfCan();
        break;
    }
  }
}

function decreaseDifficulty(game){
  if (game.speed <= 900) {
    game.speed += 50;
  }
  clearInterval(gameLoopHandle);
  gameLoopHandle = setInterval(gameLoop(game), game.speed);
}
function restart(game){
  game.ended = false;
  game.genApple = true;
  game.score = 0;
  game.speed = 500;
  game.apple = {x:null,y:null}

  game.snake.body = [
    {x:9,y:8},
    {x:9,y:9},
    {x:9,y:10},
    {x:9,y:11},
  ]
  game.snake.going = "RIGHT";

  clearInterval(gameLoopHandle);
  gameLoopHandle = setInterval(gameLoop(game), game.speed);
  
}
function increaseDifficulty(game){
  if (game.speed >= 100) {
    game.speed -= 50;
  }
  clearInterval(gameLoopHandle);
  gameLoopHandle = setInterval(gameLoop(game), game.speed);
}

function gameLoop(game){
  return function(){
    if (!game.ended) {
      game.moveDownOrNewBlock();
      game.generateBoard();
      updateDOM(game);
    } else {
      clearInterval(gameLoopHandle);
      alert ("GAME OVER");
    }
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  var game = new TetrisGame();
  _game =game;
  game.init();
  game.generateBoard()
  updateDOM(game);
  document.addEventListener("keydown", generateDomListener(game));

  gameLoopHandle = setInterval(gameLoop(game), game.speed);
})
