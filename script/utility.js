/*SPAWNER, TIMER, HUD, SCENE*/
class SceneManager{
    
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
