var PLAY = 1;
var END = 0;
var gameState = PLAY;
var mario1,mario2,mario3,mario4,mario5,mario6,mario7,mario8,mario9,mario10,mario_running
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var goombarunning
var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var goomba
var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  jumpSound = loadSound("jump.mp3")
  groundImage = loadImage("ground2.png");
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkpoint.mp3")
  cloudImage = loadImage("cloud.png");
  mario_running = loadAnimation("mario_1.png","mario_2.png","mario_3.png")
  goombarunning = loadAnimation("goomba1.png","goomba2.png")
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOver = loadImage("gameOver.png")
  restart = loadImage("restart.png")
}

function setup() {
  createCanvas(600, 200);

  var message = "Esta é uma mensagem";
  
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", mario_running);
  trex.addAnimation("collided", trex_collided);
  goomba = createSprite(200,180,20,50);
  goomba.addAnimation("goombarunning",goombarunning)
  goomba.scale = 0.3

  trex.scale = 0.5;
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  console.log(message)
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //criar Grupos de Obstáculos e Nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("circle",0,0,40);
  trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background("white");
  //exibir pontuação
  text("Pontuação: "+ score, 500,50);
  
  
  if(gameState === PLAY){

   gameOver.visible = false;
   restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //pontuação
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //pular quando barra de espaço é pressionada
    if(keyDown("space")&& trex.y >= 160) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no chão
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
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
      trex.changeAnimation("collided", trex_collided);
    
      if(mousePressedOver(restart)) {
        reset();
      }
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //definir tempo de vida dos objetos do jogo para que eles nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //impedir que trex caia
  trex.collide(invisibleGround);
  



  drawSprites();
}

function reset(){
  gameState = PLAY
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running)
  score = 0 
}



function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(400, 165, 10, 40);
    obstacle.velocityX = -6;
    obstacle.addAnimation("goombarunning",goombarunning)
    obstacle.debug = true 

    // //gerar obstáculos aleatórios
    var rand = Math.round(random(1, 6));
    // switch (rand) {
    //   case 1: obstacle.addAnimation(goombarunning);
    //     break;
    //   case 2: obstacle.addImage(obstacle2);
    //     break;
    //   case 3: obstacle.addImage(obstacle3);
    //     break;
    //   case 4: obstacle.addImage(obstacle4);
    //     break;
    //   case 5: obstacle.addImage(obstacle5);
    //     break;
    //   case 6: obstacle.addImage(obstacle6);
    //     break;
    //   default: break;
    // }

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
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribuir tempo de vida à variável
    cloud.lifetime = 200;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //acrescentar cada nuvem ao grupo
    cloudsGroup.add(cloud);
  }
}

