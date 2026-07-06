import * as Display from "./display.ts";

let leftIsPressed = false;
let middleIsPressed = false;
let rightIsPressed = false;

Display.canvas.addEventListener("contextmenu", (event) => event.preventDefault());

Display.canvas.addEventListener("mousedown", (event) => {
    if (event.button === 0) {
        leftIsPressed = true;
    } else if (event.button === 1) {
        middleIsPressed = true;
        event.preventDefault();
    } else if (event.button === 2) {
        rightIsPressed = true;
    }
});

document.addEventListener("mouseup", (event) => {
    if (event.button === 0) {
        leftIsPressed = false;
    } else if (event.button === 1) {
        middleIsPressed = false;
    } else if (event.button === 2) {
        rightIsPressed = false;
    }
});

function poll(button: number) {
    if (button === 0) {
        return leftIsPressed;
    } else if (button === 1) {
        return middleIsPressed;
    } else if (button === 2) {
        return rightIsPressed;
    } else {
        return false;
    }
}

function consume(button: number) {
    if (button === 0 && leftIsPressed) {
        leftIsPressed = false;
        return true;
    } else if (button === 1 && middleIsPressed) {
        middleIsPressed = false;
        return true;
    } else if (button === 2 && rightIsPressed) {
        rightIsPressed = false;
        return true;
    } else {
        return false;
    }
}

export { consume, poll };
