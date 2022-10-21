import { EnemyBehaviors } from "./EnemyBeahaviors.js";
import { PlayerBehaviors } from "./PlayerBeahaviors.js";
import { PointBehaviors } from "./PointBeahaviors.js";

let cubeDimension = 1;

export class CollisionAgent {

    constructor() {
        this.collisionPlayer;
        this.collisionEnemy = [];
        this.collisionPoint = [];
        this.collisionUpgrade = [];
    }

    /**
    * Add a new collision object to the list of objects to check for collisions.
    */
    addCollisionObject(collisionObject) {
        console.debug("CollisionAgent.js - Adding collision object: " + collisionObject);
        switch (true) {
            case collisionObject instanceof PlayerBehaviors:
                this.collisionPlayer = collisionObject;
                break;
            case collisionObject instanceof EnemyBehaviors:
                this.collisionEnemy.push(collisionObject);
                break;
            case collisionObject instanceof PointBehaviors:
                this.collisionPoint.push(collisionObject);
                break;
            default:
                break;
        }
    }

    countCollisionObject() {
        console.log("CollisionAgent.js - List of all objects:");
        console.log("CollisionAgent.js - Enemies: " + this.collisionEnemy.length);
        console.log("CollisionAgent.js - Points: " + this.collisionPoint.length);
        console.log("CollisionAgent.js - Upgrades: " + this.collisionUpgrade.length);
    }

    printPlayerPosition() {
        console.log("CollisionAgent.js - Player position: " + this.collisionPlayer.position.x + ", " + this.collisionPlayer.position.y + ", " + this.collisionPlayer.position.z);
    }

    checkOverlap(enemy, player, radius) {
        var distX = Math.abs(enemy.position.x - player.position.x - cubeDimension / 2);
        var distZ = Math.abs(enemy.position.z - player.position.z - cubeDimension / 2);

        if (distX > (cubeDimension / 2 + radius)) {
            return false;
        }
        if (distZ > (cubeDimension / 2 + radius)) {
            return false;
        }

        if (distX <= (cubeDimension / 2)) {
            return true;
        }
        if (distZ <= (cubeDimension / 2)) {
            return true;
        }

        var dx = distX - cubeDimension / 2;
        var dy = distZ - cubeDimension / 2;
        return (dx * dx + dy * dy <= (radius * radius));
    }

    /**
     * Check if the player is colliding with any object.
     */
    checkCollisionEnemy() {
        let collision = false;
        for (let i = 0; i < this.collisionEnemy.length; i++) {
            if (this.checkOverlap(this.collisionEnemy[i], this.collisionPlayer, 0.5)) {
                console.log("Game Over, restart and try again");
                collision = true;
                break;
            }
        }
        return collision;
    }

    checkCollisionPoint() {
        let collision = false;
        for (let i = 0; i < this.collisionPoint.length; i++) {
            if (this.checkOverlap(this.collisionPoint[i], this.collisionPlayer, 0.3)) {
                this.collisionPoint[i].changePosition();
                collision = true;
                break;
            }
        }
        return collision;
    }



}