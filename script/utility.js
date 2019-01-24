/*SPAWNER, TIMER, HUD, SCENE*/

//manage scenes and scene transition
class SceneManager{
    
}

//preload assets and render loading bar 
class Preloader{
    constructor(){
        this.fileArray = [];
        this.queue = new createjs.LoadQueue();
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
    createLoadingBar(posX, posY){
        
    }
    //update loading bar with loading progress - use bar instance
    updateLoadingBar(loadingBar){
        
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

            var enemy = new Enemy(drawImage('images/enemy.png', .5, nextX, nextY), enemySpd);

            enemies.push(enemy);

            nextX = gap + Math.random() * (stage.canvas.width - enemy.graphic.image.width * enemy.graphic.scale);
            nextY = gap + Math.random() * (stage.canvas.height - enemy.graphic.image.height * enemy.graphic.scale); 
        }
    }   
}
//timer class
class Timer{
    
}
