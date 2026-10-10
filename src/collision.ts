import type { Entity } from "./entity.ts";

const degreesToRadians = Math.PI / 180;

//              Type 0              Type 1           Type 2
type Collider = RectangleCollider | CircleCollider | CapsuleCollider;

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

class CapsuleCollider {
    public type = 2;
    public startX = 0;
    public startY = 0;
    public endX = 0;
    public endY = 0;
    public radius = 0;

    public update(x: number, y: number, r: number, width: number, radius: number) {
        const radians = r * degreesToRadians;
        const halfLength = Math.max(0, width / 2 - radius);
        const deltaX = Math.cos(radians) * halfLength;
        const deltaY = Math.sin(radians) * halfLength;
        this.startX = x - deltaX;
        this.startY = y - deltaY;
        this.endX = x + deltaX;
        this.endY = y + deltaY;
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
    [checkRectangles as CheckFn, checkRectangleCircle as CheckFn, checkRectangleCapsule as CheckFn],
    [checkCircleRectangle as CheckFn, checkCircles as CheckFn, checkCircleCapsule as CheckFn],
    [checkCapsuleRectangle as CheckFn, checkCapsuleCircle as CheckFn, checkCapsules as CheckFn],
];

function checkCollision(colliderA: Collider, colliderB: Collider): boolean {
    const checkFn = fnTable[colliderA.type][colliderB.type];
    return checkFn(colliderA, colliderB);
}

function checkRectangles(rectA: RectangleCollider, rectB: RectangleCollider) {
    return (rectA.left <= rectB.right) && (rectA.right >= rectB.left) &&
        (rectA.top <= rectB.bottom) && (rectA.bottom >= rectB.top);
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

function checkRectangleCapsule(rect: RectangleCollider, capsule: CapsuleCollider) {
    const axisX = capsule.endX - capsule.startX;
    const axisY = capsule.endY - capsule.startY;
    const lengthSquared = axisX * axisX + axisY * axisY;
    let segmentX = (capsule.startX + capsule.endX) / 2;
    let segmentY = (capsule.startY + capsule.endY) / 2;
    let rectX = Math.max(rect.left, Math.min(segmentX, rect.right));
    let rectY = Math.max(rect.top, Math.min(segmentY, rect.bottom));

    if (lengthSquared >= 1) {
        for (let i = 0; i < 5; i++) {
            const t = Math.max(
                0,
                Math.min(1, ((rectX - capsule.startX) * axisX + (rectY - capsule.startY) * axisY) / lengthSquared),
            );
            segmentX = capsule.startX + t * axisX;
            segmentY = capsule.startY + t * axisY;
            rectX = Math.max(rect.left, Math.min(segmentX, rect.right));
            rectY = Math.max(rect.top, Math.min(segmentY, rect.bottom));
        }
    }

    const deltaX = segmentX - rectX;
    const deltaY = segmentY - rectY;
    const distanceSquared = deltaX * deltaX + deltaY * deltaY;
    const radiusSquared = capsule.radius * capsule.radius;
    return distanceSquared <= radiusSquared;
}

function checkCircleRectangle(circle: CircleCollider, rect: RectangleCollider) {
    return checkRectangleCircle(rect, circle);
}

function checkCircles(circleA: CircleCollider, circleB: CircleCollider) {
    const deltaX = circleB.x - circleA.x;
    const deltaY = circleB.y - circleA.y;
    const distanceSquared = deltaX * deltaX + deltaY * deltaY;
    const radiusSum = circleA.radius + circleB.radius;
    const radiusSumSquared = radiusSum * radiusSum;
    return distanceSquared <= radiusSumSquared;
}

function checkCircleCapsule(circle: CircleCollider, capsule: CapsuleCollider) {
    const axisX = capsule.endX - capsule.startX;
    const axisY = capsule.endY - capsule.startY;
    const lengthSquared = axisX * axisX + axisY * axisY;

    let closestX: number;
    let closestY: number;
    if (lengthSquared >= 1) {
        const t = Math.max(
            0,
            Math.min(1, ((circle.x - capsule.startX) * axisX + (circle.y - capsule.startY) * axisY) / lengthSquared),
        );
        closestX = capsule.startX + t * axisX;
        closestY = capsule.startY + t * axisY;
    } else {
        closestX = capsule.startX;
        closestY = capsule.startY;
    }

    const deltaX = circle.x - closestX;
    const deltaY = circle.y - closestY;
    const distanceSquared = deltaX * deltaX + deltaY * deltaY;
    const radiusSum = capsule.radius + circle.radius;
    const radiusSumSquared = radiusSum * radiusSum;
    return distanceSquared <= radiusSumSquared;
}

function checkCapsuleRectangle(capsule: CapsuleCollider, rect: RectangleCollider) {
    return checkRectangleCapsule(rect, capsule);
}

function checkCapsuleCircle(capsule: CapsuleCollider, circle: CircleCollider) {
    return checkCircleCapsule(circle, capsule);
}

function checkCapsules(capsuleA: CapsuleCollider, capsuleB: CapsuleCollider) {
    const d1X = capsuleA.endX - capsuleA.startX;
    const d1Y = capsuleA.endY - capsuleA.startY;
    const d2X = capsuleB.endX - capsuleB.startX;
    const d2Y = capsuleB.endY - capsuleB.startY;
    const rX = capsuleA.startX - capsuleB.startX;
    const rY = capsuleA.startY - capsuleB.startY;
    const a = d1X * d1X + d1Y * d1Y;
    const b = d1X * d2X + d1Y * d2Y;
    const c = d1X * rX + d1Y * rY;
    const e = d2X * d2X + d2Y * d2Y;
    const f = d2X * rX + d2Y * rY;
    const denom = a * e - b * b;
    let s = 0, t = 0;

    if (a >= 1 && e >= 1) {
        if (Math.abs(denom) > 1e-6 * a * e) {
            s = Math.max(0, Math.min(1, (b * f - c * e) / denom));
        }

        t = (b * s + f) / e;

        if (t < 0) {
            s = Math.max(0, Math.min(1, -c / a));
            t = 0;
        } else if (t > 1) {
            s = Math.max(0, Math.min(1, (b - c) / a));
            t = 1;
        }
    } else if (a < 1) {
        t = Math.max(0, Math.min(1, f / e));
    } else {
        s = Math.max(0, Math.min(1, -c / a));
    }

    const closest1X = capsuleA.startX + s * d1X;
    const closest1Y = capsuleA.startY + s * d1Y;
    const closest2X = capsuleB.startX + t * d2X;
    const closest2Y = capsuleB.startY + t * d2Y;
    const deltaX = closest2X - closest1X;
    const deltaY = closest2Y - closest1Y;
    const distanceSquared = deltaX * deltaX + deltaY * deltaY;
    const radiusSum = capsuleA.radius + capsuleB.radius;
    const radiusSumSquared = radiusSum * radiusSum;
    return distanceSquared <= radiusSumSquared;
}

export type { Collider };
export { CapsuleCollider, CircleCollider, getEntityCollisions, RectangleCollider };
