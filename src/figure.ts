import { Entity, Transform } from "./entity.ts";
import { CapsuleCollider, CircleCollider } from "./collision.ts";
import type { CapsuleParams, CircleParams, JointParams } from "./params.ts";

const degreesToRadians = Math.PI / 180;

class Pose {
    public pelvis: Partial<Transform> = new Transform();
    public lumbar: Partial<Transform> = new Transform();
    public lowerThorax: Partial<Transform> = new Transform();
    public upperThorax: Partial<Transform> = new Transform();
    public cervical: Partial<Transform> = new Transform();
    public shoulderL: Partial<Transform> = new Transform();
    public elbowL: Partial<Transform> = new Transform();
    public shoulderR: Partial<Transform> = new Transform();
    public elbowR: Partial<Transform> = new Transform();
    public hipL: Partial<Transform> = new Transform();
    public kneeL: Partial<Transform> = new Transform();
    public hipR: Partial<Transform> = new Transform();
    public kneeR: Partial<Transform> = new Transform();
}

class Joint extends Entity {
    declare protected params: JointParams;
    declare protected collider: CircleCollider;

    constructor(name: string, owner: Entity, radius: number) {
        super(name, owner);
        this.params = { radius };
        this.collider = new CircleCollider();
    }

    protected override updateCollider() {
        const { x, y } = this.worldTransform;
        const { radius } = this.params;
        this.collider.update(x, y, radius);
    }
}

class Bone extends Entity {
    declare protected params: CapsuleParams;
    declare protected collider: CapsuleCollider;

    constructor(name: string, owner: Entity, width: number, height: number, radius: number, color: string) {
        super(name, owner);
        this.params = { width, height, radius, color };
        this.collider = new CapsuleCollider();
    }

    protected override render(context: CanvasRenderingContext2D) {
        const { width, height, radius, color } = this.params;
        context.beginPath();
        context.roundRect(-radius, -height / 2, width, height, radius);
        context.fillStyle = color;
        context.fill();
        // context.stroke();
    }

    protected override updateCollider() {
        const { x, y, r } = this.worldTransform;
        const { width, radius } = this.params;
        const centerOffset = width / 2 - radius;
        const radians = r * degreesToRadians;
        const centerX = x + Math.cos(radians) * centerOffset;
        const centerY = y + Math.sin(radians) * centerOffset;
        this.collider.update(centerX, centerY, r, width, radius);
    }
}

class Head extends Entity {
    declare protected params: CircleParams;
    declare protected collider: CircleCollider;

    constructor(name: string, owner: Entity, radius: number, color: string) {
        super(name, owner);
        this.params = { radius, color };
        this.collider = new CircleCollider();
    }

    protected override render(context: CanvasRenderingContext2D) {
        const { radius, color } = this.params;
        context.beginPath();
        context.arc(0, 0, radius, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
        // context.stroke();
    }

    protected override updateCollider() {
        const { x, y } = this.worldTransform;
        const { radius } = this.params;
        this.collider.update(x, y, radius);
    }
}

class Figure extends Entity {
    private pose: Pose;

    private boneThickness: number;
    private boneRadius: number;
    private boneDiameter: number;
    private lowerTorsoLength: number;
    private middleTorsoLength: number;
    private upperTorsoLength: number;
    private neckLength: number;
    private headRadius: number;
    private upperArmLength: number;
    private lowerArmLength: number;
    private upperLegLength: number;
    private lowerLegLength: number;

    private pelvis: Joint;
    private lowerTorso: Bone;
    private lumbar: Joint;
    private middleTorso: Bone;
    private lowerThorax: Joint;
    private upperTorso: Bone;
    private upperThorax: Joint;
    private neck: Bone;
    private cervical: Joint;
    private head: Head;
    private shoulderL: Joint;
    private upperArmL: Bone;
    private elbowL: Joint;
    private lowerArmL: Bone;
    private handL: Joint;
    private shoulderR: Joint;
    private upperArmR: Bone;
    private elbowR: Joint;
    private lowerArmR: Bone;
    private handR: Joint;
    private hipL: Joint;
    private upperLegL: Bone;
    private kneeL: Joint;
    private lowerLegL: Bone;
    private footL: Joint;
    private hipR: Joint;
    private upperLegR: Bone;
    private kneeR: Joint;
    private lowerLegR: Bone;
    private footR: Joint;

