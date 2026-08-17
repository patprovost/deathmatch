import { Entity } from "./entity.ts";

interface RectangleParams {
    width: number;
    height: number;
    color: string;
}

interface CircleParams {
    radius: number;
    color: string;
}

class Rectangle extends Entity {
    constructor(name: string, width: number, height: number, color: string) {
        super(name);
        this.params = { width, height, color };
    }

    protected override render(context: CanvasRenderingContext2D) {
        const { width, height, color } = this.params as RectangleParams;
        context.beginPath();
        context.rect(-width / 2, -height / 2, width, height);
        context.fillStyle = color;
        context.fill();
        context.stroke();
    }
}

class Circle extends Entity {
    constructor(name: string, radius: number, color: string) {
        super(name);
        this.params = { radius, color };
    }

    protected override render(context: CanvasRenderingContext2D) {
        const { radius, color } = this.params as CircleParams;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
        context.stroke();
    }
}

export { Circle, Rectangle };
