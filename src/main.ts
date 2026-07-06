import * as Display from "./display.ts";
import * as Loop from "./loop.ts";

Loop.start(init, update, render);

function init() {}

function update() {}

function render() {
    const { context, renderScale } = Display;
    context.resetTransform();
    context.scale(renderScale, renderScale);
    context.fillStyle = "white";
    context.fillRect(0, 0, 1920, 1080);
}
