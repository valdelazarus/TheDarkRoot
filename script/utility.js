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
            
            var enemy = new MeleeEnemy(drawPreloadedImage(preloader.queue.getResult("Minion"), .2, nextX, nextY), enemySpd, meleeDmg, meleeAtkInterval);

            enemies.push(enemy);

            nextX = gap + Math.random() * (stage.canvas.width - enemy.graphic.image.width * enemy.graphic.scale);
            nextY = gap + Math.random() * (stage.canvas.height - enemy.graphic.image.height * enemy.graphic.scale); 
        }
    }   
}
//timer class
class Timer{
    
}
