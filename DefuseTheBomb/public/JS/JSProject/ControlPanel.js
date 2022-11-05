// TODO: Describe the purpose of this file.

// TODO: Describe the purpose of this variable.
export const visibleLog = false;

// Counter for the number of objects that have to be added to the scene
export let countEnemies = 0;
export let countPoints = 1;

// Camera data
export let maxRadius = 30;
export let minRadius = 3;

let isGameOver = true;

export function setGameOver(isGameOver) {
	isGameOver = isGameOver;
}

export function getGameOver() {
	return isGameOver;
}

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