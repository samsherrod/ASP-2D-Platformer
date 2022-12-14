/* An index file that sets up the config paramater and creates
a game with scenes that are loaded from each scene class

Scenes are imported from scenes folder under src
****** import Phaser from 'phaser' should not be included
        since phaser.min.js is in scripts folder and being
        loaded from index.html
*******/

// import the scenes to be loaded into the game
import PlayScene from'./scenes/Play';
import PreloadScene from'./scenes/Preload';

// size of map, may be bigger than width of document.body
// in tiled each tile is 16 x 16
const MAP_WIDTH = 1600;
const MAP_HEIGHT = 640;

const roundHalf = num => Math.round(num * 2) / 2
export const DPR = roundHalf(window.devicePixelRatio)

// https://phaser.discourse.group/t/how-many-pixels-wondering-about-target-resolution/4456/14
// base resolution is 480x270 @4 = 1920x1080
const isMobile = () => Math.min(window.screen.width, window.screen.height) <= 270;
const WIDTH = 480 * (isMobile() ? DPR : 4);
const HEIGHT = 270 * (isMobile() ? DPR : 4);
const ZOOM_FACTOR = 2;
const PARRALLAX_X = 0.3;
const PARRALLAX_Y = 0.1;

// create a custom config object that can be shared between all scenes
const SHARED_CONFIG = {
    mapWidth: MAP_WIDTH,
    mapHeight: MAP_HEIGHT,
    width: WIDTH,
    height: HEIGHT,
    zoomFactor: ZOOM_FACTOR,
    leftTopCorner: {
        x: (WIDTH - (WIDTH / ZOOM_FACTOR)) / 2,
        y: (HEIGHT - (HEIGHT / ZOOM_FACTOR)) / 2
    },
    parrallaxX: PARRALLAX_X,
    parrallaxY: PARRALLAX_Y
}

// create array of scenes, order matters! 
// PreloadScene should be first to preload all assets into memory before
// loading a scene
const Scenes = [PreloadScene, PlayScene];

// store the new Scene function into the variable createScene
const createScene = Scene => new Scene(SHARED_CONFIG)

// iterate through each element in scenes and create a new scene with SHARED_CONFIG paramaters
const initScenes = () => Scenes.map(createScene)

const config = {
    // WebGL (Web graphics Library) JS Api for rendering 2D and 3D graphics
    type: Phaser.AUTO,
    // setups config file with the shared_config paramaters
    ...SHARED_CONFIG,
    //keeps pixel art crisp
    pixelArt: true,
    physics: {
        // Arcade physics plugin, manages physics simulation
        default: 'arcade',
        arcade: {
            // debug: true // uncomment to turn debug mode on for all physics objects in scene
            // for testing purposes
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    parent: 'phaser-game',
    // loads whichever scenes are in the Scenes array
    scene: initScenes()
}

// creates a new Phaser game with the config settings from the Phaser.Game instance
// responsible for setting up game, will not run without it
new Phaser.Game(config)