    constructor(name: string, private color: string, private size: number) {
        super(name);
        this.pose = new Pose();
        this.boneThickness = 20 * size;
        this.boneRadius = this.boneThickness / 2;
        this.boneDiameter = this.boneRadius * 2;
        this.lowerTorsoLength = 58 * size;
        this.middleTorsoLength = 59 * size;
        this.upperTorsoLength = 58 * size;
        this.neckLength = 44 * size;
        this.headRadius = 26 * size;
        this.upperArmLength = 94 * size;
        this.lowerArmLength = 78 * size;
        this.upperLegLength = 118 * size;
        this.lowerLegLength = 118 * size;

        this.pelvis = new Joint(
            "pelvis",
            this,
            this.boneRadius,
        );
        this.lowerTorso = new Bone(
            "lowerTorso",
            this,
            this.lowerTorsoLength,
            this.boneThickness,
            this.boneRadius,
            color,
        );
        this.lumbar = new Joint(
            "lumbar",
            this,
            this.boneRadius,
        );
        this.middleTorso = new Bone(
            "middleTorso",
            this,
            this.middleTorsoLength,
            this.boneThickness,
            this.boneRadius,
            color,
        );
        this.lowerThorax = new Joint(
            "lowerThorax",
            this,
            this.boneRadius,
        );
        this.upperTorso = new Bone(
            "upperTorso",
            this,
            this.upperTorsoLength,
            this.boneThickness,
            this.boneRadius,
            color,
        );
        this.upperThorax = new Joint(
            "upperThorax",
            this,
            this.boneRadius,
        );
        this.neck = new Bone(
            "neck",
            this,
            this.neckLength,
            this.boneThickness,
            this.boneRadius,
            color,
        );
        this.cervical = new Joint(
            "cervical",
            this,
            this.boneRadius,
        );
        this.head = new Head(
            "head",
            this,
            this.headRadius,
            color,
        );
        this.shoulderL = new Joint(
            "shoulderL",
            this,
            this.boneRadius,
        );
        this.upperArmL = new Bone(
            "upperArmL",
            this,
            this.upperArmLength,
            this.boneThickness,
            this.boneRadius,
            color,
        );
        this.elbowL = new Joint(
            "elbowL",
            this,
            this.boneRadius,
        );
        this.lowerArmL = new Bone(
            "lowerArmL",
            this,
            this.lowerArmLength,
            this.boneThickness,
            this.boneRadius,
            color,
        );
        this.handL = new Joint(
            "handL",
            this,
            this.boneRadius,
        );
        this.shoulderR = new Joint(
            "shoulderR",
            this,
            this.boneRadius,
        );
        this.upperArmR = new Bone(
            "upperArmR",
            this,
            this.upperArmLength,
            this.boneThickness,
            this.boneRadius,
            color,
        );
        this.elbowR = new Joint(
            "elbowR",
            this,
            this.boneRadius,
        );
        this.lowerArmR = new Bone(
            "lowerArmR",
            this,
            this.lowerArmLength,
            this.boneThickness,
            this.boneRadius,
            color,
        );
        this.handR = new Joint(
            "handR",
            this,
            this.boneRadius,
        );
        this.hipL = new Joint(
            "hipL",
            this,
            this.boneRadius,
        );
        this.upperLegL = new Bone(
            "upperLegL",
            this,
            this.upperLegLength,
            this.boneThickness,
            this.boneRadius,
            color,
        );
        this.kneeL = new Joint(
            "kneeL",
            this,
            this.boneRadius,
        );
        this.lowerLegL = new Bone(
            "lowerLegL",
            this,
            this.lowerLegLength,
            this.boneThickness,
            this.boneRadius,
            color,
        );
        this.footL = new Joint(
            "footL",
            this,
            this.boneRadius,
        );
        this.hipR = new Joint(
            "hipR",
            this,
            this.boneRadius,
        );
        this.upperLegR = new Bone(
            "upperLegR",
            this,
            this.upperLegLength,
            this.boneThickness,
            this.boneRadius,
            color,
        );
        this.kneeR = new Joint(
            "kneeR",
            this,
            this.boneRadius,
        );
        this.lowerLegR = new Bone(
            "lowerLegR",
            this,
            this.lowerLegLength,
            this.boneThickness,
            this.boneRadius,
            color,
        );
        this.footR = new Joint(
            "footR",
            this,
            this.boneRadius,
        );

        this.pelvis.attachTo(this);
        this.lowerTorso.attachTo(this.pelvis);
        this.lumbar.attachTo(this.lowerTorso);
        this.middleTorso.attachTo(this.lumbar);
        this.lowerThorax.attachTo(this.middleTorso);
        this.upperTorso.attachTo(this.lowerThorax);
        this.upperThorax.attachTo(this.upperTorso);
        this.neck.attachTo(this.upperThorax);
        this.cervical.attachTo(this.neck);
        this.head.attachTo(this.cervical);
        this.shoulderL.attachTo(this.upperThorax);
        this.upperArmL.attachTo(this.shoulderL);
        this.elbowL.attachTo(this.upperArmL);
        this.lowerArmL.attachTo(this.elbowL);
        this.handL.attachTo(this.lowerArmL);
        this.shoulderR.attachTo(this.upperThorax);
        this.upperArmR.attachTo(this.shoulderR);
        this.elbowR.attachTo(this.upperArmR);
        this.lowerArmR.attachTo(this.elbowR);
        this.handR.attachTo(this.lowerArmR);
        this.hipL.attachTo(this.pelvis);
        this.upperLegL.attachTo(this.hipL);
        this.kneeL.attachTo(this.upperLegL);
        this.lowerLegL.attachTo(this.kneeL);
        this.footL.attachTo(this.lowerLegL);
        this.hipR.attachTo(this.pelvis);
        this.upperLegR.attachTo(this.hipR);
        this.kneeR.attachTo(this.upperLegR);
        this.lowerLegR.attachTo(this.kneeR);
        this.footR.attachTo(this.lowerLegR);

        this.setPose({});
        this.lumbar.setTransform({ x: this.lowerTorsoLength - this.boneDiameter });
        this.lowerThorax.setTransform({ x: this.middleTorsoLength - this.boneDiameter });
        this.upperThorax.setTransform({ x: this.upperTorsoLength - this.boneDiameter });
        this.cervical.setTransform({ x: this.neckLength - this.boneDiameter });
        this.head.setTransform({ x: this.headRadius - this.boneRadius });
        this.elbowL.setTransform({ x: this.upperArmLength - this.boneDiameter });
        this.handL.setTransform({ x: this.lowerArmLength - this.boneDiameter });
        this.elbowR.setTransform({ x: this.upperArmLength - this.boneDiameter });
        this.handR.setTransform({ x: this.lowerArmLength - this.boneDiameter });
        this.kneeL.setTransform({ x: this.upperLegLength - this.boneDiameter });
        this.footL.setTransform({ x: this.lowerLegLength - this.boneDiameter });
        this.kneeR.setTransform({ x: this.upperLegLength - this.boneDiameter });
        this.footR.setTransform({ x: this.lowerLegLength - this.boneDiameter });
    }

