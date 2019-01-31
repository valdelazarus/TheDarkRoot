//General base GameObject class with graphic and bounds
class GameObject extends createjs.Container{ //Container is a display class that can have multiple children
  constructor(graphic){
    super();

    if (graphic !== undefined){
        this.graphic = graphic;
        
        //set positions of graphic (child node) to container (parent node) then reset graphic positions 
        this.x = this.graphic.x;
        this.y = this.graphic.y;
        this.graphic.x = 0;
        this.graphic.y = 0;
        
        //after that, parent graphic to container
        this.addChild(this.graphic);
        
        stage.addChild(this);
    }
  }
}
//Moveable GameObject added velocity in x and y
class MoveableGameObject extends GameObject{
  constructor(graphic){
    super(graphic);
      
    this.velocity = {
      x:0,
      y:0
    }

    createjs.Ticker.on('tick', this.update.bind(this));
  }
  update(){
    this.y += this.velocity.y;
    this.x += this.velocity.x;
  }
}
//Player specific class 
class Player extends MoveableGameObject{
    constructor(graphic, speed, atkSpd, aimAngle, shootInterval, specialAtkInterval, health, damage){
        super(graphic);
        
        this.speed = speed;
        
        this.atkSpd = atkSpd;
        this.aimAngle = aimAngle;
        this.shootInterval = shootInterval;
        this.specialAtkInterval = specialAtkInterval;
        
        this.health = health;
        
        this.damage = damage;
        
        this.type = 'Player';
        
        this.shootBehavior = new ShootBehavior(this.atkSpd, this.aimAngle, this.shootInterval, this.specialAtkInterval);
        
        createjs.Ticker.on('tick', this.update.bind(this));
    }
    update(){
        this.movementHandler();
        //restrict to game space - use function from physics.js
        restrictToGameSpace(this);
        //calling shoot behavior update
        this.shootBehavior.update();
    }
    movementHandler(){
        if (keyboardMoveLeft){
            this.velocity.x = -this.speed;
            this.x += this.velocity.x;
        } 
        if (keyboardMoveRight){
            this.velocity.x = this.speed;
            this.x += this.velocity.x;
        } 
        if (keyboardMoveUp){
            this.velocity.y = -this.speed;
            this.y += this.velocity.y;
        } 
        if (keyboardMoveDown){
            this.velocity.y = this.speed;
            this.y += this.velocity.y;
        }
    }
    reduceHealth(points){
        this.health-=points;
        if (this.health<=0){
            gameOver = true;
            console.log("Game over!");
        }
    }
}
//general Enemy class - base for special types of enemies which implement different behavior classes
class Enemy extends MoveableGameObject{
    constructor(graphic, speed, damage){
        super(graphic);
        
        this.speed = speed; 
        
        this.damage = damage;
        
        this.type = 'Enemy';
        
        this.chaseBehavior = new ChaseBehavior();
        
        createjs.Ticker.on('tick', this.update.bind(this));
    }
    update(){
        super.update();
        //just for testing purpose - later will be replace with chasing behavior
//            this.velocity.y = this.speed;
//            if ((this.y + this.graphic.image.height * this.graphic.scale >= stage.canvas.height)
//               ||(this.y <= 0)){
//                this.speed = -this.speed;
//                this.velocity.y = this.speed;
//            }
        this.chasePlayer();
    }
    chasePlayer(){
        this.chaseBehavior.moveToPoint(player.x-this.x,player.y-this.y,this.speed);
        this.velocity.x = this.chaseBehavior.velocity.x;
        this.velocity.y = this.chaseBehavior.velocity.y;
    }
}
//sub class - for melee minions
class MeleeEnemy extends Enemy{
    constructor(graphic, speed, damage, atkInterval){
        super(graphic,speed,damage);
        
        this.atkInterval = atkInterval;
        this.atkCounter = 0;
        
        this.type = "Melee";
    }
    dealMeleeDamage(){
        if (this.atkCounter > (this.atkInterval * createjs.Ticker.framerate)){
            this.atkCounter = 0; 
            player.reduceHealth(this.damage);
            console.log("Melee minion "+ this.id + " hits player. Player health: "+ player.health);
        }
    }
}
//sub class - for ranged minions
class RangedEnemy extends Enemy{
    constructor(graphic, speed, damage, atkSpd, aimAngle, shootInterval, specialAtkInterval, minDistance){
        super(graphic,speed,damage);
        
        this.type = "Ranged";
        
        this.atkSpd = atkSpd;
        this.aimAngle = aimAngle;
        this.shootInterval = shootInterval;
        this.specialAtkInterval = specialAtkInterval;
        
        this.shootBehavior = new ShootBehavior(this.atkSpd, this.aimAngle, this.shootInterval, this.specialAtkInterval);
        
        this.minDistance = minDistance;
        
        this.temp = this.speed;
        
        createjs.Ticker.on('tick', this.update.bind(this));
    }
    update(){
        super.update();
        //calling shoot behavior update
        this.shootBehavior.update();
        this.aimAngle = Math.atan2(player.y-this.y,player.x-this.x) / Math.PI * 180;
    }
}
//sub class - for boss lvl 1
//--behavior: wander around and summon minions each interval; if health <= 30%, stop spawning and start to chase player with high speed
class Boss1 extends Enemy{
    constructor(graphic, speed, damage, health, atkInterval, minionsNumber, waveSpawnInterval){
        super(graphic, speed, damage);
        
        this.type = 'Boss 1';
        this.health = health;
        this.minHealthTrigger = health/5;
        
        this.temp = this.speed;
        this.startChasing = false;
        
        this.atkInterval = atkInterval;
        this.atkCounter = 0;
        
        this.minionsNumber = minionsNumber;
        this.spawner = new EnemySpawner(this.minionsNumber);
        this.waveSpawnInterval = waveSpawnInterval;
        this.timer = 0;
        
        this.point = this.chaseBehavior.randomizeAPoint();
        
        createjs.Ticker.on('tick', this.update.bind(this)); 
        this.spawnMeleeMinions();
    }
    update(){
        if (this.health > this.minHealthTrigger){
            this.timer++; 
            
            this.startChasing = false;
            
            //wandering around the stage
            this.moveToRandomPoint();
            if (this.chaseBehavior.distance < 10){
                this.point = this.chaseBehavior.randomizeAPoint();
            }
            
            if (this.timer > (this.waveSpawnInterval * createjs.Ticker.framerate)){
                this.timer = 0;
                this.spawnRandomMinions();
            }
            
        }else {
            console.log('Boss starts to chase player!');
            this.timer = 0;
            this.speed = this.temp*2;
            this.startChasing = true;
            this.chasePlayer();
        }
        
        this.x+= this.velocity.x;
        this.y += this.velocity.y;
    }
    moveToRandomPoint(){
        this.chaseBehavior.moveToPoint(this.point.x-this.x, this.point.y-this.y, this.speed);
        this.velocity.x = this.chaseBehavior.velocity.x;
        this.velocity.y = this.chaseBehavior.velocity.y;
    }
    spawnMeleeMinions(){
        this.spawner.spawnAtSpecifiedPosition(this.x + this.graphic.image.width/2 * this.graphic.scale, this.y+ this.graphic.image.height/2 * this.graphic.scale, 0, false);
    }
    spawnRandomMinions(){
        this.spawner.spawnAtSpecifiedPosition(this.x + this.graphic.image.width/2 * this.graphic.scale, this.y+ this.graphic.image.height/2 * this.graphic.scale, 0, true);
    }
    dealMeleeDamage(){
        if (this.startChasing && (this.atkCounter > (this.atkInterval * createjs.Ticker.framerate))){
            this.atkCounter = 0; 
            player.reduceHealth(this.damage);
            console.log("Boss hits player. Player health: "+ player.health);
        }
    }
    reduceHealth(points){
        this.health -= points;
        if (this.health<=0){
            nextLevel = true;
            console.log("Level 1 finished!");
        }
    }
}
//Bullet 
class Bullet extends MoveableGameObject{
    constructor(graphic, lifeTime, source){
        super(graphic);
        
        this.speed = BULLET_SPEED; 
        
        this.lifeTime = lifeTime;
        this.source = source;
        this.timer = 0;
        
        createjs.Ticker.on('tick', this.update.bind(this));
    }
    update(){
        super.update();
        
        //remove when lifetime ends
        this.timer++;
        if (this.timer > (this.lifeTime * createjs.Ticker.framerate)){
            this.timer = 0;
            this.selfDestroy();
        }   
    }
    hitPlayer(){ //more than 1 instance at the same time ->> need to call this in a loop running through bullets list so that it only invokes once
        player.reduceHealth(this.source.damage);
        console.log("Ranged minion "+ this.source.id + " bullet " + this.id + " hits player. Player health: "+ player.health);
    }
    hitEnemy(){
        for(var i=0 ; i <enemies.length; ++i){
            if (checkCollisionSprSpr(this,enemies[i])){      
                if (enemies[i].type == 'Boss 1'){
                    enemies[i].reduceHealth(this.source.damage);
                    console.log("Hit "+ enemies[i].type + ". Target health: "+ enemies[i].health);
                    this.selfDestroy();
                } else {
                    this.selfDestroy();
                    stage.removeChild(enemies[i]);
                    enemies.splice(i, 1);
                    console.log('Hit enemy' + i);
                }
            }
        }
    }
    hitProp(){
        for(var i=0 ; i <blocks.length; ++i){
            if (checkCollisionSpriteRect(this,blocks[i])){
                this.selfDestroy();
            }
        }
    }
    selfDestroy(){
        stage.removeChild(this);
        for (var i=0; i<bullets.length; ++i){
            if (bullets[i] === this){
                bullets.splice(i,1);
            }
        }
    }
}
//Shooting Behavior
class ShootBehavior {
    constructor(atkSpd, aimAngle, shootInterval, specialAtkInterval){
        this.atkSpd = atkSpd; 
        this.aimAngle = aimAngle;
        this.atkCounter = 0;
        this.shootInterval = shootInterval;
        this.specialAtkInterval = specialAtkInterval;
    }
    update(){
        this.atkCounter += this.atkSpd;
    }
    performAtk(source){
        if (this.atkCounter > (this.shootInterval * createjs.Ticker.framerate)){
            this.atkCounter = 0;
            //generate bullet 
            console.log(source.type + source.id + " Normal shoot");
            //play SFX
            playSound("Normal Shoot");
            //
            this.generateBullet(source);
        }
    }
    performSpecialAtk(source){
        if (this.atkCounter > (this.specialAtkInterval * createjs.Ticker.framerate)){
            this.atkCounter = 0;
            //generate 3 bullets 
            console.log(source.type + source.id + " Special shoot");
            //play SFX
            playSound("Special Shoot");
            //
//            this.generateBullet(source,source.aimAngle - 5);
//			this.generateBullet(source,source.aimAngle);
//			this.generateBullet(source,source.aimAngle + 5);
            for(var i = 0 ; i < 360; i+=60){
				this.generateBullet(source, i);
			}
        }
    }
    generateBullet(source, aimOverwrite){
        var spawnPosX = source.x + source.graphic.image.width * source.graphic.scale/2;
        var spawnPosY = source.y + source.graphic.image.height * source.graphic.scale/2;

//        var bullet = new Bullet(drawImage('images/playerBullet.png', .2, spawnPosX, spawnPosY),
//                               5, source.type);
        var bullet = new Bullet(drawPreloadedImage(preloader.queue.getResult("Projectile"), .2, spawnPosX, spawnPosY), 5, source);

        var angle;
        if(aimOverwrite !== undefined)
            angle = aimOverwrite;
        else angle = source.aimAngle;

        bullet.velocity.x = Math.cos(angle/180*Math.PI)*bullet.speed;
        bullet.velocity.y = Math.sin(angle/180*Math.PI)*bullet.speed;
        
        bullets.push(bullet);
    }
}
//Chasing behavior
class ChaseBehavior{
    constructor(){
        this.velocity = {
          x:0,
          y:0
        }
        this.distance = 0;
    }
    moveToPoint(dirX,dirY,speed){
        var angle = Math.atan2(dirY,dirX);
        this.velocity.x = Math.cos(angle)*speed;
        this.velocity.y = Math.sin(angle)*speed;
        
        this.calcDistanceToPoint(dirX,dirY);
    }
    calcDistanceToPoint(dirX,dirY){
        this.distance = Math.sqrt(dirX*dirX + dirY*dirY);
    }
    randomizeAPoint(){
        var point = {x:0,y:0};
        point.x = Math.random()*(canvas.width+1-200); 
        point.y = Math.random()*(canvas.height+1-200);
        return point;
    }
}