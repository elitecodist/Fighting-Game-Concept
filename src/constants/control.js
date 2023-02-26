export const GamepadThumbstick = {
    DEAD_ZONE: 'deadZone',
    HORIZONTAL_AXE_ID: 'horizontalAxeId',
    VERTICAL_AXE_ID: 'verticalAxeId',
};

export const Control = {
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down',
};

export const controls = [
    {
        gamePad: {
            [GamepadThumbstick.DEAD_ZONE]: '',
            [GamepadThumbstick.HORIZONTAL_AXE_ID]: '',
            [GamepadThumbstick.VERTICAL_AXE_ID]: '',

            [Control.LEFT]: '',
            [Control.RIGHT]: '',
            [Control.UP]: '',
            [Control.DOWN]: '',
        },
        keyboard: {
            [Control.LEFT]: 'KeyA',
            [Control.RIGHT]: 'KeyD',
            [Control.UP]: 'Space',
            [Control.DOWN]: 'KeyS',
        }
    },
    {
        gamePad: {
            [GamepadThumbstick.DEAD_ZONE]: '',
            [GamepadThumbstick.HORIZONTAL_AXE_ID]: '',
            [GamepadThumbstick.VERTICAL_AXE_ID]: '',

            [Control.LEFT]: '',
            [Control.RIGHT]: '',
            [Control.UP]: '',
            [Control.DOWN]: '',
        },
        keyboard: {
            [Control.LEFT]: 'ArrowLeft',
            [Control.RIGHT]: 'ArrowRight',
            [Control.UP]: 'ArrowUp',
            [Control.DOWN]: 'ArrowDown',
        }
    },
]