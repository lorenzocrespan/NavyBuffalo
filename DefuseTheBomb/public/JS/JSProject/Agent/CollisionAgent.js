import { setGameOver } from "../ControlPanel.js";
import { EnemyBehaviour } from "../OBJBehaviour/EnemyBehaviour.js";
import { PlayerBehaviour } from "../OBJBehaviour/PlayerBehaviour.js";
import { PointBehaviour } from "../OBJBehaviour/PointBeahaviour.js";
import { ModifierBehaviour } from "../OBJBehaviour/ModifierBehaviour.js";

// TODO: Mettere in active il pulsante di reset solo a game over
// TODO: Fare un pulsante di pause/play

let cubeDimension = 1;
let playerScore = 0;

export class CollisionAgent {
	constructor() {
		this.collisionPlayer;
		this.collisionEnemy = [];
		this.collisionPoint = [];
		this.collisionModifier = [];
		playerScore = 0;
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
			case collisionObject instanceof ModifierBehaviour:
				this.collisionModifier.push(collisionObject);
			default:
				break;
		}
	}

	countCollisionObject() {
		console.log("CollisionAgent.js - List of all objects:");
		console.log("CollisionAgent.js - Enemies: " + this.collisionEnemy.length);
		console.log("CollisionAgent.js - Points: " + this.collisionPoint.length);
		console.log(
			"CollisionAgent.js - Upgrades: " + this.collisionModifier.length
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

	checkOverlapModifier(modifier) {
		// Check if the player is in the modifier area
		if (this.checkOverlap(this.collisionPlayer, modifier.position, 1)){
			console.log(modifier.isBuffer)
			// Increase or decrease the player speed
			if(modifier.isBuffer) this.collisionPlayer.decreaseSpeed();
			else this.collisionPlayer.increaseSpeed();
			// Change the modifier position
			modifier.changePosition();
			return;
		}
		// Check if the enemy is in the modifier area
		for (let i = 0; i < this.collisionEnemy.length; i++) {
			if (this.checkOverlap(this.collisionEnemy[i], modifier.position, 1)) {
				// Increase or decrease the enemy speed
				if(modifier.isBuffer) this.collisionEnemy[i].decreaseSpeed();
				else this.collisionEnemy[i].increaseSpeed();
				// Change the modifier position
				modifier.changePosition();
				return;
			}
		}
	}

	checkOverlapCircleSquare(radius, circle, square) {
		var vertexSquareX1 = square.x - radius;
		var vertexSquareX2 = square.x + radius;
		var elemX = Math.max(vertexSquareX1, Math.min(circle.position.x, vertexSquareX2));
		var vertexSquareZ1 = square.z - radius;
		var vertexSquareZ2 = square.z + radius;
		var elemZ = Math.max(vertexSquareZ1, Math.min(circle.position.z, vertexSquareZ2));

		var dx = circle.position.x - elemX;
		var dy = circle.position.z - elemZ;

		return (dx * dx + dy * dy) < (radius * radius);
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

		if (distance < radius) return true;
		else return false;
	}

	checkCollisionEnemyWithEnemy(ray) {
		for (let i = 0; i < this.collisionEnemy.length; i++) {
			for (let j = 0; j < this.collisionEnemy.length; j++) {
				if (i != j) {
					if (
						this.checkOverlapCircle(
							this.collisionEnemy[i],
							this.collisionEnemy[j],
							ray
						)
					) {
						let dx = this.collisionEnemy[i].position.x - this.collisionEnemy[j].position.x;
						let dz = this.collisionEnemy[i].position.z - this.collisionEnemy[j].position.z;
						let collisionAngle = Math.atan2(dz, dx);

						let direction = Math.atan2(this.collisionEnemy[i].vector.z, this.collisionEnemy[i].vector.x);

						let vectorX = 0.075 * Math.cos(collisionAngle);
						let vectorZ = 0.075 * Math.sin(collisionAngle);
						this.collisionEnemy[i].changeDirection(vectorX, vectorZ);
					}
				}
			}
		}
	}

	/**
	 * Check if the player is colliding with any object.
	 */
	checkCollisionEnemy(positionOld, totalDelta, precision) {
		let atomicDeltaX = totalDelta.x / precision;
		let atomicDeltaZ = totalDelta.z / precision;
		let position = {
			x: positionOld.x,
			z: positionOld.z,
		};
		for (let i = 0; i < this.collisionEnemy.length; i++) {
			// Check if in intermediate positions there is a collision
			for (let j = 0; j < precision; j++) {
				position.x += atomicDeltaX;
				position.z += atomicDeltaZ;
				if (this.checkOverlap(this.collisionEnemy[i], position, 0.5)) {
					setGameOver(true);
					totalDelta.x = atomicDeltaX * j;
					totalDelta.z = atomicDeltaZ * j;
					return totalDelta;
				}
			}
			position.x = positionOld.x;
			position.z = positionOld.z;
		}
	}

	checkCollisionPoint(position){
		for (let i = 0; i < this.collisionPoint.length; i++) {
			if (this.checkOverlapCircleSquare(0.3, this.collisionPoint[i], position)) {
				playerScore += 1;
				document.getElementById("playerScore").textContent = playerScore;
				this.collisionPoint[i].changePosition();
				return true;
			}
		}
		return false;
	}

	check_collision_arena(objElem) {
		let arenaBounde = 9;
		for (let i = 0; i < objElem.mesh.positions.length; i += 3) {
			if (objElem.mesh.positions[i + 1] >= arenaBounde) {
				objElem.vector.x *= -1;
			}
			if (objElem.mesh.positions[i + 1] <= -arenaBounde) {
				objElem.vector.x *= -1;
			}
			if (objElem.mesh.positions[i] >= arenaBounde) {
				objElem.vector.z *= -1;
			}
			if (objElem.mesh.positions[i] <= -arenaBounde) {
				objElem.vector.z *= -1;
			}
		}
	}
}
