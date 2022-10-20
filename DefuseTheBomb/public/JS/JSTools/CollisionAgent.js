import { EnemyBehaviors } from "./EnemyBeahaviors.js";
import { PlayerBehaviors } from "./PlayerBeahaviors.js";
import { PointBehaviors } from "./PointBeahaviors.js";

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

    /**
     * Check if the player is colliding with any object.
     */
    checkCollisionEnemy(obj) {
        let collision = false;
        for (let i = 0; i < this.collisionEnemy.length; i++) {
            if (this.collisionEnemy[i].isColliding(obj)) {
                collision = true;
                break;
            }
        }
        return collision;
    }

    checkCollisionPoint(obj) {
        let collision = false;
        for (let i = 0; i < this.collisionPoint.length; i++) {
            if (this.collisionPoint[i].isColliding(obj)) {
                collision = true;
                break;
            }
        }
        return collision;
    }


}