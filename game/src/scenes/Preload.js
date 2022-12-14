/** A class that handles all preload functionality to be loaded before
 *  any other scene in index.js!! */
class Preload extends Phaser.Scene {
    
    constructor() {
        super('PreloadScene');
    }
    
    /** loads all assets into memory */
    preload() {
        // loads tilemap json file - look up json file for detailed info
        this.load.tilemapTiledJSON('crystal_world_map', 'assets/tilemaps/world_map_crystal.json');
        // loads the original artwork
        this.load.image('tiles-1', 'assets/art_maps/crystal_world/main_lev_build_1.png');
        this.load.image('background-spikes-tileset', 'assets/art_maps/crystal_world/bg_spikes_tileset.png');

        this.load.image('bg-spikes-dark', 'assets/art_maps/backgrounds/background03_super_dark.png');
        this.load.image('sky-dark', 'assets/art_maps/backgrounds/background_0.png');
    
        // loads the player sprite sheet
        this.load.spritesheet('player','assets/characters/Gino Character/PNG/idle,run,jump_sheet.png', {
            frameWidth: 32, frameHeight: 64, spacing: 32
        });

        // loads the plagueDoctor sprite sheet
        this.load.spritesheet('plagueDoctor','assets/characters/Enemy04/enemy04_sheet.png', {
            frameWidth: 32, frameHeight: 64, spacing: 32
        });

        // loads the GUI's
        this.load.image('emptyHeart', 'assets/gui/heart.png');
        this.load.image('filledHeart', 'assets/gui/heart-filled.png');
        this.load.image('playerPortrait', 'assets/gui/portrait.png');
        // this.load.image('projectileCount', 'assets/gui/projectile_count.png');
    }

    /** By default, starts the PlayScene after preloading assets */
    create() {
        this.scene.start('PlayScene');
    }
}

// export Preload class to be used in index.js
export default Preload;