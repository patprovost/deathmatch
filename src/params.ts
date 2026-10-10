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

type Params = RectangleParams | CircleParams | CapsuleParams;

export type { CapsuleParams, CircleParams, Params, RectangleParams };
