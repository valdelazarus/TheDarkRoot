//Global variables
//CONSTANTS
const KEYCODE_W = 87;
const KEYCODE_A = 65;
const KEYCODE_S = 83;
const KEYCODE_D = 68;
const PLAYER_SPEED = 3;
const BULLET_SPEED = 10;
const PLAYER_HEALTH = 10;

//MAIN
var canvas = document.getElementById('game-canvas');
var stage;
var version = '1.0.0';

var preloader = new Preloader();
var fakeProgress = 0;
var loadInterval; 

var keyboardMoveLeft = false, keyboardMoveRight = false, keyboardMoveUp = false, keyboardMoveDown = false;

var player;
var aimIndicator;

var playerAtkSpd = 1; //can be changed with pickups
var playerAimAngle = 0;  //changing depending on mouse position 
var playerShootInterval = 1; //in seconds, changing based on weapon equipped
var playerSpecialAtkInterval = 3; //in seconds, changing based on weapon equipped 
var playerDmg = 2;

var gameOver = false;
var nextLevel = false;

//OTHERS
var totalOfBlocks = 5;
var blocks = [];

var enemies = [];
var enemySpd = 2; //changing depending on the level - will be used with chasing behavior codes
var enemyTotal = 3; //changing depending on the level
var waveSpawnInterval = 3; //changing depending on the level
var enemySpawner = new EnemySpawner(enemyTotal);

var boss;
var bossSpd = 1;
var bossDmg = 3;
var bossHealth = 50;
var bossAtkInterval = 1;
var bossMinionsNumber = 1;
var bossWaveSpawnInterval = 5;
var bossSpawned = true;

var meleeDmg = 1;
var meleeAtkInterval = 1;

var rangedDmg = 2; 
var rangedAtkSpd = 1; 
var shootAtkInterval = 3;

var enemySpawnInterval; 

var bullets = [];

//HUD
var healthBarObj;
var timerObj;
var timerMaxTimer = 10; 

//Function calls
init();

