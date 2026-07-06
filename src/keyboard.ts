import * as Display from "./display.ts";

const keys: Record<string, boolean> = {
    Digit1: false,
    Digit2: false,
    Digit3: false,
    Digit4: false,
    Digit5: false,
    Digit6: false,
    Digit7: false,
    Digit8: false,
    Digit9: false,
    Digit0: false,
    KeyQ: false,
    KeyW: false,
    KeyE: false,
    KeyR: false,
    KeyT: false,
    KeyY: false,
    KeyU: false,
    KeyI: false,
    KeyO: false,
    KeyP: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
    KeyF: false,
    KeyG: false,
    KeyH: false,
    KeyJ: false,
    KeyK: false,
    KeyL: false,
    KeyZ: false,
    KeyX: false,
    KeyC: false,
    KeyV: false,
    KeyB: false,
    KeyN: false,
    KeyM: false,
};
const keySet: Set<string> = new Set(Object.keys(keys));

Display.canvas.addEventListener("keyup", (event) => {
    if (keySet.has(event.code)) {
        keys[event.code] = false;
        event.preventDefault();
    }
});

Display.canvas.addEventListener("keydown", (event) => {
    if (keySet.has(event.code)) {
        if (!event.repeat) {
            keys[event.code] = true;
        }
        event.preventDefault();
    }
});

function poll(key: string) {
    return keySet.has(key) ? keys[key] : false;
}

function consume(key: string) {
    if (!keySet.has(key) || !keys[key]) {
        return false;
    } else {
        keys[key] = false;
        return true;
    }
}

export { consume, poll };
