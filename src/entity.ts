const degreesToRadians = Math.PI / 180;
const entities: Entity[] = [];
const entitiesToDestroy: Entity[] = [];

class Transform {
    public x: number = 0;
    public y: number = 0;
    public z: number = 0;
    public r: number = 0;
}

class Entity {
    protected localTransform = new Transform();
    protected worldTransform = new Transform();
    protected previousTransform = new Transform();
    protected parent: Entity | null = null;
    protected children: Entity[] = [];
    protected isNew = true;
    protected needDestroy = false;
    protected isDestroyed = false;
    protected params: unknown = null;
    protected collider: unknown = null;
    protected update?: () => void;
    protected render?(context: CanvasRenderingContext2D): void;

    constructor(public readonly name: string) {
        entities.push(this);
    }

    public destroy() {
        if (!this.needDestroy) {
            entitiesToDestroy.push(this);
            this.needDestroy = true;
        }
    }

    public attachTo(parent: Entity) {
        if (!this.parent) {
            this.parent = parent;
            parent.children.push(this);
        }
    }

    public detach() {
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index !== -1) {
                this.parent.children.splice(index, 1);
                this.parent = null;
                Object.assign(this.localTransform, this.worldTransform);
            }
        }
    }

    public releaseChildren() {
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            child.parent = null;
            Object.assign(child.localTransform, child.worldTransform);
        }
        this.children.length = 0;
    }

    public getTransform(): Readonly<Transform> {
        return this.localTransform;
    }

    public setTransform(transform: Partial<Transform>) {
        Object.assign(this.localTransform, transform);
    }

    public hasParent() {
        return this.parent ? true : false;
    }

    public setUpdate(updateFn: () => void) {
        this.update = updateFn;
    }

    private updateWorldTransform() {
        if (this.parent) {
            const parentWorldTransform = this.parent.worldTransform;
            const parentWorldRotationInRadians = parentWorldTransform.r * degreesToRadians;

            const cos = Math.cos(parentWorldRotationInRadians);
            const sin = Math.sin(parentWorldRotationInRadians);
            const rotatedX = this.localTransform.x * cos - this.localTransform.y * sin;
            const rotatedY = this.localTransform.x * sin + this.localTransform.y * cos;

            this.worldTransform.x = parentWorldTransform.x + rotatedX;
            this.worldTransform.y = parentWorldTransform.y + rotatedY;
            this.worldTransform.z = parentWorldTransform.z + this.localTransform.z;
            this.worldTransform.r = parentWorldTransform.r + this.localTransform.r;
        } else {
            Object.assign(this.worldTransform, this.localTransform);
        }

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].updateWorldTransform();
        }
    }

    private destroyInternal() {
        if (this.isDestroyed) return;

        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index !== -1) {
                this.parent.children.splice(index, 1);
            }
        }

        for (let i = this.children.length - 1; i >= 0; i--) {
            this.children[i].destroyInternal();
        }

        const index = entities.indexOf(this);
        if (index !== -1) {
            entities.splice(index, 1);
        }

        this.isDestroyed = true;
    }

    static updateAll() {
        for (let i = 0; i < entities.length; i++) {
            Object.assign(entities[i].previousTransform, entities[i].worldTransform);
        }

        for (let i = 0; i < entities.length; i++) {
            entities[i].update?.();
        }

        for (let i = 0; i < entitiesToDestroy.length; i++) {
            entitiesToDestroy[i].destroyInternal();
        }
        entitiesToDestroy.length = 0;

        for (let i = 0; i < entities.length; i++) {
            if (!entities[i].parent) {
                entities[i].updateWorldTransform();
            }
        }

        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            if (entity.isNew) {
                Object.assign(entity.previousTransform, entity.worldTransform);
                entity.isNew = false;
            }
        }
    }

    static renderAll(context: CanvasRenderingContext2D, interpolation: number) {
        entities.sort((a, b) => a.worldTransform.z - b.worldTransform.z);

        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            if (entity.render) {
                const previous = entity.previousTransform;
                const world = entity.worldTransform;
                const x = previous.x + (world.x - previous.x) * interpolation;
                const y = previous.y + (world.y - previous.y) * interpolation;
                const r = previous.r + (world.r - previous.r) * interpolation;

                context.save();
                context.translate(x, y);
                context.rotate(r * degreesToRadians);
                entity.render(context);
                context.restore();
            }
        }
    }
}

export { Entity };