    setPose(pose: Partial<Pose>) {
        Object.assign(this.pose, pose);
        this.applyPose();
    }

    private applyPose() {
        const { pose } = this;
        this.pelvis.setTransform({ r: pose.pelvis.r ?? 0 });
        this.lumbar.setTransform({ r: pose.lumbar.r ?? 0 });
        this.lowerThorax.setTransform({ r: pose.lowerThorax.r ?? 0 });
        this.upperThorax.setTransform({ r: pose.upperThorax.r ?? 0 });
        this.cervical.setTransform({ r: pose.cervical.r ?? 0 });
        this.shoulderL.setTransform({ r: pose.shoulderL.r ?? 0 });
        this.elbowL.setTransform({ r: pose.elbowL.r ?? 0 });
        this.shoulderR.setTransform({ r: pose.shoulderR.r ?? 0 });
        this.elbowR.setTransform({ r: pose.elbowR.r ?? 0 });
        this.hipL.setTransform({ r: 180 + (pose.hipL.r ?? 0) });
        this.kneeL.setTransform({ r: pose.kneeL.r ?? 0 });
        this.hipR.setTransform({ r: 180 + (pose.hipR.r ?? 0) });
        this.kneeR.setTransform({ r: pose.kneeR.r ?? 0 });
    }
}

export { Figure };
