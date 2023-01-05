
export const visibleLog = false;

// Counter for the number of objects that have to be added to the scene
export let countEnemies = 2;
export let countPoints = 1;
export let countModifiers = 4;

// Camera data
export let maxRadius = 30;
export let minRadius = 3;

export let arenaSide = 9;

export let originSpeed = 0.075;

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
}

export function getReset() {
    return isReset;
}


export function setGameOver(isGameOverNew) {
    isGameOver = isGameOverNew;
    document.getElementById("resetButton").disabled = false;
}

export function getGameOver() {
    return isGameOver;
}

document.getElementById("resetButton").onclick = function () {
    console.log("va");
}

// Disable the default page scroll
export function disableDefaultPageScroll() {
    document.addEventListener(
        "keydown",
        function (e) {
            if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        },
        false
    );
}