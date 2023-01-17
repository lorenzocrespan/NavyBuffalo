import {
	setGameOver,
	arenaSide,
	spawnThreshold,
	getCubeDimension,
	getCubeModifierDimension,
	getCircleEnemyDimension,
	getCirclePointDimension,
	setPlayerScore,
	getPlayerScore,
} from "../ControlPanel.js";
import { EnemyBehaviour } from "../OBJBehaviour/EnemyBehaviour.js";
import { PlayerBehaviour } from "../OBJBehaviour/PlayerBehaviour.js";
import { PointBehaviour } from "../OBJBehaviour/PointBeahaviour.js";
import { ModifierBehaviour } from "../OBJBehaviour/ModifierBehaviour.js";

export class CollisionAgent {
	/**
	 *	Initialize the lists of objects in the scene that can collide.
	 */
	constructor() {
		this.collisionPlayer;
		this.collisionEnemy = [];
		this.collisionPoint = [];
		this.collisionModifier = [];
	}

	/**
	 *	Add a new collision object to one of the lists.
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
				break;
			default:
				break;
		}
	}

	/**
	 *	Check if one object with a circle shape is overlapping with another object with a square shape.
	 *	
	 *	@param {Number} radius Radius of the circle.
	 *	@param {Object} circle Object with the coordinates of the center of the circle.
	 *	@param {Object} square Object with the coordinates of the center of the square.
	 *	
	 *	@returns True if the two objects are overlapping, false otherwise.
	 */
	checkOverlapCircleSquare(radius, circle, square) {
		// Calculate the vertex position of the square that is closest to the circle.
		var vertexSquareX1 = square.x - radius;
		var vertexSquareX2 = square.x + radius;
		var elemX = Math.max(vertexSquareX1, Math.min(circle.position.x, vertexSquareX2));
		var vertexSquareZ1 = square.z - radius;
		var vertexSquareZ2 = square.z + radius;
		var elemZ = Math.max(vertexSquareZ1, Math.min(circle.position.z, vertexSquareZ2));
		// Calculate the distance between the circle and the closest vertex.
		var dx = circle.position.x - elemX;
		var dy = circle.position.z - elemZ;
		// Check if the distance is less than the radius of the circle.
		return (dx * dx + dy * dy) < (radius * radius);
	}

	/**
	 *	Check if one object with a square shape is overlapping with another object with a square shape.
	 *	
	 *	@param {Object} square1 Object with the coordinates of the center of the first square.
	 *	@param {Object} square2 Object with the coordinates of the center of the second square.
	 *	@param {Number} square1Dimension Dimension of the first square.
	 *	@param {Number} square2Dimension Dimension of the second square.
	 *	
	 *	@returns True if the two objects are overlapping, false otherwise.
	 */
	checkOverlapSquareSquare(square1, square2, square1Dimension, square2Dimension) {
		// Top Left coordinate of first square.
		let l1 = {};
		l1[0] = square1.x + square1Dimension / 2;
		l1[1] = square1.z + square1Dimension / 2;
		// Bottom Right coordinate of first square.
		let r1 = {};
		r1[0] = square1.x - square1Dimension / 2;
		r1[1] = square1.z - square1Dimension / 2;
		// Top Left coordinate of second square.
		let l2 = {};
		l2[0] = square2.x + square2Dimension / 2;
		l2[1] = square2.z + square2Dimension / 2;
		// Bottom Right coordinate of second square.
		let r2 = {};
		r2[0] = square2.x - square2Dimension / 2;
		r2[1] = square2.z - square2Dimension / 2;
		// If one rectangle is on left side of other
		if (l1[0] < r2[0] || l2[0] < r1[0])
			return false;
		// If one rectangle is above other
		if (r1[1] > l2[1] || r2[1] > l1[1])
			return false;

		return true;
	}

	/**
	 *	Check if one object with a circle shape is overlapping with another object with a circle shape.
	 * 
	 *	@param {Object} circle1 Object with the coordinates of the center of the first circle.
	 *	@param {Object} circle2 Object with the coordinates of the center of the second circle.
	 *	@param {Number} radius Radius of the circle.
	 * 
	 *	@returns True if the two objects are overlapping, false otherwise.
	 */
	checkOverlapCircleCircle(circle1, circle2, radius) {
		// Calculate the distance between the two circles.
		var dx = circle1.position.x - circle2.position.x;
		var dy = circle1.position.z - circle2.position.z;
		var distance = Math.sqrt(dx * dx + dy * dy);
		// Check if the distance is less than the radius of the circle.
		if (distance < radius) return true;
		else return false;
	}

