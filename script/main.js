//CONSTANTS
const KEYCODE_W = 87;
const KEYCODE_A = 65;
const KEYCODE_S = 83;
const KEYCODE_D = 68;
const PLAYER_SPEED = 3;
const BULLET_SPEED = 10;
const PLAYER_HEALTH = 10;

// --WEAPON STATS--//
const KEYCODE_1 = 49;
const KEYCODE_2 = 50;
const KEYCODE_3 = 51;

const NORMAL_ATKSPD = 1;
const NORMAL_MIN = 1;
const NORMAL_MAX = 3; 

const SMALL_ATKSPD = 2;
const SMALL_MIN = 1;
const SMALL_MAX = 1;

const LARGE_ATKSPD = .5;
const LARGE_MIN = 2;
const LARGE_MAX = 4;

/* Game states and state events */
var GameStates = { 
    RUN_SCENE:0,
    MAIN_MENU:10,
    LEVEL_1:20,
    LEVEL_2:30,
    LEVEL_3:40,
    GAME_COMPLETE:50,
    GAME_LOSE:60
};
var GameStateEvents = { 
    MAIN_MENU:'main menu event',
    GAME_COMPLETE:'game complete event',
    GAME_LOSE:'game lose event',
    MAIN_MENU_SELECT:'game menu select event',
    LEVEL_1:'game level 1 event',
    LEVEL_2:'game level 2 event',
    LEVEL_3:'game level 3 event'
};

/* Settings - global variables */
var canvas = document.getElementById('game-canvas');
var context = canvas.getContext('2d');
var stage = new createjs.Stage(canvas);
var version = '1.0.0';

var preloader = new Preloader();
var fakeProgress = 0;
var loadInterval; 

var comp=AdobeAn.getComposition("1977E17A7A7E4A0591398ED1B9A11F5A");
var lib=comp.getLibrary();

var textSpriteSheet;

var sceneManager = new SceneManager();

var nextLevel = false;
var gameOver = false;

var levelData1 = new LevelData();
    levelData1.setData(1);
var levelData2 = new LevelData();
    levelData2.setData(2);
var levelData3 = new LevelData();
    levelData3.setData(3);

/* Player specific */
var keyboardMoveLeft = false, keyboardMoveRight = false, keyboardMoveUp = false, keyboardMoveDown = false;
var keyboard1 = false, keyboard2 = false, keyboard3 = false;

var player;
var aimIndicator;

var playerAtkSpd = 1; //can be changed with pickups
var playerAimAngle = 0;  //changing depending on mouse position 
var playerShootInterval = 1; 
var playerSpecialAtkInterval = 3;  
var playerMinDmg = 1;
var playerMaxDmg =3;

/* Common data */
var enemies = [];

var boss;

var bullets = [];

var pickups = [];

//HUD
var hudContainer;
var healthBarObj;
var timerObj;
var smallAmmoDisplay;
var largeAmmoDisplay;

//calling init() function on page load
init();

