// Much of the raycasting code was taken from
// https://www.youtube.com/watch?v=2VX8uD_xUlM&t=610s
// and https://www.udemy.com/course/game-development-in-js-the-complete-guide-w-phaser-3/ 

/** Allows classes to access similar functions */
export default {
    // create a collider between "this" object and collision object
    addCollider(collisionObject, callback) {
        this.scene.physics.add.collider(this, collisionObject, callback, null, this);
        return this;
    },

    bodyPositionDifferenceX: 0,
    prevRay: null,
    prevHasHit: null,
  
    raycast(body, layer, {raylength = 30, precision = 0, steepness = 1}) {
        const { x, y, width, halfHeight } = body;

        this.bodyPositionDifferenceX += body.x - body.prev.x;

        if ((Math.abs(this.bodyPositionDifferenceX) <= precision) && this.prevHasHit !== null) {
            return {
                ray: this.prevRay,
                hasHit: this.prevHasHit
            }
        }
  
        const line = new Phaser.Geom.Line();
        let hasHit = false;

        // defines how ray is drawn
        switch(body.facing) {
            case Phaser.Physics.Arcade.FACING_RIGHT: {
                line.x1 = x + width;
                line.y1 = y + halfHeight;
                line.x2 = line.x1 + raylength * steepness;
                line.y2 = line.y1 + raylength;
                break;
            }
            case Phaser.Physics.Arcade.FACING_LEFT: {
                line.x1 = x;
                line.y1 = y + halfHeight;
                line.x2 = line.x1 - raylength * steepness;
                line.y2 = line.y1 + raylength;
                break;
            }
        }
  
        const hits = layer.getTilesWithinShape(line);
  
        if (hits.length > 0) {
            // some will return true if at least one element satisfy the condition hit.index !== -1
            hasHit = this.prevHasHit = hits.some(hit => hit.index !== -1);
        }

        this.prevRay = line;
        this.bodyPositionDifferenceX = 0;
  
        return { ray: line, hasHit };
    }
}