// TODO: Describe the purpose of this file.

// TODO: Describe the purpose of this variable.
export const visibleLog = false;

// Counter for the number of objects that have to be added to the scene
export let countEnemies = 4;
export let countPoints = 1;

let isGameOver = true;

export function setGameOver(isGameOver) {
    isGameOver = isGameOver;
}

export function getGameOver() {
    return isGameOver;
}