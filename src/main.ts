import * as display from "./display.ts";
import * as loop from "./loop.ts";
import * as keyboard from "./keyboard.ts";
import * as mouse from "./mouse.ts";
import { Entity } from "./entity.ts";
import { Circle, Rectangle } from "./shapes.ts";

loop.start(init, update, render);

function init() {
    const rectangleA = new Rectangle("rectangleA", 100, 100, getRandomRGB());
    rectangleA.setTransform({ x: 480, y: 270 });
    rectangleA.setUpdateFn(moveRight);
    rectangleA.setCollisionFn(stopMoving);

    const rectangleAA = new Rectangle("rectangleAA", 100, 100, getRandomRGB());
    rectangleAA.setTransform({ x: 1440, y: 270 });
    rectangleAA.setUpdateFn(moveLeft);
    rectangleAA.setCollisionFn(stopMoving);

    const circleA = new Circle("circleA", 50, getRandomRGB());
    circleA.setTransform({ x: 480, y: 540 });
    circleA.setUpdateFn(moveRight);
    circleA.setCollisionFn(stopMoving);

    const circleAA = new Circle("circleAA", 50, getRandomRGB());
    circleAA.setTransform({ x: 1440, y: 540 });
    circleAA.setUpdateFn(moveLeft);
    circleAA.setCollisionFn(stopMoving);

    const rectangleB = new Rectangle("rectangleB", 100, 100, getRandomRGB());
    rectangleB.setTransform({ x: 480, y: 810 });
    rectangleB.setUpdateFn(moveRight);
    rectangleB.setCollisionFn(stopMoving);

    const circleB = new Circle("circleB", 50, getRandomRGB());
    circleB.setTransform({ x: 1440, y: 810 });
    circleB.setUpdateFn(moveLeft);
    circleB.setCollisionFn(stopMoving);

    const circleC = new Circle("circleC", 50, getRandomRGB());
    circleC.owner = circleB;
    circleC.setTransform({ x: 1640, y: 810, z: -1 });
    circleC.setUpdateFn(moveLeft);
    circleC.setCollisionFn(stopMoving);
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

function moveRight(self: Entity) {
    const newX = self.getTransform().x + 10;
    self.setTransform({ x: newX });
}

function moveLeft(self: Entity) {
    const newX = self.getTransform().x - 10;
    self.setTransform({ x: newX });
}

function stopMoving(self: Entity, other: Entity) {
    self.setUpdateFn();
    other.setUpdateFn();
}
