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
                var enemy = new MeleeEnemy(drawPreloadedImage(preloader.queue.getResult("Melee"), .5, nextX, nextY), enemySpd, meleeDmg, meleeAtkInterval);
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
            enemy = new MeleeEnemy(drawPreloadedImage(preloader.queue.getResult("Melee"), .5, posX, posY), enemySpd, meleeDmg, meleeAtkInterval);
            enemy.x -= enemy.graphic.image.width/2*enemy.graphic.scale;
            enemy.y -= enemy.graphic.image.height/2*enemy.graphic.scale;
        } else {
            enemy = new RangedEnemy(drawPreloadedImage(preloader.queue.getResult("Ranged"), .3, posX, posY), enemySpd, rangedDmg, rangedAtkSpd, 0, shootAtkInterval, 0, 500);
            enemy.x -= enemy.graphic.image.width/2*enemy.graphic.scale;
            enemy.y -= enemy.graphic.image.height/2*enemy.graphic.scale;
        }
        return enemy;
    }
}
//health bar class -create, display and update bar according to current health value 
class HealthBar extends createjs.Container{
    constructor(maxValue, currentValue, width, height, posX, posY, borderColor= "#000", fillColor = "red"){  
//        this.maxHealth = 10; //DONT use hard-coded value 
//        this.currentHealth = 10; //DONT use hard-coded value
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
        this.text = drawText("Player", "20px Arial Bold", "#000", this.x - this.width/2 - 60, this.y-this.height/2-5);
        
        this.addChild(this.border, this.fillArea); //group border and fill 
        stage.addChild(this);
        
        createjs.Ticker.on('tick',this.update.bind(this));
    }
    update(){
        this.updateBar();
    }
    //DONT need these - can always get value by instance.maxHealth or instance.currentHealth etc 
//    getMaxHealth(){
//        return maxHealth;  //when referring to variable of an instance-> use this.<variableName> 
//    }
//    getCurrentHealth(){
//        return currentHealth;
//    }
    
    updateBar(){
        //create the fill representing current value 
        if (this.fillArea != undefined){
            stage.removeChild(this.fillArea); //reset after each update
        }
        if (this.border != undefined){
            stage.removeChild(this.border); //reset after each update
        }
        
        //draw the fill
            this.fillArea=drawBorderedRect(null, this.width, this.height, this.x, this.y); //rect with no border

            this.fillArea.graphics.beginFill(this.fillColor);

            // width <-> maxValue ; fillWidth <-> currentValue --> fillWidth = width*currentValue/maxValue
            this.fillArea.graphics.drawRect(0, 0, this.width * this.currentValue / this.maxValue, this.height); 

            this.fillArea.graphics.endFill();
        
        //draw the border - make healthbar border drawn on top
            this.border = drawBorderedRect(this.strokeColor, this.width, this.height, this.x, this.y);
    }
}


//timer class
class Timer{
    constructor(maxTime){ //set direcly on constructor
        this.seconds = maxTime;
        this.maxTime = maxTime; //max time allowed before spawning boss 
        this.count = 0;
        this.text = null;
        
        createjs.Ticker.on('tick',this.update.bind(this)); //calling update to update time 
    }
        
    update(){
        this.count++;  //count frame
        if (this.count == 60) { //game running on 60 FPS
            this.count = 0;
            this.seconds--;
        }
        this.display(150,20);
    }
        
    //display on screen the current time - graphics.js -drawText - format the text: 'MM:SS'
    display(posX,posY){
        if(this.text != undefined)
            stage.removeChild(this.text); //reset after each update
        
        var sec = this.seconds % 60;
        var min = Math.floor(this.seconds/60);
        
        if(sec < 10){
            sec = "0" + sec; //Add a 0 before any 1-digit number
        }
        if(min < 10){
            min = "0" + min; //Add a 0 before any 1-digit number
        }
        this.text = drawText(min + ":" + sec, "20px Arial Bold", "#000", posX, posY);
    }
}
