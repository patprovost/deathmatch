import * as display from "./display.ts";
import * as loop from "./loop.ts";
import * as keyboard from "./keyboard.ts";
import * as mouse from "./mouse.ts";

loop.start(init, update, render);

function init() {}

function update() {
    if (keyboard.consume("KeyS")) loop.stop();
    if (mouse.consume(2)) {
        const { x, y } = mouse.getPosition();
        console.log(`Cursor: (${x}, ${y})`);
    }
}

function render() {
    const { context, renderScale } = display;
    context.resetTransform();
    context.scale(renderScale, renderScale);
    context.fillStyle = "white";
    context.fillRect(0, 0, 1920, 1080);
}
