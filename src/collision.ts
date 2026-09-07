import type { Entity } from "./entity.ts";

//              Type 0              Type 1
type Collider = RectangleCollider | CircleCollider;

class RectangleCollider {
    public type = 0;
    public left = 0;
    public right = 0;
    public top = 0;
    public bottom = 0;

    public update(x: number, y: number, width: number, height: number) {
        this.left = x - width / 2;
        this.right = x + width / 2;
        this.top = y - height / 2;
        this.bottom = y + height / 2;
    }
}

class CircleCollider {
    public type = 1;
    public x = 0;
    public y = 0;
    public radius = 0;

    public update(x: number, y: number, radius: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}

interface Collision {
    entityA: Entity | null;
    entityB: Entity | null;
}

const collisions: Collision[] = [];
const collisionPool: Collision[] = [];
let collisionCount = 0;
let previousCollisionCount = 0;

function getEntityCollisions(entities: Entity[]) {
    collisionCount = 0;
    collisions.length = 0;

    for (let i = 0; i < entities.length; i++) {
        const colliderA = entities[i].getCollider();
        if (!colliderA) continue;

        for (let j = i + 1; j < entities.length; j++) {
            const colliderB = entities[j].getCollider();
            if (!colliderB) continue;
            if (entities[i].owner === entities[j].owner) continue;

            if (checkCollision(colliderA, colliderB)) {
                let collision: Collision;
                if (collisionCount < collisionPool.length) {
                    collision = collisionPool[collisionCount++];
                    collision.entityA = entities[i];
                    collision.entityB = entities[j];
                } else {
                    collision = { entityA: entities[i], entityB: entities[j] };
                    collisionPool.push(collision);
                    collisionCount++;
                }

                collisions.push(collision);
            }
        }
    }

    for (let i = collisionCount; i < previousCollisionCount; i++) {
        collisionPool[i].entityA = null;
        collisionPool[i].entityB = null;
    }
    previousCollisionCount = collisionCount;

    return collisions;
}

type CheckFn = (a: Collider, b: Collider) => boolean;

const fnTable: CheckFn[][] = [
    [checkRectangles as CheckFn, checkRectangleCircle as CheckFn],
    [checkCircleRectangle as CheckFn, checkCircles as CheckFn],
];

function checkCollision(colliderA: Collider, colliderB: Collider): boolean {
    const checkFn = fnTable[colliderA.type][colliderB.type];
    return checkFn(colliderA, colliderB);
}

function checkRectangles(rectA: RectangleCollider, rectB: RectangleCollider) {
    return (rectA.left <= rectB.right) && (rectA.right >= rectB.left) &&
        (rectA.top <= rectB.bottom) && (rectA.bottom >= rectB.top);
}

function checkCircles(circleA: CircleCollider, circleB: CircleCollider) {
    const deltaX = circleB.x - circleA.x;
    const deltaY = circleB.y - circleA.y;
    const distanceSquared = deltaX * deltaX + deltaY * deltaY;
    const radiusSum = circleA.radius + circleB.radius;
    const radiusSumSquared = radiusSum * radiusSum;
    return distanceSquared <= radiusSumSquared;
}

function checkRectangleCircle(rect: RectangleCollider, circle: CircleCollider) {
    const closestX = Math.max(rect.left, Math.min(circle.x, rect.right));
    const closestY = Math.max(rect.top, Math.min(circle.y, rect.bottom));
    const deltaX = circle.x - closestX;
    const deltaY = circle.y - closestY;
    const distanceSquared = deltaX * deltaX + deltaY * deltaY;
    const radiusSquared = circle.radius * circle.radius;
    return distanceSquared <= radiusSquared;
}

function checkCircleRectangle(circle: CircleCollider, rect: RectangleCollider) {
    return checkRectangleCircle(rect, circle);
}

export type { Collider };
export { CircleCollider, getEntityCollisions, RectangleCollider };
