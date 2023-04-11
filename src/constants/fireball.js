import { Control } from "./control.js"

export const FireballState = {
    ACTIVE: 'active',
    COLLIDE: 'collide',
};

export const FireballCollideState = {
    NONE: 'none',
    OPPONENT: 'opponent',
    FIREBALL: 'fireball'
}

export const fireballVelocity = {
    [Control.ACCEPT]: 220,
};