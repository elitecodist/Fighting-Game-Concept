import { Control, GamepadThumbstick } from "../constants/control.js";
import { controls } from "../config/controls.js";
import { FighterDirection } from "../constants/fighter.js";

const heldKeys = new Set();
const pressedKeys = new Set();

const gamePads = new Map();
const pressedButtons = new Set();

const mappedKeys = controls.map(({ keyboard }) => Object.values(keyboard)).flat();

function handleKeyDown(event) {
    if (!mappedKeys.includes(event.code)) return;

    event.preventDefault();
    heldKeys.add(event.code);
}

function handleKeyUp(event) {
    if (!mappedKeys.includes(event.code)) return;

    event.preventDefault();
    heldKeys.delete(event.code);
    pressedKeys.delete(event.code);
}

function handleGamepadConnected(event) {
    const { gamepad: { index, axes, buttons } } = event;

    gamePads.set(index, { axes, buttons });
}

function handleGamepadDisonnected(event) {
    const { gamepad: { index } } = event;

    gamePads.delete(index);
}

export function registerGamepadEvents() {
    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisonnected);
}

export function registerKeyboardEvents() {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

export function pollGamepads() {
    for (const gamePad of navigator.getGamepads()) {
        if (!gamePad) continue;

        if (gamePads.has(gamePad.index)) {
            const { index, axes, buttons } = gamePad;

            gamePads.set(index, { axes, buttons });

            for (const button in buttons) {
                const key = `${gamePad.index}-${button}`;

                if (pressedButtons.has(key) && isButtonUp(gamePad.index, button)) {
                    pressedButtons.delete(key);
                }
            }
        }
    }
}

export const isKeyDown = (code) => heldKeys.has(code);
export const isKeyUp = (code) => !heldKeys.has(code);

export function isKeyPressed(code) {
    if (heldKeys.has(code) && !pressedKeys.has(code)) {
        pressedKeys.add(code);
        return true;
    }

    return false;
}

export const isButtonDown = (padId, button) => gamePads.get(padId)?.buttons[button].pressed;
export const isButtonUp = (padId, button) => !gamePads.get(padId)?.buttons[button].pressed;

export function isButtonPressed(padId, button) {
    const key = `${padId}-${button}`;

    if (isButtonDown(padId, button) && !pressedButtons.has(key)) {
        pressedButtons.add(key);
        return true;
    }

    return false;
}

export const isAxeMore = (padId, axeId, value) => gamePads.get(padId)?.axes[axeId] >= value;
export const isAxeLess = (padId, axeId, value) => gamePads.get(padId)?.axes[axeId] <= value;

export const isControlDown = (id, control) => isKeyDown(controls[id].keyboard[control])
    || isButtonDown(id, controls[id].gamePad[control]);

export const isControlPressed = (id, control) => isKeyPressed(controls[id].keyboard[control])
|| isButtonPressed(id, controls[id].gamePad[control]);

export const isLeft = (id) => isKeyDown(controls[id].keyboard[Control.LEFT])
    || isButtonDown(id, controls[id].gamePad[Control.LEFT])
    || isAxeLess(id,
        controls[id].gamePad[GamepadThumbstick.HORIZONTAL_AXE_ID],
        -controls[id].gamePad[GamepadThumbstick.DEAD_ZONE],
    );
export const isRight = (id) => isKeyDown(controls[id].keyboard[Control.RIGHT])
    || isButtonDown(id, controls[id].gamePad[Control.RIGHT])
    || isAxeMore(id,
        controls[id].gamePad[GamepadThumbstick.HORIZONTAL_AXE_ID],
        controls[id].gamePad[GamepadThumbstick.DEAD_ZONE],
    );
export const isUp = (id) => isKeyDown(controls[id].keyboard[Control.UP])
    || isButtonDown(id, controls[id].gamePad[Control.UP])
    || isAxeLess(id,
        controls[id].gamePad[GamepadThumbstick.VERTICAL_AXE_ID],
        -controls[id].gamePad[GamepadThumbstick.DEAD_ZONE],
    );
export const isDown = (id) => isKeyDown(controls[id].keyboard[Control.DOWN])
    || isButtonDown(id, controls[id].gamePad[Control.DOWN])
    || isAxeMore(id,
        controls[id].gamePad[GamepadThumbstick.VERTICAL_AXE_ID],
        controls[id].gamePad[GamepadThumbstick.DEAD_ZONE],
    );

export const isForward = (id, direction) => direction === FighterDirection.RIGHT ? isRight(id) : isLeft(id);
export const isBackward = (id, direction) => direction === FighterDirection.LEFT ? isRight(id) : isLeft(id);

export const isIdle = (id) => !(isLeft(id) || isRight(id) || isUp(id) || isDown(id));

export const is5P = (id) => isControlPressed(id, Control.ACCEPT);
export const is6P = (id) => isControlPressed(id, Control.SCROLL_LEFT);
export const is4P = (id) => isControlPressed(id, Control.SCROLL_RIGHT);

export const is5K = (id) => isControlPressed(id, Control.SET);
export const is6K = (id) => isControlPressed(id, Control.CANCEL);
export const is4K = (id) => isControlPressed(id, Control.START);
