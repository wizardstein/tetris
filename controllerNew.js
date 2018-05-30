let _game;
var gameLoopHandle;
let possibleShapes = ["square","line","leftS","rightS","podium","lShapeR","lShapeL"];
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.rotateCW = function (c) {
  // x' =  x cos phi + y sin phi \ formula with pivot at (0, 0)
  // y' = -x sin phi + y cos phi /
  // phi = 90°                   insert phi
  // cos 90° = 0   sin 90° = 1   calculate cos and sin 
  // x' =  y                     \ formula with pivot at (0, 0)
  // y' = -x                     /
  // x' =  (cy - y) + cx         \ formula with different pivot needs correction 
  // y' = -(cx - x) + cy         /
  // y' = -cx + x + cy          /
  return new Point(
      c.x + c.y - this.y,
      c.y - c.x + this.x
  );
}

Point.prototype.rotateCCW = function (c) {
  // source: https://en.wikipedia.org/wiki/Rotation_(mathematics)#Two_dimensions
  // x' =  x cos phi + y sin phi  \ formula with pivot at (0, 0)
  // y' = -x sin phi + y cos phi  /
  // phi = -90°
  // cos -90° = 0   sin -90° = -1
  // x' = -y                      \ formula with pivot at (0, 0)
  // y' =  x                      /
  // x' = -(cy - y) + cx          \ formula with different pivot needs correction 
  // x' = -cy + y + cx            /
  // y' =  (cx - x) + cy         /
  return new Point(
      c.x - c.y + this.y,
      c.y + c.x - this.x
  );
}
let Shape = function(shapeStr){
  this.shapeStr = shapeStr;
  switch(shapeStr){
    case "lShapeR":
      this.body = [
        new Point(0,0),
        new Point(1,0),
        new Point(2,0),
        new Point(0,1)
      ];
      this.pivotPointIndex = 0;
      this.canRotate = true;
      this.color = "pink";
      break;
    case "lShapeL":
      this.body = [
        new Point(0,0),
        new Point(1,0),
        new Point(2,0),
        new Point(2,1)
      ];
      this.pivotPointIndex = 3;
      this.canRotate = true;
      this.color = "gray";
      break;
    case "line":
      this.body = [
        new Point(0,0),
        new Point(0,1),
        new Point(0,2),
        new Point(0,3)
      ];
      this.pivotPointIndex = 1;
      this.canRotate = true;
      this.color = "green";
      break;
    case "leftS":
      this.body = [
        new Point(0,2),
        new Point(0,1),
        new Point(1,1),
        new Point(1,0)
      ];
      this.pivotPointIndex = 2;
      this.canRotate = true;
      this.color = "lime";
      break;
    case "rightS":
      this.body = [
        new Point(1,2),
        new Point(1,1),
        new Point(0,1),
        new Point(0,0)
      ];
      this.pivotPointIndex = 2;
      this.canRotate = true;
      this.color = "yellow";
      break;
    case "podium":
      this.body = [
        new Point(0,0),
        new Point(1,0),
        new Point(2,0),
        new Point(1,1)
      ];
      this.pivotPointIndex = 1;
      this.canRotate = true;
      this.color = "brown";
      break;
    case "square":
    default:
      this.body = [
        new Point(0,0),
        new Point(0,1),
        new Point(1,1),
        new Point(1,0)
      ];
      this.canRotate = false;
      this.color = "red";
      break;
  }
  this.rotate = function(){
    if (!this.canRotate) return;

    for(let i=0; i<this.body.length; i++){
      this.body[i] = this.body[i].rotateCW(this.body[this.pivotPointIndex])
    }

  }
}



