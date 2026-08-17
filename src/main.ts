import * as display from "./display.ts";
import * as loop from "./loop.ts";
import * as keyboard from "./keyboard.ts";
import * as mouse from "./mouse.ts";
import { Entity } from "./entity.ts";
import { Circle, Rectangle } from "./shapes.ts";

loop.start(init, update, render);

function init() {
    const rectangle = new Rectangle("rectangle", 100, 100, getRandomRGB());
    const circle = new Circle("circle", 50, getRandomRGB());
    rectangle.setTransform({ x: 580, y: 540 });
    circle.attachTo(rectangle);
    circle.setTransform({ z: 1 });

    const rectangleUpdateFn = () => {
        const { x, r } = rectangle.getTransform();
        if (r <= 360) {
            rectangle.setTransform({ x: x + 1, r: r + 1 });
        } else {
            rectangle.releaseChildren();
            rectangle.destroy();
        }
    };

    const circleUpdateFn = () => {
        const velocity = circle.hasParent() ? 1 : 2;
        circle.setTransform({ x: circle.getTransform().x - velocity });
    };

    rectangle.setUpdate(rectangleUpdateFn);
    circle.setUpdate(circleUpdateFn);
}

function update() {
    if (keyboard.consume("KeyS")) loop.stop();
    if (mouse.consume(2)) {
        const { x, y } = mouse.getPosition();
        console.log(`Cursor: (${x}, ${y})`);
    }
    Entity.updateAll();
}

function render(interpolation: number) {
    const { context, renderScale } = display;
    context.resetTransform();
    context.scale(renderScale, renderScale);
    context.fillStyle = "white";
    context.fillRect(0, 0, 1920, 1080);
    Entity.renderAll(context, interpolation);
}

function getRandomRGB() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r} ${g} ${b})`;
}
