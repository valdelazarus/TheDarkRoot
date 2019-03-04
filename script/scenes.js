class GameMenu extends createjs.Container{
    constructor(){
        super();
        this.removeAllChildren();
        //this.addTitle();
        this.addBG();
        this.addButtons();
    }
    addTitle() {
        var title = drawText("The Dark Root", "Bold 50px Arial", "#000", canvas.width/2, canvas.height/2-70);
        title.shadow = drawShadow("#666",3,3,10);
        this.addChild(title);
    }
    addButtons() {
        
//        this.gameBtn = drawRect("#000", 100, 50, canvas.width/2, canvas.height/2);
//        this.btnText = drawText("Play", "20px Arial", "#fff", canvas.width/2, canvas.height/2);
//        this.gameBtn.on('click', this.onButtonClick, this);
       
//        this.addChild(this.gameBtn, this.btnText);
        var btnContainer = new createjs.Container();
        
        var playBtn = new lib.UIBtn_1();
        playBtn.scale = .5;
        
        var playText = new createjs.BitmapText("PLAY", textSpriteSheet);
        playText.scale = .3;
        playText.x = 20;
        playText.y = 40;
        
        var btnHit = drawRect("#fff", playBtn.nominalBounds.width * playBtn.scale, playBtn.nominalBounds.height * playBtn.scale, playBtn.nominalBounds.width/2 * playBtn.scale, playBtn.nominalBounds.height/2 * playBtn.scale);
        
        btnContainer.addChild(playBtn, playText);
        
        btnContainer.x = canvas.width - 200;
        btnContainer.y = canvas.height/2 - 100;
        
        btnContainer.hitArea = btnHit;
        
        btnContainer.on('click', this.onButtonClick, this);
        
        this.addChild(btnContainer);
    }
    addBG(){
        this.addChild(new lib.MenuBG());
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
        this.addBG();
        this.addTitle(displayedText);
        this.addButtons();
    }
    addTitle(displayedText) {
//        var title = drawText(displayedText, "Bold 50px Arial", "#000", canvas.width/2, canvas.height/2-100);
//        title.shadow = drawShadow("#666",3,3,10);
        this.title = new createjs.BitmapText(displayedText, textSpriteSheet);
        
        this.title.x = canvas.width/4;
        this.title.y = canvas.height/2-200;
        this.title.scale = .7;
        
        this.addChild(this.title);
    }
    addBG(){
        this.addChild(new lib.UIBG_1());
    }
    addButtons() {
        
//        this.menuBtn = drawRect("#000", 100, 50, canvas.width/2, canvas.height/2 + 80);
//        this.menuBtnText = drawText("Menu", "20px Arial", "#fff", canvas.width/2, canvas.height/2 + 80);
//        this.menuBtn.on('click', this.onMenuButtonClick, this);
//        
//        this.replayBtn = drawRect("#000", 100, 50, canvas.width/2, canvas.height/2);
//        this.replayBtnText = drawText("Replay", "20px Arial", "#fff", canvas.width/2, canvas.height/2);
//        this.replayBtn.on('click', this.onReplayButtonClick, this);
        
        var replayBtnContainer = new createjs.Container();
        
        var replayBtn = new lib.UIBtn_1();
        replayBtn .scale = .5;
        
        var replayText = new createjs.BitmapText("REPLAY", textSpriteSheet);
        replayText.scale = .3;
        replayText.x = 20;
        replayText.y = 40;
        
        var replayBtnHit = drawRect("#fff", replayBtn.nominalBounds.width * replayBtn.scale, replayBtn.nominalBounds.height * replayBtn.scale, replayBtn.nominalBounds.width/2 * replayBtn.scale, replayBtn.nominalBounds.height/2 * replayBtn.scale);
        
        replayBtnContainer.addChild(replayBtn, replayText);
        
        replayBtnContainer.x = canvas.width/2-replayBtn.nominalBounds.width/2 * replayBtn.scale;
        replayBtnContainer.y = canvas.height/2;
        
        replayBtnContainer.hitArea = replayBtnHit;
        
        replayBtnContainer.on('click', this.onReplayButtonClick, this);
        
        var menuBtnContainer = new createjs.Container();
        
        var menuBtn = new lib.UIBtn_1();
        menuBtn .scale = .5;
        
        var menuText = new createjs.BitmapText("MENU", textSpriteSheet);
        menuText.scale = .3;
        menuText.x = 20;
        menuText.y = 40;
        
        var menuBtnHit = drawRect("#fff", menuBtn.nominalBounds.width * menuBtn.scale, menuBtn.nominalBounds.height * menuBtn.scale, menuBtn.nominalBounds.width/2 * menuBtn.scale, menuBtn.nominalBounds.height/2 * menuBtn.scale);
        
        menuBtnContainer.addChild(menuBtn, menuText);
        
        menuBtnContainer.x = canvas.width/2-menuBtn.nominalBounds.width/2 * menuBtn.scale;
        menuBtnContainer.y = canvas.height/2 + 100;
        
        menuBtnContainer.hitArea = menuBtnHit;
        
        menuBtnContainer.on('click', this.onMenuButtonClick, this);
       
        //this.addChild(this.menuBtn, this.menuBtnText, this.replayBtn, this.replayBtnText);
        this.addChild(replayBtnContainer, menuBtnContainer);
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
        
        this.bgLayer = new createjs.Container();
        this.ppLayer = new createjs.Container();
        this.playerLayer = new createjs.Container();
        this.enemyLayer = new createjs.Container();
        this.bossLayer = new createjs.Container();
        this.hudLayer = new createjs.Container();
        
        this.levelData = levelData;
        
        this.levelBG = new lib.GameBG();
        
        this.bossSpawned = true;
        
        this.createPlayer();

        hudContainer = new createjs.Container();
        this.createHealthBar();
        this.createTimer();
        this.createAmmoDisplay();

        this.currentMusic = playSound(this.levelData.backgroundMusic,true,.5);
        
        this.timer = 0;
        this.boss = null;
        
//        this.addChildAt(this.levelBG, 0);
//        this.hudLayer.addChild(hudContainer);   
        
        this.addChildAt(this.bgLayer, 0);
        this.addChildAt(this.ppLayer, 1);
        this.addChildAt(this.playerLayer, 2);
        this.addChildAt(this.enemyLayer, 3);
        this.addChildAt(this.bossLayer, 4);
        this.addChildAt(this.hudLayer, 5);
        
        this.bgLayer.addChild(this.levelBG);
        this.hudLayer.addChild(hudContainer);
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
        
//        if (hudContainer != undefined){
//            this.setChildIndex(hudContainer, this.numChildren-2);
//        }

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
        
        if (this.boss == undefined){
            this.timer++;
            if (this.timer > this.levelData.waveSpawnInterval * createjs.Ticker.framerate){
                this.timer = 0;
                this.spawnEnemies();
            }
        } else {
//            this.setChildIndex(this.boss, this.numChildren-1);
            this.boss.update();
        }
        
        if (smallAmmoDisplay != undefined && player != undefined && !gameOver){
            smallAmmoDisplay.updateAmmoText(player.weaponManager.smallWeapon.ammoNumber);
        }
        if (largeAmmoDisplay != undefined && player != undefined && !gameOver){
            largeAmmoDisplay.updateAmmoText(player.weaponManager.largeWeapon.ammoNumber);
        }
    }
    createPlayer(){
        player = new Player(new lib.Player(), PLAYER_SPEED, playerAtkSpd, playerAimAngle, playerShootInterval, playerSpecialAtkInterval, PLAYER_HEALTH, playerMinDmg, playerMaxDmg);
    
        player.graphic.scale = .3;
        player.x = 500;
        player.y = 300;
        
        this.createAimIndicator();
        
        this.playerLayer.addChild(player);
    }
    createAimIndicator(){
        aimIndicator = new GameObject(drawPreloadedImage(preloader.queue.getResult("AimIndicator"), .5, 0, 0));
        player.addChild(aimIndicator);
        //setting local positions for rotating point (parent object)
        aimIndicator.x = player.graphic.nominalBounds.width/2*player.graphic.scale;
        aimIndicator.y = 50;
        //setting child local position offset
        aimIndicator.graphic.x = -20;
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
        smallAmmoDisplay = new AmmoDisplay(new lib.SmallProj(),110,50);
        hudContainer.addChild(smallAmmoDisplay);
        largeAmmoDisplay = new AmmoDisplay(new lib.LargeProj(),110,80);
        hudContainer.addChild(largeAmmoDisplay);
    }
    spawnEnemies(){
        if (!gameOver && !nextLevel && timerObj.seconds > 0){
            console.log("Level spawned minions");
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
            
            if (pickups[i].graphic.nominalBounds != undefined){
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
        
        this.bgLayer.removeAllChildren();
        this.ppLayer.removeAllChildren();
        this.playerLayer.removeAllChildren();
        this.enemyLayer.removeAllChildren();
        this.bossLayer.removeAllChildren();
        this.hudLayer.removeAllChildren();
        
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
            this.boss = new Boss1(new lib.Boss1(),this.levelData.bossSpd,this.levelData.bossDmg,this.levelData.bossHealth,this.levelData.bossAtkInterval,this.levelData.bossMinionsNumber,this.levelData.bossWaveSpawnInterval, this.levelData);
            this.boss.graphic.scale = .7;
            this.boss.x = 700;
            this.boss.y = 300;
            this.boss.healthBar.x = this.boss.graphic.nominalBounds.width/2 * this.boss.graphic.scale;

            enemies.push(this.boss);
            this.bossLayer.addChild(this.boss);

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
            console.log("Level spawned minions");
            this.levelData.enemySpawner.spawnMinions(false,true);
        }
    }
    spawnBoss(){
        if (this.bossSpawned){
            this.boss = new Boss2(new lib.Boss2(),this.levelData.bossSpd,this.levelData.bossDmg,this.levelData.bossHealth,this.levelData.bossAtkInterval,this.levelData.bossAtkSpd,this.levelData.bossMinDistance, this.levelData);
            this.boss.graphic.scale = .5;
            this.boss.x = 700;
            this.boss.y = 300;
            this.boss.healthBar.x = this.boss.graphic.nominalBounds.width/2 * this.boss.graphic.scale;

            enemies.push(this.boss);
            this.bossLayer.addChild(this.boss);

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
            console.log("Level spawned minions");
            this.levelData.enemySpawner.spawnMinions(true);
        }
    }
    spawnBoss(){
        if (this.bossSpawned){
            this.boss = new Boss3(new lib.Boss3(),this.levelData.bossSpd,this.levelData.bossDmg,this.levelData.bossHealth,this.levelData.bossAtkInterval, this.levelData.bossAtkSpd, this.levelData.bossMinDistance, this.levelData.bossMinionsNumber, this.levelData.bossWaveSpawnInterval, this.levelData);
            this.boss.graphic.scale = .5;
            this.boss.x = 700;
            this.boss.y = 300;
            this.boss.healthBar.x = this.boss.graphic.nominalBounds.width/2 * this.boss.graphic.scale;
            
            enemies.push(this.boss);
            this.bossLayer.addChild(this.boss);

            this.bossSpawned = false;
        }
    }
}