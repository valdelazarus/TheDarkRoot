class GameMenu extends createjs.Container{
    constructor(){
        super();
        this.removeAllChildren();
        this.addTitle();
        this.addButtons();
    }
    addTitle() {
        var title = drawText("The Dark Root", "Bold 50px Arial", "#000", canvas.width/2, canvas.height/2-70);
        title.shadow = drawShadow("#666",3,3,10);
        this.addChild(title);
    }
    addButtons() {
        
        this.gameBtn = drawRect("#000", 100, 50, canvas.width/2, canvas.height/2);
        this.btnText = drawText("Play", "20px Arial", "#fff", canvas.width/2, canvas.height/2);
        this.gameBtn.on('click', this.onButtonClick, this);
       
        this.addChild(this.gameBtn, this.btnText);
    }
    onButtonClick(e) {
        //var newGame;
        //var btn = e.target
//        if (btn == this.gameBtn) {
//            localStorage.clear();
//            data.PlayerData.setLocalStorage();
//        }
        this.dispatchEvent(GameStateEvents.LEVEL_1);
    }
}
class GameComplete extends createjs.Container{
    constructor(displayedText){
        super();
        this.removeAllChildren();
        this.addTitle(displayedText);
        this.addButtons();
    }
    addTitle(displayedText) {
        var title = drawText(displayedText, "Bold 50px Arial", "#000", canvas.width/2, canvas.height/2-100);
        title.shadow = drawShadow("#666",3,3,10);
        this.addChild(title);
    }
    addButtons() {
        
        this.menuBtn = drawRect("#000", 100, 50, canvas.width/2, canvas.height/2 + 80);
        this.menuBtnText = drawText("Menu", "20px Arial", "#fff", canvas.width/2, canvas.height/2 + 80);
        this.menuBtn.on('click', this.onMenuButtonClick, this);
        
        this.replayBtn = drawRect("#000", 100, 50, canvas.width/2, canvas.height/2);
        this.replayBtnText = drawText("Replay", "20px Arial", "#fff", canvas.width/2, canvas.height/2);
        this.replayBtn.on('click', this.onReplayButtonClick, this);
       
        this.addChild(this.menuBtn, this.menuBtnText, this.replayBtn, this.replayBtnText);
    }
    onMenuButtonClick(e) {
        
        this.dispatchEvent(GameStateEvents.MAIN_MENU);
    }
    onReplayButtonClick(e) {
        
        this.dispatchEvent(GameStateEvents.LEVEL_1);
    }
}

