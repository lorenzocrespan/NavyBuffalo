
export const visibleLog = false;

// Camera data
export let maxRadius = 30;
export let minRadius = 3;

let isActive = false;
let isGameOver = false;
let isReset = false;

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

document.getElementById("exitLostScreen").onclick = function () {
    document.getElementById("lostScreen").style.display = "none";
}

export let isTransparencyActive = true;

// Link checkbox to the variable isTransparencyActive
document.getElementById("transparency").onclick = function () {
    isTransparencyActive = !isTransparencyActive;
};

export function setActive(isActiveNew) {
    isActive = isActiveNew;
}

export function getActive() {
    return isActive;
}

export function setReset(isResetNew) {
    isReset = isResetNew;
    document.getElementById("resetButton").disabled = true;
    document.getElementById("lostScreen").style.display = "none";
}

export function getReset() {
    return isReset;
}


export function setGameOver(isGameOverNew) {
    isGameOver = isGameOverNew;
    document.getElementById("resetButton").disabled = false;
    // Show the lost screen
    document.getElementById("lostScreen").style.display = "block";
}

export function getGameOver() {
    return isGameOver;
}

document.getElementById("resetButton").onclick = function () {
    console.log("va");
}

/***************************** FIX ********************************/

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
    playerScore = 0;
    document.getElementById("playerScore").textContent = playerScore;
}

/**
 *  Object data
 */

export let spawnThreshold = 2;

export let countEnemies = 4;
export let countPoints = 1;
export let countModifiers = 2;

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

export let originSpeed = 0.075;