function init(){
    //set up auto-update on stage
    createjs.Ticker.framerate = 60;
    createjs.Ticker.on('tick',stage);
    
    retinalize();
    
    intialLog();
    
    try{
        loadGraphics();
    }
    catch(e){
        location.reload();
    }
    
    window.addEventListener("click", resumeAudioContext);
}
//for retina display 
function retinalize(){
    stage.width = canvas.width;
    stage.height = canvas.height;

    let ratio = Window.devicePixelRatio;
    if (ratio === undefined){
    return;
    }

    canvas.setAttribute('width', Math.round(stage.width * ratio));
    canvas.setAttribute('height', Math.round(stage.height * ratio));

    stage.scaleX = stage.scaleY = ratio;

    //set CSS style
    canvas.style.width = stage.width + "px";
    canvas.style.height = stage.height + "px";
}
function intialLog(){
    console.log(`Welcome to the game. Version ${version}`);
}
function loadGraphics(){
    preloader.addFile("loadingScreen", "images/loadingScreenBG.jpg");
    preloader.loadFiles();
    //loader.addEventListener("fileload", function(evt){handleFileLoad(evt,comp)});
    preloader.queue.addEventListener("complete", handleComplete, this);

    function handleComplete() {
        preloader.queue.removeAllEventListeners();
        this.preloadAssets();
    }
}
function preloadAssets(){
    /*LOADING SCREEN*/
//        sceneManager.createGameTitle();
//        sceneManager.createCopyrightText();
        sceneManager.createLoadingScene();
    
        //preloader jobs
        preloader.createLoadingBar(canvas.width,20,canvas.width/2,canvas.height-10);
        preloader.installSoundPlugin();
        createjs.Sound.alternateExtensions = ["ogg", "aiff"];
    
//        preloader.addFile("Player", "images/player.png");
//        preloader.addFile("Boss", "images/enemy.png");
//        preloader.addFile("Melee", "images/melee.png");
//        preloader.addFile("Ranged", "images/ranged.png");
//        preloader.addFile("Projectile", "images/playerBullet.png");
        preloader.addFile("AimIndicator", "images/aimIndicator.png");
//        preloader.addFile("HealthPickup", "images/upgrade2.png");
    
        preloader.addFile("font", "font/TheDarkRootFont.png");
    
        preloader.addFile("Normal Shoot", "sound/shoot1.wav");
        preloader.addFile("Special Shoot", "sound/shoot2.wav");
        preloader.addFile("Background1","sound/EpicTheme.mp3");
    
        preloader.addFiles(lib.properties.manifest);
        
        preloader.loadFiles();

        //loadInterval = setInterval(updateLoadingBar, 50);
        preloader.queue.on("progress", function(){
            preloader.updateLoadingBar(preloader.loadingBar, "#ffffcc", "fff");
        })
    
        preloader.queue.on("complete", function(){
            preloader.queue.removeAllEventListeners("complete");
            try{
                setTimeout(handleComplete,3000);
            }
            catch(e){
                location.reload();
            }
        });
}
function handleComplete(){
    try{
        var ss=comp.getSpriteSheet();
        var ssMetadata = lib.ssMetadata;
        for(var i=0; i<ssMetadata.length; i++) {
            ss[ssMetadata[i].name] = new createjs.SpriteSheet( {"images": [preloader.queue.getResult(ssMetadata[i].name)], "frames": ssMetadata[i].frames} )
        }    
    }
    catch(e){
        location.reload();
    }
    finally{
        stage.removeAllChildren();
        sceneManager.gameReady();
    }
}

/* HANDLE AUDIO CONTEXT FOR AUTOPLAY POLICY ON CHROME AND SAFARI*/
function resumeAudioContext(){
    // handler for fixing suspended audio context in Chrome
    try {
        if (createjs.WebAudioPlugin.context && createjs.WebAudioPlugin.context.state === "suspended") {
            createjs.WebAudioPlugin.context.resume();
            // Should only need to fire once
            window.removeEventListener("click", resumeAudioContext);
        }
    } 
    catch (e) {
        // SoundJS context or web audio plugin may not exist
        console.error("There was an error while trying to resume the SoundJS Web Audio context...");
        console.error(e);
    }
}
/*LOADING BAR*/
//function updateLoadingBar(){
//    fakeProgress += .005;
//    
//    preloader.loadingBar.graphics.beginFill("#ffffcc");
//        
//    preloader.loadingBar.graphics.drawRect(0, 0, preloader.loadingBar.getBounds().width *               fakeProgress, preloader.loadingBar.getBounds().height);
//
//    preloader.loadingBar.graphics.endFill();
//
//    preloader.loadingBar.graphics.setStrokeStyle(2);
//    preloader.loadingBar.graphics.beginStroke("#fff");
//
//    preloader.loadingBar.graphics.drawRect(0, 0, preloader.loadingBar.getBounds().width,                   preloader.loadingBar.getBounds().height);
//
//    preloader.loadingBar.graphics.endStroke();
//    
//    if (fakeProgress >= 1){
//        try{
//            var ss=comp.getSpriteSheet();
//            var ssMetadata = lib.ssMetadata;
//            for(var i=0; i<ssMetadata.length; i++) {
//                ss[ssMetadata[i].name] = new createjs.SpriteSheet( {"images": [preloader.queue.getResult(ssMetadata[i].name)], "frames": ssMetadata[i].frames} )
//            }    
//        }
//        catch(e){
//            location.reload();
//        }
//        finally{
//            clearInterval(loadInterval);
//            stage.removeAllChildren();
//            sceneManager.gameReady();
//        }
//    }
//}