class GameLevel extends createjs.Container{
    constructor(levelData){
        super();
        
        this.levelData = levelData;
        
        this.bossSpawned = true;
    
        this.createPlayer();

        hudContainer = new createjs.Container();
        this.createHealthBar();
        this.createTimer();
        this.createAmmoDisplay();

        this.currentMusic = playSound(this.levelData.backgroundMusic,true,.5);
        
        this.timer = 0;
        
        this.addChild(hudContainer);
    }
    run(){
         //handle game over
        if (gameOver){
  
            createjs.Tween.get(this).wait(1000).call(this.loseGame,null,this);
            return;
        }

        if (nextLevel){

            createjs.Tween.get(this).wait(1000).call(this.winGame,null, this);
            return;
        }
        
        if (player != undefined){
            player.update();
        }

    //    //make sure boss and hud are always rendered on top of other enemies and player in scene 
        
        if (hudContainer != undefined){
            this.setChildIndex(hudContainer, this.numChildren-2);
        }

        this.runEnemyBehavior();
        this.runBulletBehavior();
        this.runPickupBehavior();

        if (healthBarObj != undefined && player != undefined && !gameOver){
            healthBarObj.currentValue = player.health;
        }

        if (timerObj != undefined && player != undefined && !gameOver && timerObj.seconds <= 0){
           //this.lastSpawn = time;
            this.spawnBoss();
        } 
        
        if (boss == undefined){
            this.timer++;
            if (this.timer > this.levelData.waveSpawnInterval * createjs.Ticker.framerate){
                this.timer = 0;
                this.spawnEnemies();
            }
        } else {
            this.setChildIndex(boss, this.numChildren-1);
            boss.update();
        }
        
        if (smallAmmoDisplay != undefined && player != undefined && !gameOver){
            smallAmmoDisplay.updateAmmoText(player.weaponManager.smallWeapon.ammoNumber);
        }
        if (largeAmmoDisplay != undefined && player != undefined && !gameOver){
            largeAmmoDisplay.updateAmmoText(player.weaponManager.largeWeapon.ammoNumber);
        }
    }
    createPlayer(){
        player = new Player(drawPreloadedImage(preloader.queue.getResult("Player"), .5, 500, 300), PLAYER_SPEED, playerAtkSpd, playerAimAngle, playerShootInterval, playerSpecialAtkInterval, PLAYER_HEALTH, playerMinDmg, playerMaxDmg);
    
        this.createAimIndicator();
        
        this.addChild(player);
    }
    createAimIndicator(){
        aimIndicator = new GameObject(drawPreloadedImage(preloader.queue.getResult("AimIndicator"), .5, 0, 0));
        player.addChild(aimIndicator);
        //setting local positions for rotating point (parent object)
        aimIndicator.x = 33;
        aimIndicator.y = 30;
        //setting child local position offset
        aimIndicator.graphic.x = -13;
        aimIndicator.graphic.y = -60;
    }
    createHealthBar(){
        healthBarObj = new HealthBar(PLAYER_HEALTH, player.health, 100, 10, 150, 20,"Player");
        hudContainer.addChild(healthBarObj);
    }
    createTimer(){
        timerObj = new Timer(this.levelData.timerMaxTimer, stage.canvas.width/2, 20, 50,20,"red","#fff");
        hudContainer.addChild(timerObj);
    }
    createAmmoDisplay(){
        smallAmmoDisplay = new AmmoDisplay(drawRect("#999", 20, 20, 0, 0),110,50);
        hudContainer.addChild(smallAmmoDisplay);
        largeAmmoDisplay = new AmmoDisplay(drawRect("#333", 20, 20, 0, 0),110,80);
        hudContainer.addChild(largeAmmoDisplay);
    }
    spawnEnemies(){
        if (!gameOver && !nextLevel && timerObj.seconds > 0){
            this.levelData.enemySpawner.spawnMinions();
        }
    }
    spawnBoss(){
//        if (this.bossSpawned){
//            boss = new Boss1(drawPreloadedImage(preloader.queue.getResult("Boss"), .7, 700, 300),this.levelData.bossSpd,this.levelData.bossDmg,this.levelData.bossHealth,this.levelData.bossAtkInterval,this.levelData.bossMinionsNumber,this.levelData.bossWaveSpawnInterval, this.levelData);
//
//            enemies.push(boss);
//            this.addChild(boss);
//
//            this.bossSpawned = false;
//        }
    }
    runEnemyBehavior(){
        for (var i =0; i<enemies.length; ++i){      
           
            
            if ((enemies[i].type == "Melee")||(enemies[i].type == "Boss") ){
                if (checkCollisionSprSpr(player, enemies[i])){
                    enemies[i].speed = 0;              
                    if (enemies[i].dealMeleeDamage){
                        enemies[i].meleeBehavior.atkCounter++;
                        enemies[i].dealMeleeDamage();
                    }          
                    handleCollisionSprSpr(player, enemies[i]);
                } 
                else {
                    enemies[i].speed = enemies[i].temp;
                }
                
                if (enemies[i].shootBehavior != undefined){
                    enemies[i].shootBehavior.performAtk(enemies[i]);
                }
            }

            else if (enemies[i].type == "Ranged"){
                handleCollisionSprSpr(player, enemies[i]);
                if (enemies[i].chaseBehavior.distance <= enemies[i].minDistance){
                    enemies[i].speed = 0;
                    enemies[i].shootBehavior.performAtk(enemies[i]);
                } else {
                    enemies[i].speed = enemies[i].temp;
                }
            }
            
            if (enemies[i] != undefined){
                enemies[i].update();
            }            
        }
    }
    runBulletBehavior(){
        for (var i=0; i<bullets.length; ++i){     
            if ((bullets[i].source.type === 'Ranged') ||(bullets[i].source.type == "Boss")){
                if (checkCollisionSprSpr(bullets[i],player)){
                    bullets[i].hitPlayer();
                    this.removeChild(bullets[i]);
                    bullets.splice(i,1);
                }
            } else if (bullets[i].source.type === 'Player'){
                
                bullets[i].hitEnemy();
            }
            if (bullets[i] != undefined){
                bullets[i].update(); 
            }
        }
    }
    runPickupBehavior(){
        for (var i=0; i<pickups.length; ++i){
            
            if (pickups[i].graphic.image != undefined){
                if (checkCollisionSprSpr(pickups[i],player)){
                    pickups[i].onPickup();
                }
            } else {
                if (checkCollisionSpriteRect(player, pickups[i])){
                    pickups[i].onPickup();
                }
            }
            
            if (pickups[i] != undefined){
                pickups[i].update();
            }
        }
    }
    reset(){
        
        enemies = [];
        bullets = [];
        pickups = [];
        gameOver = false;
        nextLevel = false; 
        
        this.currentMusic.stop();
        
        this.removeAllChildren();
    }
    loseGame(){
        this.reset();
        this.dispatchEvent(GameStateEvents.GAME_LOSE);
    }
    winGame(){
        this.reset();
        this.dispatchEvent(GameStateEvents.GAME_COMPLETE);
    }
    dispose(){
        boss = undefined;
        timerObj = undefined;
        this.removeAllEventListeners();
    }
}
class GameLevel1 extends GameLevel{
    constructor(levelData){
        super(levelData);
    }
     winGame(){
        this.reset();
        this.dispatchEvent(GameStateEvents.LEVEL_2);
    }
    spawnBoss(){
        if (this.bossSpawned){
            boss = new Boss1(drawPreloadedImage(preloader.queue.getResult("Boss"), .7, 700, 300),this.levelData.bossSpd,this.levelData.bossDmg,this.levelData.bossHealth,this.levelData.bossAtkInterval,this.levelData.bossMinionsNumber,this.levelData.bossWaveSpawnInterval, this.levelData);

            enemies.push(boss);
            this.addChild(boss);

            this.bossSpawned = false;
        }
    }
}
class GameLevel2 extends GameLevel{
    constructor(levelData){
        super(levelData);
    }
     winGame(){
        this.reset();
        this.dispatchEvent(GameStateEvents.LEVEL_3);
    }
    spawnEnemies(){
        if (!gameOver && !nextLevel && timerObj.seconds > 0){
            this.levelData.enemySpawner.spawnMinions(false,true);
        }
    }
    spawnBoss(){
        if (this.bossSpawned){
            boss = new Boss2(drawPreloadedImage(preloader.queue.getResult("Boss"), .7, 700, 300),this.levelData.bossSpd,this.levelData.bossDmg,this.levelData.bossHealth,this.levelData.bossAtkInterval,this.levelData.bossAtkSpd,this.levelData.bossMinDistance, this.levelData);

            enemies.push(boss);
            this.addChild(boss);

            this.bossSpawned = false;
        }
    }
}
class GameLevel3 extends GameLevel{
    constructor(levelData){
        super(levelData);
    }
    spawnEnemies(){
        if (!gameOver && !nextLevel && timerObj.seconds > 0){
            this.levelData.enemySpawner.spawnMinions(true);
        }
    }
    spawnBoss(){
        if (this.bossSpawned){
            boss = new Boss3(drawPreloadedImage(preloader.queue.getResult("Boss"), .7, 700, 300),this.levelData.bossSpd,this.levelData.bossDmg,this.levelData.bossHealth,this.levelData.bossAtkInterval, this.levelData.bossAtkSpd, this.levelData.bossMinDistance, this.levelData.bossMinionsNumber, this.levelData.bossWaveSpawnInterval, this.levelData);

            enemies.push(boss);
            this.addChild(boss);

            this.bossSpawned = false;
        }
    }
}