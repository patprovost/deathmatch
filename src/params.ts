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

interface JointParams {
    radius: number;
}

type Params = RectangleParams | CircleParams | CapsuleParams | JointParams;

export type { CapsuleParams, CircleParams, JointParams, Params, RectangleParams };
