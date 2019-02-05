/*SPAWNER, TIMER, HUD, SCENE*/

//manage scenes and scene transition
class SceneManager{
    
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
    constructor(total){
        this.total = total;
    }
    spawnRandom(){
        var nextX = 0, nextY = 50, maxGap = 100;
        
        for (var i=0; i< this.total; ++i){
            var gap = Math.random()* maxGap;

            //var enemy = new Enemy(drawImage('images/enemy.png', .5, nextX, nextY), enemySpd);
//            var enemy = new Enemy(drawPreloadedImage(preloader.queue.getResult("Minion"), .2, nextX, nextY), enemySpd, meleeDmg);
            
            var enemy = this.randomizeMinions(nextX, nextY);

            enemies.push(enemy);

            nextX = gap + Math.random() * (stage.canvas.width - enemy.graphic.image.width * enemy.graphic.scale);
            nextY = gap + Math.random() * (stage.canvas.height - enemy.graphic.image.height * enemy.graphic.scale); 
        }
    }
    spawnAtSpecifiedPosition(posX, posY, maxGap, random){
        var nextX = posX, nextY=posY;
        var maxGap = maxGap;
        for (var i=0; i< this.total; ++i){
            
            var gap = -maxGap + Math.random()* maxGap;
            
            if (random){
                var enemy = this.randomizeMinions(nextX, nextY);
            }else{
                var enemy = new MeleeEnemy(drawPreloadedImage(preloader.queue.getResult("Melee"), .5, nextX, nextY), enemySpd, meleeDmg, meleeAtkInterval, meleeDropRate);
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
            enemy = new MeleeEnemy(drawPreloadedImage(preloader.queue.getResult("Melee"), .5, posX, posY), enemySpd, meleeDmg, meleeAtkInterval, meleeDropRate);
            enemy.x -= enemy.graphic.image.width/2*enemy.graphic.scale;
            enemy.y -= enemy.graphic.image.height/2*enemy.graphic.scale;
        } else {
            enemy = new RangedEnemy(drawPreloadedImage(preloader.queue.getResult("Ranged"), .3, posX, posY), enemySpd, rangedDmg, rangedAtkSpd, 0, shootAtkInterval, 0, 500, rangedDropRate);
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
        stage.addChild(this);
        
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
        
        stage.addChild(this);
        
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
                stage.removeChild(this);
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
        
        this.text = drawText(damage, "20px Arial Bold", this.color, this.posX,this.posY);
        this.parent.addChild(this.text);
        
        createjs.Tween.get(this.text).to({scale:10, alpha:0},1000).call(this.selfDestroy);
    }
    selfDestroy(){
        this.parent.removeChild(this.text);
    }
}