/*SPAWNER, TIMER, HUD, SCENE*/

//manage scenes and scene transition
class SceneManager{
    constructor(){
        
    }
    /*FOR LOADING SCREEN*/
    createGameTitle(){
        var title = drawText("The Dark Root", "Bold 50px Arial", "#000", canvas.width/2, canvas.height/2-70);
        title.shadow = drawShadow("#666",3,3,10);
        stage.addChild(title);
    }
    createCopyrightText(){
        var copyRightText = drawText("\xA9 Copyright 2019 - NC Bots", "Bold 20px Arial", "#000", canvas.width/2, canvas.height/2+50);
        stage.addChild(copyRightText);
    }
    gameReady(){
        createjs.Ticker.on("tick", this.onTick, this);
        this.changeState(GameStates.MAIN_MENU);
        this.setUpKeyboardMouseEvent();
    }
    changeState(state){
        switch (state) {
            case GameStates.MAIN_MENU:
                this.currentGameStateFunction = this.gameStateMainMenu;
                break;
            case GameStates.LEVEL_1:
                this.currentGameStateFunction = this.gameStateLevel1;
                break;
            case GameStates.LEVEL_2:
                this.currentGameStateFunction = this.gameStateLevel2;
                break;
            case GameStates.LEVEL_3:
                this.currentGameStateFunction = this.gameStateLevel3;
                break;
            case GameStates.GAME_COMPLETE:
                this.currentGameStateFunction = this.gameStateGameComplete;
                break;
            case GameStates.GAME_LOSE:
                this.currentGameStateFunction = this.gameStateGameLose;
                break;
            case GameStates.RUN_SCENE:
                this.currentGameStateFunction = this.gameStateRunScene;
                break;
        }
    }
    onStateEvent(e, obj) {
        this.changeState(obj.state);
    }
    disposeCurrentScene(){
        if (this.currentScene != null) {
            stage.removeChild(this.currentScene);
            if (this.currentScene.dispose) {
                this.currentScene.dispose();
            }
            this.currentScene = null;
        }
    }
    gameStateMainMenu() {      
        player = undefined;
        boss = undefined;
        
        this.disposeCurrentScene();
        
        var scene = new GameMenu();
        
        scene.on(GameStateEvents.LEVEL_1, this.onStateEvent, this, true, {state:GameStates.LEVEL_1});
       
        stage.addChild(scene);
        
        this.currentScene = scene;
        this.changeState(GameStates.RUN_SCENE);
    }
    
    gameStateLevel1() {
        this.disposeCurrentScene();
        
        var scene = new GameLevel1(levelData1);
        
        scene.on(GameStateEvents.LEVEL_2, this.onStateEvent, this, true, {state:GameStates.LEVEL_2});
        
        scene.on(GameStateEvents.GAME_LOSE, this.onStateEvent, this, true, {state:GameStates.GAME_LOSE});
        
        stage.addChild(scene);
        
        this.currentScene = scene;
        this.changeState(GameStates.RUN_SCENE);
    }
    gameStateLevel2() {
        this.disposeCurrentScene();
        
        var scene = new GameLevel2(levelData2);
        
        scene.on(GameStateEvents.LEVEL_3, this.onStateEvent, this, true, {state:GameStates.LEVEL_3});
        
        scene.on(GameStateEvents.GAME_LOSE, this.onStateEvent, this, true, {state:GameStates.GAME_LOSE});
        
        stage.addChild(scene);
        
        this.currentScene = scene;
        this.changeState(GameStates.RUN_SCENE);
    }
    gameStateLevel3() {
        this.disposeCurrentScene();
        
        var scene = new GameLevel3(levelData3);
        
        scene.on(GameStateEvents.GAME_COMPLETE, this.onStateEvent, this, true, {state:GameStates.GAME_COMPLETE}); //to be replaced with level 2 state later
        
        scene.on(GameStateEvents.GAME_LOSE, this.onStateEvent, this, true, {state:GameStates.GAME_LOSE});
        
        stage.addChild(scene);
        
        this.currentScene = scene;
        this.changeState(GameStates.RUN_SCENE);
    }
    
    gameStateGameComplete() {    
        
        player = undefined;
        boss = undefined;
        
        this.disposeCurrentScene();
        
        var scene = new GameComplete("Congrats!");
        
        scene.on(GameStateEvents.MAIN_MENU, this.onStateEvent, this, true, {state:GameStates.MAIN_MENU});
        scene.on(GameStateEvents.LEVEL_1, this.onStateEvent, this, true, {state:GameStates.LEVEL_1});
        
        stage.addChild(scene);

        this.currentScene = scene;
        this.changeState(GameStates.RUN_SCENE);
    }
    
