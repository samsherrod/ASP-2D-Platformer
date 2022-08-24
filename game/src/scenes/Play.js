// class that sets up the main game functionality
// creates initial scene, tilemap, tile layers, player and enemies

import Player from '../Characters/Player/Player.js';
import Enemies from '../Characters/Enemies/Enemies.js';

class Play extends Phaser.Scene {
    constructor(config) {
        super('PlayScene');
        this.config = config;
    }
      
    // sets up the game
    create ()
    {
        const map = this.createMap();
        const layers = this.createLayers(map);
        const playerSpawns = this.getPlayerSpawns(layers.playerSpawns);
        const player = this.createPlayer(playerSpawns.sceneEntrance);
        const enemies = this.createEnemies(layers.enemySpawns);

        // custom function that allows the player to collide with any layer
        this.createPlayerColliders(player, {
            colliders: {
                platformsColliders: layers.platformsColliders
            }
        });

        // custom function that allows the player to collide with any layer
        this.createEnemyColliders(enemies, {
            colliders: {
                platformsColliders: layers.platformsColliders,
                player
            }
        });
        

        this.createSceneExit(playerSpawns.sceneExit, player)
        this.setupCameraToFollow(player);

        this.enableFullScreenMode();
    }

    // https://phaser.io/examples/v3/view/input/keyboard/single-keydown-event
    // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/fullscreen/
    // enables or disables full screen mode - press Z to activate
    // contains error handling in the event that enabling fullscreen does not work
    enableFullScreenMode() {
        this.input.keyboard.on('keydown-Z', function (event) {
            try {
                if (this.scene.scale.isFullscreen) {
                    this.scene.scale.stopFullscreen();
                    // On stop fulll screen
                } else {
                    this.scene.scale.startFullscreen();
                    // On start fulll screen
                }
            }
            catch(err) {
                console.log('Error is ' + err);
            }
        });
    }

    createMap() {
        // create a tilemap after loading the Tiled json tilemap file in the preload class
        // by referencing the key 'crystal_world_map' 
        // (from the .json tile map named 'world_map_crystal.json')
        const map = this.make.tilemap({key: 'crystal_world_map'});

        // Adds an image to the map to be used as a tileset.
        // Image is loaded from preload class with the appropriate tileset name,
        // which can be found in the json file
        map.addTilesetImage('crystal_tileset_lev1', 'tiles-1');

        return map;
    }

    createLayers(map) {
        const tileset1 = map.getTileset('crystal_tileset_lev1')

        // creating environment and platform layers from tileset
        // ORDER OF CODE MATTERS - platforms_collider is behind environment layer
        // end environment layer is behind platforms layer
        const platformsColliders = map.createLayer('platforms_colliders', tileset1);
        const environment = map.createLayer('environment', tileset1);
        const platforms = map.createLayer('platforms', tileset1);
        const playerSpawns = map.getObjectLayer('player_spawns');
        const enemySpawns = map.getObjectLayer('enemy_spawns');

        // https://phaser.io/examples/v3/view/tilemap/set-colliding-by-property
        // Instead of setting collision by index, you can set collision via properties that you set up
        // in Tiled. You can assign properties to tiles in the tileset editor.
        // The platforms_colliders layer only has tiles with a boolean "collides" property,
        // so by seting this layer to collides: true, every tile in this layer is collidable
        platformsColliders.setCollisionByProperty({collides: true});

        return { environment, platforms, platformsColliders, playerSpawns, enemySpawns };
    }

    // creates the player from a new instance of the player class
    createPlayer(sceneEntrance) {
        return new Player(this, sceneEntrance.x, sceneEntrance.y);
    }

    /* Creates an array of all enemies regardless of the type in order
      to be able to group all enemies together.
      At each iterated spawnPoint in the enemySpawns layer, looks up the keys of each
      enemyType by accessing the enemy's spawnPoint.type, and then creates a new enemy
      of that type at that enemy's spawnPoint.x/.y properties. It then adds each enemy
      to an array and returns that array in order to be able to group all enemies together.
    */
    createEnemies(spawnLayer) {
        const enemies = new Enemies(this);
        const enemyTypes = enemies.getTypes();

        spawnLayer.objects.forEach(spawnPoint => {
            const enemy = new enemyTypes[spawnPoint.type](this, spawnPoint.x, spawnPoint.y);
            enemies.add(enemy);
        })

        return enemies;
    }

    // adds colliders to player
    createPlayerColliders(player, { colliders }) {
        player.addCollider(colliders.platformsColliders);
    }

    // adds colliders to the group of enemies
    createEnemyColliders(enemies, { colliders }) {
        enemies
            .addCollider(colliders.platformsColliders)
            .addCollider(colliders.player);
    }

    // creates main camera that follows player, size of camera is confined to the
    // maps width and height. Parameters are defined in config in index.js
    setupCameraToFollow(player) {
        const {mapWidth, mapHeight, zoomFactor} = this.config;

        this.physics.world.setBounds(0, 0, mapWidth, mapHeight + 200);
        const mainCamera = this.cameras.main;
        mainCamera.setBounds(0, 0, mapWidth, mapHeight);
        mainCamera.setZoom(zoomFactor);
        mainCamera.startFollow(player);
        return mainCamera;
    }

    getPlayerSpawns(playerSpawnLayer) {
        const playerSpawns = playerSpawnLayer.objects;
        return {
            sceneEntrance: playerSpawns.find(spawn => spawn.name === 'sceneEntrance'),
            sceneExit: playerSpawns.find(spawn => spawn.name === 'sceneExit')
        }
    }

    createSceneExit(exit, player) {
        const endOfScene = this.physics.add.sprite(exit.x, exit.y, 'sceneExit')
            .setSize(5, this.config.height * 2)
            .setOrigin(0.5, 1)
            .setAlpha(0);

        this.physics.add.overlap(player, endOfScene, () => {
            console.log("player should transition to next scene");
        });
    }
}

// export Play class to be used in index.js
export default Play;