/*SYSTEM SPECIFIC*/
function init(){
    stage = new createjs.Stage(canvas);
    
    //set up auto-update on stage
    createjs.Ticker.framerate = 60;
    createjs.Ticker.on('tick',update);
    
    retinalize();
    
    intialLog();
    
    /*LOADING SCREEN*/
        createGameTitle();
        createCopyrightText();
        //preloader jobs
        preloader.createLoadingBar(canvas.width/4,20,canvas.width/2,canvas.height/2);
        preloader.installSoundPlugin();
        preloader.addFile("Player", "images/player.png");
        preloader.addFile("Boss", "images/enemy.png");
        preloader.addFile("Melee", "images/melee.png");
        preloader.addFile("Ranged", "images/ranged.png");
        preloader.addFile("Projectile", "images/playerBullet.png");
        preloader.addFile("AimIndicator", "images/aimIndicator.png");
        preloader.addFile("Normal Shoot", "sound/shoot1.wav");
        preloader.addFile("Special Shoot", "sound/shoot2.wav");
        preloader.addFile("Background1","sound/EpicTheme.mp3");
        preloader.loadFiles();

        //NOTE:--to be used with real loading progress
            //preloader.queue.on('progress', updateLoadingBar); 
            //preloader.queue.on('complete',restartGame);

        //register sounds - use preloader above instead
//        registerSound("sound/shoot1.wav","Normal Shoot");
//        registerSound("sound/shoot2.wav","Special Shoot");

        loadInterval = setInterval(updateLoadingBar, 50);
    
    //start game
    //restartGame();
    
    window.addEventListener("click", resumeAudioContext);
}
function update(){
    //handle game over
    if (gameOver){
        stopGame("Game Over!");
        return; 
    }
    
    if (nextLevel){
        stopGame("Level 1 Finished!");
        return;
    }
    
    stage.update();
    
//    //make sure boss is always rendered on top of other objects in scene
    if(boss != undefined){
        stage.setChildIndex(boss, stage.numChildren-1);
    }
    
    runEnemyBehavior();
    runBulletBehavior();
//    if (boss != undefined){
//        if (boss.health <= 5){
//            boss.startChasing = true;
//        }
//    }
    if (healthBarObj != undefined && player != undefined && !gameOver){
        healthBarObj.currentValue = player.health;
    }
    
    if (timerObj != null && player != undefined && !gameOver && timerObj.seconds <= 0){
        clearInterval(enemySpawnInterval);
        spawnBoss();
    }
}
//for retina display 
function retinalize(){
    stage.width = canvas.width;
    stage.height = canvas.height;

    let ratio = Window.devicePixelRatio;
    if (ratio === undefined){
    return;
    }

    canvas.setAttribute('width', Math.round(stage.width * ratio));
    canvas.setAttribute('height', Math.round(stage.height * ratio));

    stage.scaleX = stage.scaleY = ratio;

    //set CSS style
    canvas.style.width = stage.width + "px";
    canvas.style.height = stage.height + "px";
}
function intialLog(){
    console.log(`Welcome to the game. Version ${version}`);
}
/* HANDLE AUDIO CONTEXT FOR AUTOPLAY POLICY ON CHROME AND SAFARI*/
function resumeAudioContext(){
    // handler for fixing suspended audio context in Chrome
    try {
        if (createjs.WebAudioPlugin.context && createjs.WebAudioPlugin.context.state === "suspended") {
            createjs.WebAudioPlugin.context.resume();
            // Should only need to fire once
            window.removeEventListener("click", resumeAudioContext);
        }
    } catch (e) {
        // SoundJS context or web audio plugin may not exist
        console.error("There was an error while trying to resume the SoundJS Web Audio context...");
        console.error(e);
    }
}
/*KEYBOARD EVENT HANDLER*/
function handleKeyBoardEvent(){
    //handle keyboard event
    window.onkeyup = keyUpHandler;
    window.onkeydown = keyDownHandler;
}
function keyDownHandler(e){ //when key is pressed
    switch(e.keyCode){
        case KEYCODE_A:
            keyboardMoveLeft = true;
            break;
        case KEYCODE_D:
            keyboardMoveRight = true;
            break;
        case KEYCODE_W:
            keyboardMoveUp = true;
            break;
        case KEYCODE_S:
            keyboardMoveDown = true;
            break;    
    }
}
function keyUpHandler(e){ // when key is released
    switch(e.keyCode){
        case KEYCODE_A:
            keyboardMoveLeft = false;
            break;
        case KEYCODE_D:
            keyboardMoveRight = false;
            break;
        case KEYCODE_W:
            keyboardMoveUp = false;
            break;
        case KEYCODE_S:
            keyboardMoveDown = false;
            break;
    }
}
/*MOUSE EVENT HANDLER*/
function mouseClickHandler(e){
    //Shoot projectiles
    //console.log('Shoot');
    player.shootBehavior.performAtk(player);
}
function rightMouseClickHandler(e){
    player.shootBehavior.performSpecialAtk(player);
    e.preventDefault(); //hide popup menu
}
function mouseMoveHandler(e){
    var mouseX = e.stageX;
    var mouseY = e.stageY;

    player.aimAngle = Math.atan2(mouseY-player.y,mouseX-player.x) / Math.PI * 180;
    
    //rotate aimIndicator accordingly 
    aimIndicator.setTransform(aimIndicator.x,aimIndicator.y,1,1,player.aimAngle+90);
}
/*LOADING BAR*/
function updateLoadingBar(){
    fakeProgress += .005;
    
    preloader.loadingBar.graphics.beginFill("#666");
        
    preloader.loadingBar.graphics.drawRect(0, 0, preloader.loadingBar.getBounds().width *               fakeProgress, preloader.loadingBar.getBounds().height);

    preloader.loadingBar.graphics.endFill();

    preloader.loadingBar.graphics.setStrokeStyle(2);
    preloader.loadingBar.graphics.beginStroke("#000");

    preloader.loadingBar.graphics.drawRect(0, 0, preloader.loadingBar.getBounds().width,                   preloader.loadingBar.getBounds().height);

    preloader.loadingBar.graphics.endStroke();
    
    if (fakeProgress >= 1){
        clearInterval(loadInterval);
        restartGame();
    }
}
/*GAME SPECIFIC*/
function restartGame(){
    //mouse and keyboard handler
    //stage.on('stagemousedown', mouseClickHandler);
    
    document.onclick = mouseClickHandler; //left click
    document.oncontextmenu = rightMouseClickHandler; //right click
    stage.on('stagemousemove', mouseMoveHandler) //mouse move
    
    handleKeyBoardEvent();
    
    stage.removeAllChildren();
    
    //testing codes
//    drawRect('#666', 100, 50, 100, 50);
//    drawCircle('#fff', 50, 100, 200);
//    drawImage('images/player.png', .5, 500, 300);
    
    populateLevel();
    
    createPlayer();
    
    createHealthBar();
    createTimer();
    
    playSound("Background1",.5);
}
function createPlayer(){
//    player = new Player(drawImage("images/player.png", .5, 500, 300), PLAYER_SPEED, playerAtkSpd, playerAimAngle, playerShootInterval, playerSpecialAtkInterval);
//    
    player = new Player(drawPreloadedImage(preloader.queue.getResult("Player"), .5, 500, 300), PLAYER_SPEED, playerAtkSpd, playerAimAngle, playerShootInterval, playerSpecialAtkInterval, PLAYER_HEALTH, playerDmg);
    
    createAimIndicator();
}
function createAimIndicator(){
    //create aim indicator object and attach to player
//    aimIndicator = new GameObject(drawImage('images/aimIndicator.png', .5, 0, 0));
//    player.addChild(aimIndicator);
    aimIndicator = new GameObject(drawPreloadedImage(preloader.queue.getResult("AimIndicator"), .5, 0, 0));
    player.addChild(aimIndicator);
    //setting local positions for rotating point (parent object)
    aimIndicator.x = 33;
    aimIndicator.y = 30;
    //setting child local position offset
    aimIndicator.graphic.x = -13;
    aimIndicator.graphic.y = -60;
}
//this functions will create all level objects and calling spawning function of enemies 
function populateLevel(){
    //generateRandomBlocks('#000', totalOfBlocks);
    //generateBlocks();
    
    //testing code
//    var enemy = new Enemy(drawImage('images/enemy.png', .5, 700, 200), enemySpd);
//    enemies.push(enemy);
    
     //for TESTING ONLY
    spawnEnemies();
    enemySpawnInterval = setInterval(spawnEnemies, waveSpawnInterval* 1000);
}

