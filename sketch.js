var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var mario1, mario2, mario3, mario4, mario5, mario6, mario7, mario8, mario9, mario10;

var ground, invisibleGround, groundImage;
var cloud, cloudsGroup, cloudImage;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var goomba, goombarunning;

var score;

var gameOverImg, restartImg;
var jumpSound, checkPointSound, dieSound;

function preload() {

  groundImage = loadImage("assets/ground2.png");
  cloudImage = loadImage("assets/cloud.png");

  mario_running = loadAnimation("assets/mario_1.png", "assets/mario_4.png", "assets/mario_5.png", "assets/mario_6.png", "assets/mario_7.png", "assets/mario_8.png", "assets/mario_9.png", "assets/mario_10.png");
  mario_collided = loadImage("assets/mario_collided.png");

  //Obstáculos
  goombarunning = loadAnimation("assets/goomba1.png", "assets/goomba2.png");

  obstacle1 = loadImage("assets/obstacle1.png");
  obstacle2 = loadImage("assets/obstacle2.png");
  obstacle3 = loadImage("assets/obstacle3.png");
  obstacle4 = loadImage("assets/obstacle4.png");
  obstacle5 = loadImage("assets/obstacle5.png");
  obstacle6 = loadImage("assets/obstacle6.png");

  jumpSound = loadSound("assets/sound/jump.mp3");
  dieSound = loadSound("assets/sound/die.mp3");
  checkPointSound = loadSound("assets/sound/checkpoint.mp3");

  gameOverImg = loadImage("assets/gameOver.png")
  restartImg = loadImage("assets/restart.png")
}

function setup() {
  createCanvas(600, 200);

  mario = createSprite(50, 160, 20, 50);
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.scale = 0.5;

  // goomba = createSprite(200, 180, 20, 50);
  // goomba.addAnimation("goombarunning", goombarunning)
  // goomba.scale = 0.3

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;

  restart = createSprite(300, 140);
  restart.addImage(restartImg);
  restart.scale = 0.5;

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  //criar Grupos de Obstáculos e Nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  mario.setCollider("circle", 0, 0, 40);
  mario.debug = true

  score = 0;

}

function draw() {

  background("white");
  //exibir pontuação
  text("Pontuação: " + score, 500, 50);


  if (gameState === PLAY) {

    gameOver.visible = false;
    restart.visible = false;

    ground.velocityX = -(4 + 3 * score / 100)
    //pontuação
    score = score + Math.round(getFrameRate() / 60);

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play()
    }

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //pular quando barra de espaço é pressionada
    if (keyDown("space") && mario.y >= 160) {
      mario.velocityY = -12;
      jumpSound.play();
    }

    //adicionar gravidade
    mario.velocityY = mario.velocityY + 0.8

    //gerar as nuvens
    spawnClouds();

    //gerar obstáculos no chão
    spawnObstacles();

    if (obstaclesGroup.isTouching(mario)) {
      //trex.velocityY = -12;
      jumpSound.play();
      gameState = END;
      dieSound.play()

    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    //mudar a animação de trex
    mario.changeAnimation("collided", mario_collided);

    if (mousePressedOver(restart)) {
      reset();
    }

    ground.velocityX = 0;
    mario.velocityY = 0


    //definir tempo de vida dos objetos do jogo para que eles nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
  }

  //impedir que mario caia
  mario.collide(invisibleGround);

  drawSprites();
}

function reset() {
  gameState = PLAY
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  mario.changeAnimation("running", mario_running)
  score = 0
}



function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -(6 + 3*score/100);

    obstacle.debug = true

    // //gerar obstáculos aleatórios
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1: obstacle.addAnimation("goombarunning", goombarunning)
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
      default: break;
    }

    //atribuir escala e vida útil ao obstáculo          
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //escrever código aqui para gerar nuvens
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(4 + score/100);

    //atribuir tempo de vida à variável
    cloud.lifetime = 200;

    //ajustar a profundidade
    cloud.depth = mario.depth;
    mario.depth = mario.depth + 1;

    //acrescentar cada nuvem ao grupo
    cloudsGroup.add(cloud);
  }
}

