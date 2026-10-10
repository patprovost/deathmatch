import { Entity } from "./entity.ts";
import { CapsuleCollider, CircleCollider, RectangleCollider } from "./collision.ts";
import type { CapsuleParams, CircleParams, RectangleParams } from "./params.ts";

class Rectangle extends Entity {
    declare protected params: RectangleParams;
    declare protected collider: RectangleCollider;

    constructor(name: string, width: number, height: number, color: string) {
        super(name);
        this.params = { width, height, color };
        this.collider = new RectangleCollider();
    }

    protected override render(context: CanvasRenderingContext2D) {
        const { width, height, color } = this.params;
        context.beginPath();
        context.rect(-width / 2, -height / 2, width, height);
        context.fillStyle = color;
        context.fill();
        context.stroke();
    }

    protected override updateCollider() {
        const { x, y } = this.worldTransform;
        const { width, height } = this.params;
        this.collider.update(x, y, width, height);
    }
}

class Circle extends Entity {
    declare protected params: CircleParams;
    declare protected collider: CircleCollider;

    constructor(name: string, radius: number, color: string) {
        super(name);
        this.params = { radius, color };
        this.collider = new CircleCollider();
    }

    protected override render(context: CanvasRenderingContext2D) {
        const { radius, color } = this.params;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
        context.stroke();
    }

    protected override updateCollider() {
        const { x, y } = this.worldTransform;
        const { radius } = this.params;
        this.collider.update(x, y, radius);
    }
}

class Capsule extends Entity {
    declare protected params: CapsuleParams;
    declare protected collider: CapsuleCollider;

    constructor(name: string, width: number, height: number, radius: number, color: string) {
        super(name);
        this.params = { width, height, radius, color };
        this.collider = new CapsuleCollider();
    }

    protected override render(context: CanvasRenderingContext2D) {
        const { width, height, radius, color } = this.params;
        context.beginPath();
        context.roundRect(-width / 2, -height / 2, width, height, radius);
        context.fillStyle = color;
        context.fill();
        context.stroke();
    }

    protected override updateCollider() {
        const { x, y, r } = this.worldTransform;
        const { width, radius } = this.params;
        this.collider.update(x, y, r, width, radius);
    }
}

export { Capsule, Circle, Rectangle };
