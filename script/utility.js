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

/*

//timer class
class Timer{
    constructor(){
        this.seconds = 0;
        this.minutes = 0;
    }
    
    setTime(sec, min){
        seconds = sec;
        minutes = min;
    }
    
    getSeconds(){
        return seconds;
    }
    getMinutes(){
        return minutes;
    }
    
    reduceTime(){
        if(seconds==0){
            seconds = 59;
            minutes--;
        } else {
            seconds--;
        }
    }
}

//health bar class
class HealthBar{
    constructor(){
        this.healthBar = null;
        this.maxHealth = 10;
        this.currentHealth = 10;
    }
    
    getMaxHealth(){
        return maxHealth;
    }
    getCurrentHealth(){
        return currentHealth;
    }
    
    checkHealth(playerHealth){
        currentHealth = playerHealth;
    }
    
    createHealthBar(width, height, posX, posY, color= "#000"){
        this.healthBar = drawBorderedRect(color, width, height, posX, posY);
    }
    
    updateHealthBar(healthBar, fillColor="#666", strokeColor="#000"){
        healthBar.graphics.beginFill(fillColor);
        
        healthBar.graphics.drawRect(0, 0, healthBar.getBounds().width * this.getCurrentHealth(), healthBar.getBounds().height);
        
        healthBar.graphics.endFill();
        
        healthBar.graphics.setStrokeStyle(2);
        healthBar.graphics.beginStroke(strokeColor);
        
        healthBar.graphics.drawRect(0, 0, healthBar.getBounds().width, healthBar.getBounds().height);
        
        healthBar.graphics.endStroke();
    }
}*/
