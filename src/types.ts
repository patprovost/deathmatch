export interface Transform {
    x: number;
    y: number;
    z: number;
    r: number;
}

export interface Entity {
    name: string;
    transform: { local: Transform; world: Transform };
    parent: Entity | null;
    children: Entity[];
    update: (() => void) | null;
    render: ((context: CanvasRenderingContext2D) => void) | null;
    params: unknown;
    needDestroy: boolean;
    isDestroyed: boolean;
}

export interface ParamsRectangle {
    width: number;
    height: number;
    color: string;
}

export interface ParamsCircle {
    radius: number;
    color: string;
}
