import type { Entity, Transform } from "./types.ts";

const degreesToRadians = Math.PI / 180;
const entities: Entity[] = [];
const entitiesToDestroy: Entity[] = [];

function create(name: string): Entity {
    const entity: Entity = {
        name,
        transform: {
            local: { x: 0, y: 0, z: 0, r: 0 },
            world: { x: 0, y: 0, z: 0, r: 0 },
            previous: { x: 0, y: 0, z: 0, r: 0 },
        },
        parent: null,
        children: [],
        update: null,
        render: null,
        params: null,
        isNew: true,
        needDestroy: false,
        isDestroyed: false,
    };

    entities.push(entity);
    return entity;
}

function destroy(entity: Entity) {
    if (!entity.needDestroy) {
        entitiesToDestroy.push(entity);
        entity.needDestroy = true;
    }
}

function attach(entity: Entity, parent: Entity) {
    if (!entity.parent) {
        entity.parent = parent;
        parent.children.push(entity);
    }
}

function detach(entity: Entity) {
    if (entity.parent) {
        const index = entity.parent.children.indexOf(entity);
        if (index !== -1) {
            entity.parent.children.splice(index, 1);
            entity.parent = null;
            Object.assign(entity.transform.local, entity.transform.world);
        }
    }
}

function releaseChildren(entity: Entity) {
    const children = entity.children;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        child.parent = null;
        Object.assign(child.transform.local, child.transform.world);
    }
    children.length = 0;
}

function updateAll() {
    for (let i = 0; i < entities.length; i++) {
        Object.assign(entities[i].transform.previous, entities[i].transform.world);
    }

    for (let i = 0; i < entities.length; i++) {
        entities[i].update?.();
    }

    for (let i = 0; i < entitiesToDestroy.length; i++) {
        destroyEntity(entitiesToDestroy[i]);
    }
    entitiesToDestroy.length = 0;

    for (let i = 0; i < entities.length; i++) {
        if (!entities[i].parent) {
            updateWorldTransform(entities[i]);
        }
    }

    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        if (entity.isNew) {
            Object.assign(entity.transform.previous, entity.transform.world);
            entity.isNew = false;
        }
    }
}

function renderAll(context: CanvasRenderingContext2D, interpolation: number) {
    entities.sort((a, b) => a.transform.world.z - b.transform.world.z);

    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        if (entity.render) {
            const { previous, world } = entity.transform;
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

function setTransform(entity: Entity, transform: Partial<Transform>) {
    Object.assign(entity.transform.local, transform);
}

function updateWorldTransform(entity: Entity) {
    const entityLocalTransform = entity.transform.local;
    const entityWorldTransform = entity.transform.world;

    if (entity.parent) {
        const parentWorldTransform = entity.parent.transform.world;
        const parentWorldRotationInRadians = parentWorldTransform.r * degreesToRadians;

        const cos = Math.cos(parentWorldRotationInRadians);
        const sin = Math.sin(parentWorldRotationInRadians);
        const rotatedX = entityLocalTransform.x * cos - entityLocalTransform.y * sin;
        const rotatedY = entityLocalTransform.x * sin + entityLocalTransform.y * cos;

        entityWorldTransform.x = parentWorldTransform.x + rotatedX;
        entityWorldTransform.y = parentWorldTransform.y + rotatedY;
        entityWorldTransform.z = parentWorldTransform.z + entityLocalTransform.z;
        entityWorldTransform.r = parentWorldTransform.r + entityLocalTransform.r;
    } else {
        Object.assign(entityWorldTransform, entityLocalTransform);
    }

    for (let i = 0; i < entity.children.length; i++) {
        updateWorldTransform(entity.children[i]);
    }
}

function destroyEntity(entity: Entity) {
    if (entity.isDestroyed) return;

    if (entity.parent) {
        const index = entity.parent.children.indexOf(entity);
        if (index !== -1) {
            entity.parent.children.splice(index, 1);
        }
    }

    for (let i = entity.children.length - 1; i >= 0; i--) {
        destroyEntity(entity.children[i]);
    }

    const index = entities.indexOf(entity);
    if (index !== -1) {
        entities.splice(index, 1);
    }

    entity.isDestroyed = true;
}

export { attach, create, destroy, detach, releaseChildren, renderAll, setTransform, updateAll };
