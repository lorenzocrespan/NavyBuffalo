import { setGameOver } from "../Core.js";
import { EnemyBehaviour } from "../OBJBehaviour/EnemyBehaviour.js";
import { PlayerBehaviour } from "../OBJBehaviour/PlayerBehaviour.js";
import { PointBehaviour } from "../OBJBehaviour/PointBeahaviour.js";

let cubeDimension = 1;
let playerScore = 0;

export class CollisionAgent {
	constructor() {
		this.collisionPlayer;
		this.collisionEnemy = [];
		this.collisionPoint = [];
		this.collisionUpgrade = [];
		playerScore = 100;
		document.getElementById("playerScore").textContent = playerScore;
	}

	/**
	 * Add a new collision object to the list of objects to check for collisions.
	 */
	addCollisionObject(collisionObject) {
		console.debug(
			"CollisionAgent.js - Adding collision object: " + collisionObject
		);
		switch (true) {
			case collisionObject instanceof PlayerBehaviour:
				this.collisionPlayer = collisionObject;
				break;
			case collisionObject instanceof EnemyBehaviour:
				this.collisionEnemy.push(collisionObject);
				break;
			case collisionObject instanceof PointBehaviour:
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
		console.log(
			"CollisionAgent.js - Upgrades: " + this.collisionUpgrade.length
		);
	}

	printPlayerPosition() {
		console.log(
			"CollisionAgent.js - Player position: " +
				this.collisionPlayer.position.x +
				", " +
				this.collisionPlayer.position.y +
				", " +
				this.collisionPlayer.position.z
		);
	}

	checkOverlap(enemy, player, radius) {
		var distX = Math.abs(enemy.position.x - player.x - cubeDimension / 2);
		var distZ = Math.abs(enemy.position.z - player.z - cubeDimension / 2);

		if (distX > cubeDimension / 2 + radius) {
			return false;
		}
		if (distZ > cubeDimension / 2 + radius) {
			return false;
		}

		if (distX <= cubeDimension / 2) {
			return true;
		}
		if (distZ <= cubeDimension / 2) {
			return true;
		}

		var dx = distX - cubeDimension / 2;
		var dy = distZ - cubeDimension / 2;
		return dx * dx + dy * dy <= radius * radius;
	}

	checkOverlapCircle(circle1, circle2, radius) {
		var dx = circle1.position.x - circle2.position.x;
		var dy = circle1.position.z - circle2.position.z;
		var distance = Math.sqrt(dx * dx + dy * dy);

		if (distance < radius) {
			return true;
		} else {
			return false;
		}
	}

	checkCollisionEnemyWithEnemy(precision) {
		for (let i = 0; i < this.collisionEnemy.length; i++) {
			for (let j = 0; j < this.collisionEnemy.length; j++) {
				if (i != j) {
					if (
						this.checkOverlapCircle(
							this.collisionEnemy[i],
							this.collisionEnemy[j],
							0.5
						)
					) {
						let directionAfterCollisionX =
							this.collisionEnemy[i].position.x -
							this.collisionEnemy[j].position.x;
						let directionAfterCollisionZ =
							this.collisionEnemy[i].position.z -
							this.collisionEnemy[j].position.z;
						// console.log("CollisionAgent.js - Collision between enemy " + i + " and enemy " + j);
						this.collisionEnemy[i].changeDirection(
							directionAfterCollisionX,
							directionAfterCollisionZ
						);
					}
				}
			}
		}
	}

	/**
	 * Check if the player is colliding with any object.
	 */
	checkCollisionEnemy(positionOld, positionNew, precision) {
		let collision = false;
		let distanceX = positionNew.x / precision;
		let distanceZ = positionNew.z / precision;
		let position = {
			x: positionOld.x,
			z: positionOld.z,
		};
		for (let i = 0; i < this.collisionEnemy.length; i++) {
			// Check if in intermediate positions there is a collision
			for (let j = 0; j < precision; j++) {
				position.x += distanceX;
				position.z += distanceZ;
				if (this.checkOverlap(this.collisionEnemy[i], position, 0.5)) {
					setGameOver();
					collision = true;
					break;
				}
			}
		}
		return collision;
	}

	checkCollisionPoint(positionOld, positionNew, precision) {
		let collision = false;
		let distanceX = positionNew.x / precision;
		let distanceZ = positionNew.z / precision;
		let position = {
			x: positionOld.x,
			z: positionOld.z,
		};
		for (let i = 0; i < this.collisionPoint.length; i++) {
			// Check if in intermediate positions there is a collision
			for (let j = 0; j < precision; j++) {
				position.x += distanceX;
				position.z += distanceZ;
				if (this.checkOverlap(this.collisionPoint[i], position, 0.5)) {
					console.log("Collision with point");
					// Setup new center of player
					j += 30;
					positionNew.x = j * distanceX;
					positionNew.z = j * distanceZ;
					playerScore += 1;
					// Update html score
					document.getElementById("playerScore").textContent = playerScore;
					this.collisionPoint[i].changePosition();
					collision = true;
					break;
				}
			}
			return collision;
		}
	}
}