    gameStateGameLose() {   
        
        player = undefined;
        boss = undefined;
        
        this.disposeCurrentScene();
        
        var scene = new GameComplete("Game Over!");
        
        scene.on(GameStateEvents.MAIN_MENU, this.onStateEvent, this, true, {state:GameStates.MAIN_MENU});
        scene.on(GameStateEvents.LEVEL_1, this.onStateEvent, this, true, {state:GameStates.LEVEL_1});
        
        stage.addChild(scene);
        
        this.currentScene = scene;
        this.changeState(GameStates.RUN_SCENE);
    }
    
    gameStateRunScene() {
        if (this.currentScene.run) {
            this.currentScene.run();
        }
    }
    onTick(e){
        if (this.currentGameStateFunction != null) {
           this.currentGameStateFunction(e);
        }
        //stage.update();
    }
    setUpKeyboardMouseEvent(){
        document.onclick = this.mouseClickHandler; //left click
        document.oncontextmenu = this.rightMouseClickHandler; //right click
        stage.on('stagemousemove', this.mouseMoveHandler) //mouse move

        this.handleKeyBoardEvent();
    }
    mouseClickHandler(){
        if (player != undefined){
            player.shootBehavior.performAtk(player);
        } else return;
    }
    rightMouseClickHandler(e){
        if (player != undefined){
            player.shootBehavior.performSpecialAtk(player);
            e.preventDefault(); //hide popup menu
        } else return;
    }
    mouseMoveHandler(e){
        var mouseX = e.stageX;
        var mouseY = e.stageY;
        
        if (player != undefined){
            player.aimAngle = Math.atan2(mouseY-player.y,mouseX-player.x) / Math.PI * 180;

            //rotate aimIndicator accordingly 
            aimIndicator.setTransform(aimIndicator.x,aimIndicator.y,1,1,player.aimAngle+90);
        }
    }
    handleKeyBoardEvent(){
        //handle keyboard event
        window.onkeyup = this.keyUpHandler;
        window.onkeydown = this.keyDownHandler;
    }
    keyDownHandler(e){ //when key is pressed
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
            case KEYCODE_1:
                keyboard1 = true;
                break; 
            case KEYCODE_2:
                keyboard2 = true;
                break; 
            case KEYCODE_3:
                keyboard3 = true;
                break; 
        }
    }
    keyUpHandler(e){ // when key is released
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
            case KEYCODE_1:
                keyboard1 = false;
                break; 
            case KEYCODE_2:
                keyboard2 = false;
                break; 
            case KEYCODE_3:
                keyboard3 = false;
                break; 
        }
    }
}
//preload assets and render loading bar 
class Preloader{
    constructor(){
        this.fileArray = [];
        this.queue = new createjs.LoadQueue();
        this.loadingBar = null;
        this.loadInterval = null;
    }
    //install sound plugin
    installSoundPlugin(){
        this.queue.installPlugin(createjs.Sound);
    }
    //add file to array 
    addFile(id, src){
        this.fileArray.push({id: id, src: src});
    }
    //use a file array; each item in array should have id and src property
    loadFiles(){
        this.queue.loadManifest(this.fileArray);
    }
    //get loading progress - precentage between 0 and 1
    getLoadingProgress(){
        return this.queue.progress;
    }
    //create loading bar at pos x and y and return the instance
    createLoadingBar(width, height, posX, posY, color= "#000"){
        this.loadingBar = drawBorderedRect(color, width, height, posX, posY);
        stage.addChild(this.loadingBar);
    }
    //update loading bar with real loading progress - pass in bar instance
    updateLoadingBar(loadingBar, fillColor="#666", strokeColor="#000"){
        loadingBar.graphics.beginFill(fillColor);
        
        loadingBar.graphics.drawRect(0, 0, loadingBar.getBounds().width *                     this.getLoadingProgress(), loadingBar.getBounds().height);
        
        loadingBar.graphics.endFill();
        
        loadingBar.graphics.setStrokeStyle(2);
        loadingBar.graphics.beginStroke(strokeColor);
        
        loadingBar.graphics.drawRect(0, 0, loadingBar.getBounds().width, loadingBar.getBounds().height);
        
        loadingBar.graphics.endStroke();
    }
}

