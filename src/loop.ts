const updatesPerSecond = 60;
const timestep = 1000 / updatesPerSecond;
let update: () => void;
let render: () => void;
let isRunning: boolean;
let lagTime: number;
let previousTime: number;

function loop(currentTime: number) {
    if (!isRunning) return;
    try {
        const deltaTime = currentTime - previousTime;
        previousTime = currentTime;
        lagTime += deltaTime;
        while (lagTime >= timestep) {
            update();
            lagTime -= timestep;
        }
        render();
        requestAnimationFrame(loop);
    } catch (error) {
        console.error(error);
        stop();
    }
}

function start(initFn: () => void, updateFn: () => void, renderFn: () => void) {
    if (isRunning) return;
    initFn();
    update = updateFn;
    render = renderFn;
    isRunning = true;
    lagTime = 0;
    previousTime = performance.now();
    requestAnimationFrame(loop);
}

function stop() {
    isRunning = false;
}

export { start, stop };