function generateBlocks(){
    var block = new GameObject(drawRect('#000', stage.canvas.width, 100, stage.canvas.width/2, 25));
    blocks.push(block);
    block = new GameObject(drawRect('#000', stage.canvas.width, 100, stage.canvas.width/2, stage.canvas.height - 25));
    blocks.push(block);
}
/* GAME LOGIC */
function spawnEnemies(){
    enemySpawner.spawnRandom();
}
function spawnBoss(){
    if (bossSpawned){
        boss = new Boss1(drawPreloadedImage(preloader.queue.getResult("Boss"), .7, 700, 300),bossSpd,bossDmg,bossHealth,bossAtkInterval,bossMinionsNumber,bossWaveSpawnInterval);
        
        enemies.push(boss);
        
        bossSpawned = false;
    }
}
function runEnemyBehavior(){
    for (var i =0; i<enemies.length; ++i){
        
        handleCollisionSprSpr(player, enemies[i]);
        
        if ((enemies[i].type == "Melee")||(enemies[i].type == "Boss 1") ){
            if (checkCollisionSprSpr(player, enemies[i])){
                enemies[i].atkCounter++;
                enemies[i].dealMeleeDamage();
                
            } 
        }
        
        else if (enemies[i].type == "Ranged"){
            if (enemies[i].chaseBehavior.distance <= enemies[i].minDistance){
                enemies[i].speed = 0;
                enemies[i].shootBehavior.performAtk(enemies[i]);
            } else {
                enemies[i].speed = enemies[i].temp;
            }
        }
    }
}
function runBulletBehavior(){
    for (var i=0; i<bullets.length; ++i){
        if (bullets[i].source.type === 'Ranged'){
            if (checkCollisionSprSpr(bullets[i],player)){
                bullets[i].hitPlayer();
                stage.removeChild(bullets[i]);
                bullets.splice(i,1);
            }
        } else if (bullets[i].source.type === 'Player'){
            bullets[i].hitEnemy();
        }
    }
}
//generate random blocks - but due to a bug in collision with these blocks- for now don't use this
function generateRandomBlocks(color, total){
    var nextX = 0, nextY = 0, maxGap = 100;
    var maxWidth = 200, maxHeight = 200;
    
    for (var i=0; i< total; ++i){
        var width = Math.random()* maxWidth + 100; //[100, 300)
        var height = Math.random()* maxHeight + 100; //[100, 300)
        var gap = Math.random()* maxGap + 100; //[100, 300)
        
        var block = new GameObject(drawRect(color, width, height, nextX, nextY));
        restrictToGameSpaceForRect(block);
        
        blocks.push(block);
        
        nextX = Math.random() * stage.canvas.width + gap;
        nextY = Math.random() * stage.canvas.height + gap;
    }
}
/*FOR LOADING SCREEN*/
function createGameTitle(){
    var title = drawText("The Dark Root", "Bold 50px Arial", "#000", canvas.width/2- 170, canvas.height/2-100);
    title.shadow = drawShadow("#666",3,3,10);
    stage.addChild(title);
}
function createCopyrightText(){
    var copyRightText = drawText("\251 Copyright 2019 - NC Bots", "Bold 20px Arial", "#000", canvas.width/2-130, canvas.height/2+50);
    stage.addChild(copyRightText);
}
/*FOR GAME OVER SCREEN*/
function createGameTextScreen(textToDisplay){
    var text = drawText(textToDisplay, "Bold 50px Arial", "#000", canvas.width/2- 170, canvas.height/2-100);
    text.shadow = drawShadow("#666",3,3,10);
    stage.addChild(text);
}
function stopGame(textToDisplay){
    clearInterval(enemySpawnInterval);
    stage.removeAllChildren();
    createGameTextScreen(textToDisplay);
    stage.update();
    createjs.Ticker.removeAllEventListeners('tick');
}

/* HUD */
function createHealthBar(){
    healthBarObj = new HealthBar(PLAYER_HEALTH, player.health, 100, 10, 150, 20);
}
function createTimer(){
    timerObj = new Timer(timerMaxTimer, stage.canvas.width/2, 20, 50,20,"red","#fff");
}