	/**
	 *	Check if the player is overlapping with an enemy.
	 * 
	 *	@param {Object} position Object with the coordinates of the center of the player.
	 *	
	 *	@returns True if the player is overlapping with an enemy, false otherwise.
	 */
	checkCollisionEnemyWithPlayer(position) {
		for (let i = 0; i < this.collisionEnemy.length; i++) {
			if (this.collisionEnemy[i].isVisible && this.checkOverlapCircleSquare(getCircleEnemyDimension(), this.collisionEnemy[i], position)) {
				setGameOver(true);
				return true;
			}
		}
		return false;
	}

	/**
	 *	Check if the player is overlapping with a collision point.
	 * 
	 *	@param {Object} position Object with the coordinates of the center of the player.
	 * 
	 *	@returns  True if the player is overlapping with a collision point, false otherwise.
	 */
	checkCollisionPointWithPlayer(position) {
		for (let i = 0; i < this.collisionPoint.length; i++) {
			if (this.checkOverlapCircleSquare(getCirclePointDimension(), this.collisionPoint[i], position)) {
				setPlayerScore();
				this.spawnEnemy();
				this.collisionPoint[i].changePosition();
				return true;
			}
		}
		return false;
	}

	/**
	 *	Check if the modifier is colliding with the player or the enemy.
	 * 
	 *	@param {Object} modifier Object with the coordinates of the center of the modifier.
	 * 
	 *	@returns True if the modifier is colliding with the player or the enemy, false otherwise.
	 */
	checkOverlapModifier(modifier) {
		// Check if the player is in the modifier area
		if (this.checkOverlapSquareSquare(this.collisionPlayer.position, modifier.position, getCubeDimension(), getCubeModifierDimension())) {
			if (modifier.isBuffer) this.collisionPlayer.decreaseSpeed();
			else this.collisionPlayer.increaseSpeed();
			// Search for a new position for the modifier
			let newPosition = this.checkSafePositionModifier(modifier);
			modifier.changePosition(newPosition);
			return;
		}
		// Check if the enemy is in the modifier area
		for (let i = 0; i < this.collisionEnemy.length; i++) {
			if (this.checkOverlapCircleSquare(getCircleEnemyDimension() + 0.25, this.collisionEnemy[i], modifier.position)) {
				if (modifier.isBuffer) this.collisionEnemy[i].decreaseSpeed();
				else this.collisionEnemy[i].increaseSpeed();
				// Search for a new position for the modifier
				let newPosition = this.checkSafePositionModifier(modifier);
				modifier.changePosition(newPosition);
				return;
			}
		}
	}

	/**
	 *	Check if the modifier is colliding with the player, the enemy or another modifier.
	 * 
	 *	@param {Object} modifier Object with the coordinates of the center of the modifier.
	 * 
	 *	@returns New position for the modifier.
	 */
	checkSafePositionModifier(modifier) {
		// Generate a new position for the modifier
		let newX = Math.floor(Math.random() * 14 - 7);
		let newZ = Math.floor(Math.random() * 14 - 7);
		let newPosition = { position: { x: newX, z: newZ } };
		// Check if the modifier is colliding with the player, the enemy or another modifier
		for (let i = 0; i < this.collisionModifier.length; i++)
			if (this.checkOverlapSquareSquare(newPosition.position, this.collisionModifier[i].position, getCubeModifierDimension(), getCubeModifierDimension())) this.checkSafePositionModifier(modifier);
		if (this.checkOverlapSquareSquare(newPosition.position, this.collisionPlayer.position, getCubeModifierDimension(), getCubeDimension())) this.checkSafePositionModifier(modifier);
		for (let i = 0; i < this.collisionEnemy.length; i++)
			if (this.checkOverlapCircleSquare(1, this.collisionEnemy[i], newPosition.position)) this.checkSafePositionModifier(modifier);
		return newPosition;
	}

	/**
	 *	Every N points a new enemy is spawned.
	 */
	spawnEnemy() {
		if (getPlayerScore() % spawnThreshold == 0) {
			for (let i = 0; i < this.collisionEnemy.length; i++) {
				if (!this.collisionEnemy[i].isVisible) {
					this.collisionEnemy[i].isSpawning = true;
					return;
				}
			}
		}
	}

	/**
	 *	Despawn all the enemies.
	 */
	despawnAllEnemy() {
		for (let i = 0; i < this.collisionEnemy.length; i++) {
			this.collisionEnemy[i].isVisible = false;
			this.collisionEnemy[i].isSpawning = false;
		}
	}

	/**
	 *	Check if the player is overlapping with an enemy.
	 */
	checkCollisionEnemyWithEnemy() {
		for (let i = 0; i < this.collisionEnemy.length; i++) {
			for (let j = 0; j < this.collisionEnemy.length; j++) {
				if (i != j) {
					if (this.collisionEnemy[i].isVisible &&
						this.collisionEnemy[j].isVisible &&
						this.checkOverlapCircleCircle(
							this.collisionEnemy[i],
							this.collisionEnemy[j],
							getCircleEnemyDimension() + 0.25)
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

	/**
	 *	Check if the player is overlapping with an enemy.
	 */
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
