import { Entity } from "./entity.ts";
import { CapsuleCollider, CircleCollider, RectangleCollider } from "./collision.ts";

interface RectangleParams {
    width: number;
    height: number;
    color: string;
}

interface CircleParams {
    radius: number;
    color: string;
}

interface CapsuleParams {
    width: number;
    height: number;
    radius: number;
    color: string;
}

class Rectangle extends Entity {
    constructor(name: string, width: number, height: number, color: string) {
        super(name);
        this.params = { width, height, color };
        this.collider = new RectangleCollider();
    }

    protected override render(context: CanvasRenderingContext2D) {
        const { width, height, color } = this.params as RectangleParams;
        context.beginPath();
        context.rect(-width / 2, -height / 2, width, height);
        context.fillStyle = color;
        context.fill();
        context.stroke();
    }

    protected override updateCollider() {
        const { x, y } = this.worldTransform;
        const { width, height } = this.params as RectangleParams;
        (this.collider as RectangleCollider).update(x, y, width, height);
    }
}

class Circle extends Entity {
    constructor(name: string, radius: number, color: string) {
        super(name);
        this.params = { radius, color };
        this.collider = new CircleCollider();
    }

    protected override render(context: CanvasRenderingContext2D) {
        const { radius, color } = this.params as CircleParams;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
        context.stroke();
    }

    protected override updateCollider() {
        const { x, y } = this.worldTransform;
        const { radius } = this.params as CircleParams;
        (this.collider as CircleCollider).update(x, y, radius);
    }
}

class Capsule extends Entity {
    constructor(name: string, width: number, height: number, radius: number, color: string) {
        super(name);
        this.params = { width, height, radius, color };
        this.collider = new CapsuleCollider();
    }

    protected override render(context: CanvasRenderingContext2D) {
        const { width, height, radius, color } = this.params as CapsuleParams;
        context.beginPath();
        context.roundRect(-width / 2, -height / 2, width, height, radius);
        context.fillStyle = color;
        context.fill();
        context.stroke();
    }

    protected override updateCollider() {
        const { x, y, r } = this.worldTransform;
        const { width, radius } = this.params as CapsuleParams;
        (this.collider as CapsuleCollider).update(x, y, r, width, radius);
    }
}

export { Capsule, Circle, Rectangle };
