import { setGameOver, arenaSide } from "../ControlPanel.js";
import { EnemyBehaviour } from "../OBJBehaviour/EnemyBehaviour.js";
import { PlayerBehaviour } from "../OBJBehaviour/PlayerBehaviour.js";
import { PointBehaviour } from "../OBJBehaviour/PointBeahaviour.js";
import { ModifierBehaviour } from "../OBJBehaviour/ModifierBehaviour.js";

let cubeDimension = 1.0;
let cubeModifierDimension = 1.5;
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

	checkOverlapSquareSquare(square1, square2) {
		
		// Top Left coordinate of first square.
		let l1 = {};
		l1[0] = square1.x + cubeModifierDimension/2;
		l1[1] = square1.z + cubeModifierDimension/2;

		// Bottom Right coordinate of first square.
		let r1 = {};
		r1[0] = square1.x - cubeModifierDimension/2;
		r1[1] = square1.z - cubeModifierDimension/2;

		// Top Left coordinate of second square.
		let l2 = {};
		l2[0] = square2.x + cubeDimension/2;
		l2[1] = square2.z + cubeDimension/2;

		// Bottom Right coordinate of second square.
		let r2 = {};
		r2[0] = square2.x - cubeDimension/2;
		r2[1] = square2.z - cubeDimension/2;
  
		// If one rectangle is on left side of other
		if (l1[0] < r2[0] || l2[0] < r1[0]) return false;

		// If one rectangle is above other
		if (r1[1] > l2[1] || r2[1] > l1[1])	return false;

		return true;
	}

	checkOverlapCircle(circle1, circle2, radius) {
		var dx = circle1.position.x - circle2.position.x;
		var dy = circle1.position.z - circle2.position.z;
		var distance = Math.sqrt(dx * dx + dy * dy);
		if (distance < radius) return true;
		else return false;
	}

	checkCollisionEnemy(position) {
		for (let i = 0; i < this.collisionEnemy.length; i++) {
			if (this.checkOverlapCircleSquare(0.5, this.collisionEnemy[i], position)) {
				setGameOver(true);
				return true;
			}
		}
		return false;
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

	// Check if the modifier is colliding with the player or the enemy
	checkOverlapModifier(modifier) {
		// Check if the player is in the modifier area
		if (this.checkOverlapSquareSquare(this.collisionPlayer.position, modifier.position)){
			console.log("Player")
			// Increase or decrease the player speed
			if(modifier.isBuffer) this.collisionPlayer.decreaseSpeed();
			else this.collisionPlayer.increaseSpeed();
			// Change the modifier position
			modifier.changePosition();
			return;
		}
		// Check if the enemy is in the modifier area
		for (let i = 0; i < this.collisionEnemy.length; i++) {
			if (this.checkOverlapCircleSquare(1, this.collisionEnemy[i], modifier.position)) {
				// Increase or decrease the enemy speed
				if(modifier.isBuffer) this.collisionEnemy[i].decreaseSpeed();
				else this.collisionEnemy[i].increaseSpeed();
				// Change the modifier position
				modifier.changePosition();
				return;
			}
		}
	}

	// Check if the enemy is colliding with another enemy
	checkCollisionEnemyWithEnemy(radius) {
		for (let i = 0; i < this.collisionEnemy.length; i++) {
			for (let j = 0; j < this.collisionEnemy.length; j++) {
				if (i != j) {
					if ( this.checkOverlapCircle(
							this.collisionEnemy[i],
							this.collisionEnemy[j],
							radius)
					) {
						let dx = this.collisionEnemy[i].position.x - this.collisionEnemy[j].position.x;
						let dz = this.collisionEnemy[i].position.z - this.collisionEnemy[j].position.z;
						let collisionAngle = Math.atan2(dz, dx);
						this.collisionEnemy[i].changeDirection(Math.cos(collisionAngle), Math.sin(collisionAngle));
					}
				}
			}
		}
	}

	// Check if the enemy is colliding with the arena
	checkCollisionEnemyWithArena(objElem) {
		for (let i = 0; i < objElem.mesh.positions.length; i += 3) {
			if (objElem.mesh.positions[i + 1] >= arenaSide)
				objElem.vector.x *= -1;
			if (objElem.mesh.positions[i + 1] <= -arenaSide)
				objElem.vector.x *= -1;
			if (objElem.mesh.positions[i] >= arenaSide)
				objElem.vector.z *= -1;
			if (objElem.mesh.positions[i] <= -arenaSide)
				objElem.vector.z *= -1;
		}
	}
}