//general random enemy spawner class
class EnemySpawner{
    constructor(total, levelData){
        this.total = total;
        this.levelData = levelData;
    }
    spawnMinions(random=false,ranged=false){
        var nextX = 0, nextY = 50, maxGap = 100;
        
        for (var i=0; i< this.total; ++i){
            var gap = Math.random()* maxGap;

            //var enemy = new Enemy(drawImage('images/enemy.png', .5, nextX, nextY), enemySpd);
//            var enemy = new Enemy(drawPreloadedImage(preloader.queue.getResult("Minion"), .2, nextX, nextY), enemySpd, meleeDmg);
            if(random){
                var enemy = this.randomizeMinions(nextX, nextY);
            } else if (!ranged){
                var enemy = new MeleeEnemy(drawPreloadedImage(preloader.queue.getResult("Melee"), .5, nextX, nextY), this.levelData.enemySpd, this.levelData.meleeDmg, this.levelData.meleeAtkInterval, this.levelData.meleeHealthDropRate, this.levelData.meleeSmallAmmoDropRate, this.levelData.meleeLargeAmmoDropRate);
                enemy.x -= enemy.graphic.image.width/2*enemy.graphic.scale;
                enemy.y -= enemy.graphic.image.height/2*enemy.graphic.scale;
            } else if (ranged){
                var enemy = new RangedEnemy(drawPreloadedImage(preloader.queue.getResult("Ranged"), .3, nextX, nextY), this.levelData.enemySpd, this.levelData.rangedDmg, this.levelData.rangedAtkSpd, 0, this.levelData.shootAtkInterval, 0, 500, this.levelData.rangedHealthDropRate, this.levelData.rangedSmallAmmoDropRate, this.levelData.rangedLargeAmmoDropRate);
                enemy.x -= enemy.graphic.image.width/2*enemy.graphic.scale;
                enemy.y -= enemy.graphic.image.height/2*enemy.graphic.scale;
            }
            
            enemies.push(enemy);

            nextX = gap + Math.random() * (stage.canvas.width - enemy.graphic.image.width * enemy.graphic.scale);
            nextY = gap + Math.random() * (stage.canvas.height - enemy.graphic.image.height * enemy.graphic.scale); 
        }
    }
    spawnAtSpecifiedPosition(posX, posY, maxGap, random=false){
        var nextX = posX, nextY=posY;
        var maxGap = maxGap;
        for (var i=0; i< this.total; ++i){
            
            var gap = -maxGap + Math.random()* maxGap;
            
            if (random){
                var enemy = this.randomizeMinions(nextX, nextY);
            }else{
                var enemy = new MeleeEnemy(drawPreloadedImage(preloader.queue.getResult("Melee"), .5, nextX, nextY), this.levelData.enemySpd, this.levelData.meleeDmg, this.levelData.meleeAtkInterval, this.levelData.meleeHealthDropRate, this.levelData.meleeSmallAmmoDropRate, this.levelData.meleeLargeAmmoDropRate);
                enemy.x -= enemy.graphic.image.width/2*enemy.graphic.scale;
                enemy.y -= enemy.graphic.image.height/2*enemy.graphic.scale;
            }
            
            enemies.push(enemy);

            nextY += gap;
        }
    }
    randomizeMinions(posX, posY){
        var n = 1+ Math.random()*10;
        var enemy;
        if (n<8){
            enemy = new MeleeEnemy(drawPreloadedImage(preloader.queue.getResult("Melee"), .5, posX, posY), this.levelData.enemySpd, this.levelData.meleeDmg, this.levelData.meleeAtkInterval, this.levelData.meleeHealthDropRate, this.levelData.meleeSmallAmmoDropRate, this.levelData.meleeLargeAmmoDropRate);
            enemy.x -= enemy.graphic.image.width/2*enemy.graphic.scale;
            enemy.y -= enemy.graphic.image.height/2*enemy.graphic.scale;
        } else {
            enemy = new RangedEnemy(drawPreloadedImage(preloader.queue.getResult("Ranged"), .3, posX, posY), this.levelData.enemySpd, this.levelData.rangedDmg, this.levelData.rangedAtkSpd, 0, this.levelData.shootAtkInterval, 0, 500, this.levelData.rangedHealthDropRate, this.levelData.rangedSmallAmmoDropRate, this.levelData.rangedLargeAmmoDropRate);
            enemy.x -= enemy.graphic.image.width/2*enemy.graphic.scale;
            enemy.y -= enemy.graphic.image.height/2*enemy.graphic.scale;
        }
        return enemy;
    }
}
//health bar class -create, display and update bar according to current health value 
class HealthBar extends createjs.Container{
    constructor(maxValue, currentValue, width, height, posX, posY, text, borderColor= "#000", fillColor = "red"){  
        super();
        
        this.maxValue = maxValue; 
        this.currentValue = currentValue;
        
        this.width = width;
        this.height = height; 
        this.x = posX; 
        this.y = posY; 
        this.strokeColor = borderColor;
        this.fillColor = fillColor;
        
        this.border = null;
        this.fillArea = null;
        
         //will be replaced with player avatar later 
        this.text = drawText(text, "20px Arial Bold", "#000", -this.width/2-40, 0);
        
        this.addChild(this.text, this.fillArea, this.border); //group border and fill 
        //stage.addChild(this);
        
        createjs.Ticker.on('tick',this.update.bind(this));
    }
    update(){
        this.updateBar();
    }
    updateBar(){
        //create the fill representing current value 
        if (this.fillArea != undefined){
            this.removeChild(this.fillArea); //reset after each update
        }
        if (this.border != undefined){
            this.removeChild(this.border); //reset after each update
        }
        
        //draw the fill
            this.fillArea=drawBorderedRect(null, this.width, this.height, 0, 0); //rect with no border

            this.fillArea.graphics.beginFill(this.fillColor);

            // width <-> maxValue ; fillWidth <-> currentValue --> fillWidth = width*currentValue/maxValue
            this.fillArea.graphics.drawRect(0, 0, this.width * this.currentValue / this.maxValue, this.height); 

            this.fillArea.graphics.endFill();
        
        //draw the border - make healthbar border drawn on top
            this.border = drawBorderedRect(this.strokeColor, this.width, this.height, 0, 0);
        
        this.addChild(this.fillArea, this.border); //group border and fill 
    }
}


