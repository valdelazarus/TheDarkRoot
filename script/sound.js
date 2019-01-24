//functions to register sound, play sound with soundPath parameters

//always call this function first (at init)
function registerSound(soundPath, name){
    createjs.Sound.registerSound(soundPath, name);
}

//play sound and return instance of the sound playing
function playSound(soundName, volume){ //usind name of registered sound
    var instance = createjs.Sound.play(soundName);
    instance.volume = volume;
}

//set sound volume
function setSoundVolume(soundInstance, volume){
    soundInstance.volume = volume;
}