/*GAME SPACE RESTRICTION*/
//restrict to game space for sprite object
function restrictToGameSpace(spriteObj){
    if(spriteObj.x + spriteObj.graphic.image.width * spriteObj.graphic.scale > stage.canvas.width){
        spriteObj.x = stage.canvas.width - spriteObj.graphic.image.width * spriteObj.graphic.scale;
    }
    if(spriteObj.x  < 0){
        spriteObj.x = 0;
    }
    if(spriteObj.y + spriteObj.graphic.image.height * spriteObj.graphic.scale > stage.canvas.height){
        spriteObj.y = stage.canvas.height - spriteObj.graphic.image.height * spriteObj.graphic.scale;
    }
    if(spriteObj.y < 0){
        spriteObj.y = 0;
    }
}
//restrict to game space for rect
function restrictToGameSpaceForRect(rectObj){
    if(rectObj.x + rectObj.graphic.getBounds().width/2 > stage.canvas.width){
        rectObj.x = stage.canvas.width - rectObj.graphic.getBounds().width/2;
    }
    if(rectObj.x - rectObj.graphic.getBounds().width/2 < 0){
        rectObj.x = rectObj.graphic.getBounds().width/2;
    }
    if(rectObj.y + rectObj.graphic.getBounds().height/2 > stage.canvas.height){
        rectObj.y = stage.canvas.height - rectObj.graphic.getBounds().height/2;
    }
    if(rectObj.y - rectObj.graphic.getBounds().height/2 < 0){
        rectObj.y = rectObj.graphic.getBounds().height/2;
    }
}
//restrict to game space for circle
function restrictToGameSpaceForCircle(circleObj){
    if (circleObj.x + circleObj.graphic.radius > stage.canvas.width){
        circleObj.x = stage.canvas.width - circleObj.graphic.radius;
    }
    if(circleObj.x - circleObj.graphic.radius < 0){
        circleObj.x = circleObj.graphic.radius;
    }
    if (circleObj.y + circleObj.graphic.radius > stage.canvas.height){
        circleObj.y = stage.canvas.height - circleObj.graphic.radius;
    }
    if (circleObj.y - circleObj.graphic.radius < 0){
        circleObj.y = circleObj.graphic.radius;
    }
}

/* COLLISIONS - TRIGGERS */
//check for collision between sprite and rect
function checkCollisionSpriteRect(sprite, rect){
    
    if((sprite.x + sprite.graphic.image.width * sprite.graphic.scale >= rect.x - rect.graphic.getBounds().width/2)
      && (sprite.x  <= rect.x + rect.graphic.getBounds().width/2) 
      && (sprite.y + sprite.graphic.image.height * sprite.graphic.scale >= rect.y - rect.graphic.getBounds().height/2)
      && (sprite.y <= rect.y + rect.graphic.getBounds().height/2)){
        return true;
    }
    
    return false;
}
//check for collision between 2 sprites 
function checkCollisionSprSpr(spr1, spr2){
    var leftBorder1 = spr1.x;
    var rightBorder1 = spr1.x + spr1.graphic.image.width * spr1.graphic.scale;
    var topBorder1 = spr1.y;
    var botBorder1 = spr1.y + spr1.graphic.image.height * spr1.graphic.scale;
    
    var leftBorder2 = spr2.x;
    var rightBorder2 = spr2.x + spr2.graphic.image.width * spr2.graphic.scale;
    var topBorder2 = spr2.y;
    var botBorder2 = spr2.y + spr2.graphic.image.height * spr2.graphic.scale;
    
    if((rightBorder1 >= leftBorder2)
      && (leftBorder1  <= rightBorder2) 
      && (botBorder1 >= topBorder2)
      && (topBorder1 <= botBorder2)){
        return true;
    }
    
    return false;
}

//handle collision between sprite and rect
function handleCollisionSpriteRect(sprite, rect){
    var leftBorder = sprite.x;
    var rightBorder = sprite.x + sprite.graphic.image.width * sprite.graphic.scale;
    var topBorder = sprite.y;
    var botBorder = sprite.y + sprite.graphic.image.height * sprite.graphic.scale;
    
    var rectLeft = rect.x - rect.graphic.getBounds().width/2;
    var rectRight = rect.x + rect.graphic.getBounds().width/2;
    var rectTop = rect.y - rect.graphic.getBounds().height/2;
    var rectBot = rect.y + rect.graphic.getBounds().height/2;
    
    //horizontal collision
    //if (Math.abs(sprite.velocity.x))
    if ((topBorder >= rectTop) && (botBorder <= rectBot)){
        if ((leftBorder <= rectRight) && (leftBorder >= rectLeft)){
            sprite.x = rect.x + rect.graphic.getBounds().width/2;
        } 
        if ((rightBorder >= rectLeft) && (rightBorder <= rectRight)){
            sprite.x = rect.x - rect.graphic.getBounds().width/2 - sprite.graphic.image.width * sprite.graphic.scale;
        }
    }
    //vertical collision
    if ((leftBorder >= rectLeft) && (rightBorder <= rectRight)){
        if ((topBorder <= rectBot) && (topBorder >= rectTop)){
            sprite.y = rect.y + rect.graphic.getBounds().height/2;
        } 
        if ((botBorder >= rectTop) && (botBorder <= rectBot)){
            sprite.y = rect.y - rect.graphic.getBounds().height/2 - sprite.graphic.image.height * sprite.graphic.scale;
        }
    }
}
//handle collision between 2 sprites