//timer class
class Timer extends createjs.Container{
    constructor(maxTime, posX, posY, boxWidth, boxHeight, boxColor, textColor){ //set direcly on constructor
        
        super();
        
        this.seconds = maxTime;
        this.maxTime = maxTime; //max time allowed before spawning boss 
        this.count = 0;
        
        this.x = posX;
        this.y = posY;
        
        this.text = null;
        this.textColor = textColor;
        
        //maybe replaced with timer graphic later 
        this.boxWidth = boxWidth;
        this.boxHeight = boxHeight;
        this.boxColor = boxColor;
        
        this.containerBox = drawRect(this.boxColor, this.boxWidth, this.boxHeight, 0, 0);
        this.containerBox.graphics.setStrokeStyle(2).beginStroke("#000").drawRect(0,0,this.boxWidth,this.boxHeight);
        
        this.addChild(this.containerBox);
        this.updateTime();
        
        //stage.addChild(this);
        
        createjs.Ticker.on('tick',this.update.bind(this));
    }
        
    update(){
        this.count++;  //count frame
        if (this.count == 60) { //game running on 60 FPS
            this.count = 0;
            this.seconds--;
        }
        if (this.seconds >= 0){
            this.updateTime();
            if (this.seconds == 0){ 
                hudContainer.removeChild(this);
            }
        }
    }
        
    //set Timer based on the current time - graphics.js -drawText - format the text: 'MM:SS'
    updateTime(){
        if(this.text != undefined)
            this.removeChild(this.text); //reset after each update
       
        var sec = this.seconds % 60;
        var min = Math.floor(this.seconds/60);

        if(sec < 10){
            sec = "0" + sec; //Add a 0 before any 1-digit number
        }
        if(min < 10){
            min = "0" + min; //Add a 0 before any 1-digit number
        }
        this.text = drawText(min + ":" + sec, "20px Arial Bold", this.textColor, 0,0); //offset pos from containerBox  
        
        this.addChild(this.text);
    }
}
//Display damage text 
class DamageText{
    constructor(parent, damage, color, posX, posY){
        this.color = color;
        this.posX = posX;
        this.posY = posY;
        this.parent = parent; 
        
        this.text = drawText(-damage, "20px Arial Bold", this.color, this.posX,this.posY);
        this.parent.addChild(this.text);
        
        createjs.Tween.get(this.text).to({scale:10, alpha:0},1000).call(this.selfDestroy);
    }
    selfDestroy(){
        this.parent.removeChild(this.text);
    }
}

//HUD for weapon ammo display 
class AmmoDisplay extends createjs.Container{
    constructor(graphic, posX, posY){
        super();
        
        this.graphic = graphic;
        this.x = posX;
        this.y = posY;
        this.ammoText = 0;

        this.ammoTxtBox = drawText("x "+ this.ammoText, "20px Arial Bold", "#000", 20, 0);
        this.ammoTxtBox.textAlign = "left";
        
        this.addChild(this.graphic, this.ammoTxtBox);
    }
    updateAmmoText(text){
        this.removeChild(this.ammoTxtBox);
        
        this.ammoText = text;
        this.ammoTxtBox = drawText("x "+this.ammoText, "20px Arial Bold", "#000", 20, 0);
        this.ammoTxtBox.textAlign = "left";
        this.addChild(this.ammoTxtBox);
    }
}