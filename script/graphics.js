//draw a circle with color, radius and positions
drawCircle = function(color, radius, posX, posY){
    var circle = new createjs.Shape();
    circle.graphics.beginFill(color).drawCircle(0,0,radius);

    circle.x = posX;
    circle.y = posY;
    circle.radius = radius;

    stage.addChild(circle);
    return circle;
}
//draw a rectangle with color, width, height and positions
drawRect = function(color, width, height, posX, posY){
    var rect = new createjs.Shape();
    rect.graphics.beginFill(color).drawRect(0,0,width,height);

    //changing pivot to center
    rect.regX = width/2;
    rect.regY = height/2;

    //change position after setting pivot
    rect.x = posX;
    rect.y = posY;

    rect.setBounds(rect.regX,rect.regY,width,height);

    stage.addChild(rect);
    return rect;
}
//draw a image sprite with scale and positions
drawImage = function(imagePath, scale, posX, posY){
    var imageObj = new Image();
    imageObj.src = imagePath;

    var image = new createjs.Bitmap(imageObj);

    image.x = posX;
    image.y = posY;

    image.scale = scale;
    
    stage.addChild(image);
    return image;
}