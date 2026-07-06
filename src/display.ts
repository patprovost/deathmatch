const designResolution = { width: 1920, height: 1080 };
const aspectRatio = calculateAspectRatio(designResolution.width, designResolution.height);
let renderScale: number;
let designScale: number;

const canvas = document.createElement("canvas");
const context = canvas.getContext("2d")!;
const container = document.createElement("div");
container.style.display = "flex";
container.style.alignItems = "center";
container.style.justifyContent = "center";
container.style.width = "100vw";
container.style.height = "100vh";
container.append(canvas);
document.body.style.backgroundColor = "black";
document.body.style.margin = "0";
document.body.append(container);
canvas.tabIndex = 0;
canvas.focus({ focusVisible: false });

const resizeObserver = new ResizeObserver(resizeCanvas);
resizeObserver.observe(container);
resizeCanvas();

function calculateAspectRatio(width: number, height: number) {
    function greatestCommonDivisor(a: number, b: number) {
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
    const divisor = greatestCommonDivisor(width, height);
    return { horizontal: width / divisor, vertical: height / divisor };
}

function resizeCanvas() {
    const ratio = Math.floor(Math.min(
        container.clientWidth / aspectRatio.horizontal,
        container.clientHeight / aspectRatio.vertical,
    ));
    const width = ratio * aspectRatio.horizontal;
    const height = ratio * aspectRatio.vertical;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    renderScale = (width / designResolution.width) * devicePixelRatio;
    designScale = designResolution.width / width;
}

export { canvas, context, designScale, renderScale };
