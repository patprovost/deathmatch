import type { ParamsCircle, ParamsRectangle } from "./types.ts";
import * as display from "./display.ts";
import * as loop from "./loop.ts";
import * as keyboard from "./keyboard.ts";
import * as mouse from "./mouse.ts";
import * as entity from "./entity.ts";

loop.start(init, update, render);

function init() {
    const rectangle = createRectangle("rectangle", 100, 100, getRandomRGB());
    const circle = createCircle("circle", 50, getRandomRGB());
    entity.setTransform(rectangle, { x: 580, y: 540 });
    entity.setTransform(circle, { z: 1 });
    entity.attach(circle, rectangle);

    rectangle.update = () => {
        rectangle.transform.local.x += 1;
        rectangle.transform.local.r += 1;
        if (rectangle.transform.local.r > 360) {
            entity.releaseChildren(rectangle);
            entity.destroy(rectangle);
        }
    };

    circle.update = () => {
        const velocity = circle.parent ? 1 : 2;
        circle.transform.local.x -= velocity;
    };
}

function update() {
    if (keyboard.consume("KeyS")) loop.stop();
    if (mouse.consume(2)) {
        const { x, y } = mouse.getPosition();
        console.log(`Cursor: (${x}, ${y})`);
    }

    entity.updateAll();
}

function render() {
    const { context, renderScale } = display;
    context.resetTransform();
    context.scale(renderScale, renderScale);
    context.fillStyle = "white";
    context.fillRect(0, 0, 1920, 1080);
    entity.renderAll(context);
}

function createRectangle(name: string, width: number, height: number, color: string) {
    const rectangle = entity.create(name);
    rectangle.params = { width, height, color } as ParamsRectangle;

    rectangle.render = (context: CanvasRenderingContext2D) => {
        const { width, height, color } = rectangle.params as ParamsRectangle;
        context.beginPath();
        context.rect(-width / 2, -height / 2, width, height);
        context.fillStyle = color;
        context.fill();
        context.stroke();
    };

    return rectangle;
}

function createCircle(name: string, radius: number, color: string) {
    const circle = entity.create(name);
    circle.params = { radius, color } as ParamsCircle;

    circle.render = (context: CanvasRenderingContext2D) => {
        const { radius, color } = circle.params as ParamsCircle;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
        context.stroke();
    };

    return circle;
}

function getRandomRGB() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r} ${g} ${b})`;
}
