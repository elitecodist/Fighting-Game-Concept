import { GamepadThumbstick, Control } from "../constants/control.js"

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
            [Control.ACCEPT]: '',
            [Control.SCROLL_LEFT]:'',
            [Control.SCROLL_RIGHT]:'',
        },
        keyboard: {
            [Control.LEFT]: 'KeyA',
            [Control.RIGHT]: 'KeyD',
            [Control.UP]: 'Space',
            [Control.DOWN]: 'KeyS',
            [Control.ACCEPT]: 'KeyI',
            [Control.SCROLL_LEFT]:'KeyO',
            [Control.SCROLL_RIGHT]:'KeyP',
            [Control.SET]: 'KeyK',
            [Control.CANCEL]:'KeyL',
            [Control.START]:'Semicolon',
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
            [Control.ACCEPT]: 'Insert',
            [Control.SCROLL_LEFT]:'Home',
            [Control.SCROLL_RIGHT]:'PageUp',
            [Control.SET]: 'Delete',
            [Control.CANCEL]:'End',
            [Control.START]:'PageDown',
        }
    },
]