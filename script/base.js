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
    constructor(graphic, speed, atkSpd, aimAngle, shootInterval, specialAtkInterval){
        super(graphic);
        
        this.speed = speed;
        
        this.atkSpd = atkSpd;
        this.aimAngle = aimAngle;
        this.shootInterval = shootInterval;
        this.specialAtkInterval = specialAtkInterval;
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
}
//general Enemy class - base for special types of enemies which implement different behavior classes
class Enemy extends MoveableGameObject{
    constructor(graphic, speed){
        super(graphic);
        
        this.speed = speed; 
        
        this.type = 'Enemy';
        
        createjs.Ticker.on('tick', this.update.bind(this));
    }
    update(){
        super.update();
        //just for testing purpose - later will be replace with chasing behavior
            this.velocity.y = this.speed;
            if ((this.y + this.graphic.image.height * this.graphic.scale >= stage.canvas.height)
               ||(this.y <= 0)){
                this.speed = -this.speed;
                this.velocity.y = this.speed;
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
        //remove when lifetime ends and later, when colliding with objects
        var toRemove = false
        this.timer++;
        if (this.timer > (this.lifeTime * createjs.Ticker.framerate)){
            toRemove = true;
        }
        
        for(var i=0 ; i <blocks.length; ++i){
            if (checkCollisionSpriteRect(this,blocks[i])){
                toRemove = true;
            }
        }
        
        for(var i=0 ; i <enemies.length; ++i){
            if (this.source === 'Player'){
                if (checkCollisionSprSpr(this,enemies[i])){
                    toRemove = true;
                    stage.removeChild(enemies[i]);
                    enemies.splice(i, 1);
                    console.log('Hit enemy' + i);
                }
            }
        }
        
        if(toRemove){
			stage.removeChild(this);
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
            console.log("Normal shoot");
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
            console.log("Special shoot");
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
        var bullet = new Bullet(drawPreloadedImage(preloader.queue.getResult("Projectile"), .2, spawnPosX, spawnPosY),
                               5, source.type);

        var angle;
        if(aimOverwrite !== undefined)
            angle = aimOverwrite;
        else angle = source.aimAngle;

        bullet.velocity.x = Math.cos(angle/180*Math.PI)*bullet.speed;
        bullet.velocity.y = Math.sin(angle/180*Math.PI)*bullet.speed;
    }
}