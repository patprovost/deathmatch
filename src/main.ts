import * as Display from "./display.ts";

requestAnimationFrame(loop);

function loop() {
    const { context, renderScale } = Display;
    context.resetTransform();
    context.scale(renderScale, renderScale);
    context.fillStyle = "white";
    context.fillRect(0, 0, 1920, 1080);
    requestAnimationFrame(loop);
}