let TetrisBlock = function(shapeStr){
  this.stepsDown = 0;
  this.stepsRight = 0;
  this.shape = new Shape(shapeStr);
  this.getLowestSquare = function(){
    let lowestSquare;
    for (let i=0; i<this.shape.body.length;i++){
      let thisSquare = this.shape.body[i];
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
  this.containsPoint = function(point){
    for (let i = 0; i<this.shape.body.length; i++){
      if (this.shape.body[i].x === point.x && this.shape.body[i].y === point.y) return true;
    }
    return false;
  }
  this.cloneShape = function(){
    let clonedShape = new Shape(this.shape.shapeStr);
    let nonPoints = JSON.parse(JSON.stringify(this.shape.body));
    let actualPoints = [];
    for (let i = 0; i<nonPoints.length; i++){
      actualPoints.push(new Point(nonPoints[i].x, nonPoints[i].y));
    }
    clonedShape.body = actualPoints;
    return clonedShape;
  }

  


  this.rotate = function(){
    this.shape.rotate();

  }
  
  this.moveDown = function(){
    
    for (let i=0; i<this.shape.body.length;i++){
      this.shape.body[i].y++;
    }
    this.stepsDown++;

  }
  
  this.moveLeft = function(){
    
    for (let i=0; i<this.shape.body.length;i++){
      this.shape.body[i].x--;
    }
    this.stepsRight--;

  }
  
  this.moveRight = function(){
    
    for (let i=0; i<this.shape.body.length;i++){
      this.shape.body[i].x++;
    }
    this.stepsRight++;

  }
  
}
let getLeftMostSquare = function(body){
  let leftMostsquare;
  for (let i=0; i<body.length;i++){
    let thisSquare = body[i];
    if (!leftMostsquare) {
      leftMostsquare = thisSquare;
    } else {
      if (leftMostsquare.x > thisSquare.x){
        leftMostsquare = thisSquare;
      }
    }
    
  }
  
  return leftMostsquare;
}

let getRightMostSquare = function(body){
  let rightMostSquare;
  for (let i=0; i<body.length;i++){
    let thisSquare = body[i];
    if (!rightMostSquare) {
      rightMostSquare = thisSquare;
    } else {
      if (rightMostSquare.x < thisSquare.x){
        rightMostSquare = thisSquare;
      }
    }
    
  }
  //console.log(rightMostSquare);
  return rightMostSquare;
}

let TetrisGame = function(){
  this.board = [];
  this.score = 0;
  this.speed = 1000;
  this.ended = false;
  this.boardSizeY = 40;
  this.boardSizeX = 20;
  this.manager = {};
  this.fallingBlock = new TetrisBlock(possibleShapes[getRandomInt(0,possibleShapes.length-1)]);
  this.blocksFallen = [];
}

TetrisGame.prototype.init = function(options){
  options = options || {};
  this.boardSizeY = options.boardSizeY || 20;
  this.boardSizeX = options.boardSizeX || 20;

  
}

TetrisGame.prototype.generateBoard = function(){
  this.board = [];
  for (let i=0;i<this.boardSizeY;i++){
    let boardRow=[];
    for (let j = 0; j < this.boardSizeX; j++) {
      let hadBlock = false;
      for (let k = 0; k<this.fallingBlock.shape.body.length;k++){
        if(this.fallingBlock.shape.body[k].y == i &&
          this.fallingBlock.shape.body[k].x == j) {
            boardRow.push(this.fallingBlock.shape.color);
            hadBlock = true;
          }
      }
      for (let l = 0; l<this.blocksFallen.length;l++){
        for (let k = 0; k<this.blocksFallen[l].shape.body.length;k++){
        if(this.blocksFallen[l].shape.body[k].y == i &&
          this.blocksFallen[l].shape.body[k].x == j) {
            boardRow.push(this.blocksFallen[l].shape.color);
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
function outOfBoundsDownOrIsBlock(game,tetrisBody){
  game.generateBoard();
  let gameBoard = game.board;
  for (let i = 0; i<tetrisBody.length;i++){
    let tetrisBlock = tetrisBody[i];
    for(let j = 0; j<gameBoard.length;j++){
      for(let k = 0; k<gameBoard[j].length;k++){
        let gameBlock = gameBoard[j][k];
        if (gameBlock) {
          let blockPoint = {x:k,y:j}
          if(!game.fallingBlock.containsPoint(blockPoint)){
            if (tetrisBlock.x == blockPoint.x && tetrisBlock.y == blockPoint.y) return true;
          }
        }
      }
    }
  };
  return game.fallingBlock.getLowestSquare().y == game.boardSizeY - 1;

}
function haveCollision(game,tetrisBody){
  game.generateBoard();
  let fallenBlocks = game.blocksFallen;
  // left edge
  if (getLeftMostSquare(tetrisBody).x < 0) return true;
  // right edge
  if (getRightMostSquare(tetrisBody).x == game.boardSizeX) return true;

  // fallenBlocks
  for (let i = 0; i<tetrisBody.length;i++){
    let tetrisBlock = tetrisBody[i];
    for(let j = 0; j<fallenBlocks.length;j++){
      let thisFallenBlock = fallenBlocks[j];
      for (let k=0;k<thisFallenBlock.shape.body.length;k++){
        let fallenBlockPoint = thisFallenBlock.shape.body[k];
        if (tetrisBlock.x == fallenBlockPoint.x && tetrisBlock.y == fallenBlockPoint.y) return true;
      }
      
    }
  }

  return false;
}
TetrisGame.prototype.rotateIfCan = function(){
  if (!this.fallingBlock.shape.canRotate) return;
  let rawBlock = new TetrisBlock(this.fallingBlock.shape.shapeStr);
  rawBlock.shape = this.fallingBlock.cloneShape();
  rawBlock.rotate();
  if (!haveCollision(this,rawBlock.shape.body)) this.fallingBlock.rotate();

}

TetrisGame.prototype.moveLeftIfCan = function(){
  let rawBlock = new TetrisBlock(this.fallingBlock.shape.shapeStr);
  rawBlock.shape = this.fallingBlock.cloneShape();
  rawBlock.moveLeft();

  if (!haveCollision(this,rawBlock.shape.body)) this.fallingBlock.moveLeft();

}
TetrisGame.prototype.generateNewBlockOrGameOver = function(){
  

  this.fallingBlock = new TetrisBlock(possibleShapes[getRandomInt(0,possibleShapes.length-1)]);

  if (haveCollision(this,this.fallingBlock.shape.body)) {
    this.ended = true;
  } else {
    this.score++;
    this.generateBoard();
    let lineCount = 0;
    for (let i=0; i<this.board.length;i++){
      let boardLine = this.board[i];
      let pointCountPerLine = 0;
      console.log(boardLine);
      for (let j=0;j<boardLine.length;j++) {
        let blockPoint = boardLine[j];
        if (blockPoint !== 0 && typeof blockPoint === "string") pointCountPerLine++;
      }
      
      if (pointCountPerLine === boardLine.length) {
        lineCount++;
        for (let k=0;k<this.blocksFallen.length;k++){
          let thisFallenBlock = this.blocksFallen[k];
          for (let p = 0; p<thisFallenBlock.shape.body.length;p++){
            let thisFallenBlockPoint = thisFallenBlock.shape.body[p];
            if(thisFallenBlockPoint.y === i) {
              thisFallenBlock.shape.body.splice(p,1,{dummy:true});
            }
          }
        }

        for (let k=0;k<this.blocksFallen.length;k++){
          let thisFallenBlock = this.blocksFallen[k];
          for (let p = 0; p<thisFallenBlock.shape.body.length;p++){
            let thisFallenBlockPoint = thisFallenBlock.shape.body[p];
            if(thisFallenBlockPoint.y < i) {
              thisFallenBlockPoint.y++;
            }
          }
        }
      }
    }
    //
    //  currentline = lastline
    //  while (currentline > -1){
    //    if (currentline empty) && (fallen blocks pieces present above){
    //      shift_board_above_currentline
    //      do_housekeep 
    //    }else{
    //      currentline--   
    //    }    
    //  }
    //
    if (lineCount) this.score += lineCount * 10;
    if (lineCount == 4) this.score += 40;
    this.generateBoard();
  }
 
}

TetrisGame.prototype.teleportDown = function(){
  let movedDown = this.moveDownOrNewBlock();
  while (movedDown) {
    movedDown = this.moveDownOrNewBlock();
  }
}

TetrisGame.prototype.moveDownOrNewBlock = function(){
  
  let rawBlock = new TetrisBlock(this.fallingBlock.shape.shapeStr);
  rawBlock.shape = this.fallingBlock.cloneShape();
  rawBlock.moveDown();

  if (outOfBoundsDownOrIsBlock(this,rawBlock.shape.body)) {
    rawBlock = new TetrisBlock(this.fallingBlock.shape.shapeStr);
    rawBlock.shape = this.fallingBlock.cloneShape();
    this.blocksFallen.push(rawBlock);
    return this.generateNewBlockOrGameOver();
  }

  if (!haveCollision(this,rawBlock.shape.body)) {
    this.fallingBlock.moveDown();
    return true;
  }

  
  
}

TetrisGame.prototype.moveRightIfCan = function(){
  let rawBlock = new TetrisBlock(this.fallingBlock.shape.shapeStr);
  rawBlock.shape = this.fallingBlock.cloneShape();
  rawBlock.moveRight();

  if (!haveCollision(this,rawBlock.shape.body)) this.fallingBlock.moveRight();

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
    let rowDiv = document.createElement("div");
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
      rowDiv.appendChild(whichDiv);
    
    }

    el.appendChild(rowDiv);
  }
}

function generateDomListener(game){
  return function(event){
    switch (event.key) {
      case "ArrowUp":
        game.rotateIfCan();
        game.generateBoard();
        updateDOM(game);
        break;
      case "ArrowDown":
        game.teleportDown();
        game.generateBoard();
        updateDOM(game);
        break;
      case "ArrowLeft":
        game.moveLeftIfCan();
        game.generateBoard();
        updateDOM(game);
        break;
      case "ArrowRight":
        game.moveRightIfCan();
        game.generateBoard();
        updateDOM(game);
        break;
    }
  }
}
function refreshInterval(game){
  clearInterval(gameLoopHandle);
  gameLoopHandle = setInterval(gameLoop(game), game.speed);
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
      if (!game.ended) {
        game.generateBoard();
        updateDOM(game);
      }
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
