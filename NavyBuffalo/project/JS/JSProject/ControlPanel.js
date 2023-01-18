
import { resetGameCore, reloadTexture } from "./Core.js";

/**
 *  Disable the default page scroll when pressing the arrow keys
 */

export function disableDefaultPageScroll() {
    window.addEventListener("keydown", function (e) {
        if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);
}

/**
 *  Player score management
 */

let playerScore = 0;
document.getElementById("playerScore").textContent = playerScore;

export function setPlayerScore() {
    playerScore += 1;
    document.getElementById("playerScore").textContent = playerScore;
}

export function getPlayerScore() {
    return playerScore;
}

export function resetPlayerScore() {
    // Update the high score
    if (localStorage.getItem("highScore") == null || playerScore > localStorage.getItem("highScore")) {
        localStorage.setItem("highScore", playerScore);
    }
    // Reload the high score canvas
    reloadScoreCanvas();
    // Update the high score canvas
    playerScore = 0;
    document.getElementById("playerScore").textContent = playerScore;
}

/**
 * Init canvas 2D
 */
let canvas = document.getElementById("screenCanvasPlaneHighScore");
let context = canvas.getContext("2d");

/**
 * Init the high score canvas
 */
export function initScoreCanvas() {
    // Show if the browser has an high score saved
    if (localStorage.getItem("highScore") != null) {
        reloadScoreCanvas();
    } else {
        document.getElementById("screenCanvasPlaneHighScore").style.display = "none";
    }
    // Reload the high score canvas
}

function reloadScoreCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "RGB(28, 56, 166)";
    context.font = "20px Arial";
    context.fillText("Miglior punteggio: " + localStorage.getItem("highScore"), canvas.width / 2, canvas.height / 2);
    document.getElementById("screenCanvasPlaneHighScore").style.display = "block";
}



/**
 *  Object data
 */

export let spawnThreshold = 10;

export let countEnemies = 5;
export let countPoints = 1;
export let countModifiers = 3;

let cubeDimension = 1.0;
let cubeModifierDimension = 2;

export function getCubeDimension() {
    return cubeDimension;
}

export function getCubeModifierDimension() {
    return cubeModifierDimension;
}

let circleEnemyDimension = 0.5;
let circlePointDimension = 0.3;

export function getCircleEnemyDimension() {
    return circleEnemyDimension;
}

export function getCirclePointDimension() {
    return circlePointDimension;
}

export let arenaSide = 9;

export let originSpeed = 0.070;
export let minSpeed = 0.040;
export let maxSpeed = 0.150;

/**
 * Ambient light data
 */

export let light = { ambientLight: [0.2, 0.2, 0.2], colorLight: [1.0, 1.0, 1.0] }
export let lightPosition = [-1, 3, 7];

// Camera data
export let maxRadius = 30;
export let minRadius = 3;

/**
 * Toggle the second camera.
 */

export let isSecondCameraActive = true;

// Link checkbox to the variable isSecondCameraActive
document.getElementById("secondCamera").onclick = function () {
    isSecondCameraActive = !isSecondCameraActive;
    // If false, hide the screenCanvasPlane
    if (!isSecondCameraActive) {
        document.getElementById("screenCanvasPlane").style.display = "none";
    } else {
        document.getElementById("screenCanvasPlane").style.display = "block";
    }
};

/**
 * Toggle the transparency.
 */

export let isTransparencyActive = true;

// Link checkbox to the variable isTransparencyActive
document.getElementById("transparency").onclick = function () {
    isTransparencyActive = !isTransparencyActive;
};

/**
 * Toggle alternative texture.
 */

document.getElementById("alternativeTexture").onclick = function () {
    reloadTexture();
}

/**
 *  Game management
 */

let isActive = false;

export function setActive(isActiveNew) {
    isActive = isActiveNew;
}

export function getActive() {
    return isActive;
}

document.getElementById("resetButton").onclick = function () {
    resetGameCore();
}

let isReset = false;

export function setReset(isResetNew) {
    isReset = isResetNew;
    document.getElementById("resetButton").disabled = true;
    document.getElementById("lostScreen").style.display = "none";
}

export function getReset() {
    return isReset;
}

let isGameOver = false;

export function setGameOver(isGameOverNew) {
    isGameOver = isGameOverNew;
    document.getElementById("resetButton").disabled = false;
    // Show the lost screen
    document.getElementById("lostScreen").style.display = "block";
}

export function getGameOver() {
    return isGameOver;
}

document.getElementById("exitLostScreen").onclick = function () {
    document.getElementById("lostScreen").style.display = "none";
}
