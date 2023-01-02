
export const visibleLog = false;

// Counter for the number of objects that have to be added to the scene
export let countEnemies = 0;
export let countPoints = 0;
export let countModifiers = 1;

// Camera data
export let maxRadius = 30;
export let minRadius = 3;

export let arenaSide = 8.925;

export let originSpeed = 0.075;

let isActive = false;
let isGameOver = false;
let isReset = false;

export function setActive(isActiveNew) {
    isActive = isActiveNew;
}

export function getActive() {
    return isActive;
}

export function setReset(isResetNew) {
    isReset = isResetNew;
}

export function getReset() {
    return isReset;
}


export function setGameOver(isGameOverNew) {
    isGameOver = isGameOverNew;
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