import * as Display from "./display.ts";
import * as Loop from "./loop.ts";
import * as Keyboard from "./keyboard.ts";
import * as Mouse from "./mouse.ts";

Loop.start(init, update, render);

function init() {}

function update() {
    if (Keyboard.consume("KeyS")) Loop.stop();
    if (Mouse.consume(2)) {
        const { x, y } = Mouse.getPosition();
        console.log(`Cursor: (${x}, ${y})`);
    }
}

function render() {
    const { context, renderScale } = Display;
    context.resetTransform();
    context.scale(renderScale, renderScale);
    context.fillStyle = "white";
    context.fillRect(0, 0, 1920, 1080);
}
