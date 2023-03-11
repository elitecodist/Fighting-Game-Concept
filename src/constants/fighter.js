import { FRAME_TIME } from "./game.js";

export const PUSH_FRICTION = 66;
export const FIGHTER_START_DISTANCE = 88;
export const FIGHTER_HURT_DELAY = 7 + 8;

export const FighterDirection = {
    LEFT: -1,
    RIGHT: 1,
};

export const FighterId = {
    KEN: 'Ken',
    KARIN: 'Karin'
}

export const FighterAttackType = {
    RED: 'red',
    GREEN: 'green',
}

export const FighterAttackStrength = {
    LIGHT: 'light',
    MEDIUM: 'medium',
    HEAVY: 'heavy',
}

export const FighterHurtBox = {
    HEAD: "head",
    BODY: "body",
    LEGS: "legs",
}

export const FighterAttackBaseData = {
    [FighterAttackStrength.LIGHT]: {
        score: 0,
        damage: 1,
        slide: {
            velocity: -12 * FRAME_TIME,
            friction: 600
        }
    },
    [FighterAttackStrength.MEDIUM]: {
        score: 0,
        damage: 1,
        slide: {
            velocity: -16 * FRAME_TIME,
            friction: 600
        }
    },
    [FighterAttackStrength.HEAVY]: {
        score: 0,
        damage: 1,
        slide: {
            velocity: -22 * FRAME_TIME,
            friction: 800
        }
    },
}

export const FighterState = {
    IDLE: 'idle',
    WALK_FORWARD: 'walk-forward',
    WALK_BACKWARD: 'walk-backward',
    JUMP_START: 'jump-start',
    JUMP_NEUTRAL: 'jump-neutral',
    JUMP_FORWARD: 'jump-forward',
    JUMP_BACKWARD: 'jump-backward',
    JUMP_LAND: 'jump-land',
    CROUCH: 'crouch',
    CROUCH_DOWN: 'crouch-down',
    CROUCH_RISE: 'crouch-rise',
    IDLE_TURN: 'idle-turn',
    CROUCH_TURN: 'crouch-turn',
    FIVE_PUNCH: '5p',
    SIX_PUNCH: '6p',
    FOUR_PUNCH: '4P',
    FIVE_KICK: '5k',
    SIX_KICK: '6k',
    FOUR_KICK: '4k',
    HURT_HEAD_LIGHT: 'hurt-head-light',
    HURT_HEAD_MEDIUM: 'hurt-head-medium',
    HURT_HEAD_HEAVY: 'hurt-head-heavy',
    HURT_BODY_LIGHT: 'hurt-body-light',
    HURT_BODY_MEDIUM: 'hurt-body-medium',
    HURT_BODY_HEAVY: 'hurt-body-heavy',
};

export const FrameDelay = {
    FREEZE: 0,
    TRANSITION: -1,
}

export const PushBox = {
    STAND: [-16, -80, 32, 78],
    JUMP: [-16, -91, 32, 66],
    SEMICROUCH: [-16, -58, 32, 58],
    CROUCH: [-16, -50, 32, 50],
};

export const HurtBox = {
    STAND: [[-14, -85, 19, 17],[-25, -73, 41, 37],[-32, -36, 62, 36]],
    NONE: [[0,0,0,0],[0,0,0,0],[0,0,0,0]]
};

export const hurtStateValidFrom = [
    FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD,
    FighterState.JUMP_LAND, FighterState.JUMP_START, FighterState.IDLE_TURN,
    FighterState.FIVE_PUNCH, FighterState.SIX_PUNCH, FighterState.FOUR_PUNCH,
    FighterState.FIVE_KICK, FighterState.SIX_KICK, FighterState.FOUR_KICK,
    FighterState.HURT_HEAD_LIGHT, FighterState.HURT_HEAD_MEDIUM, FighterState.HURT_HEAD_HEAVY, 
    FighterState.HURT_BODY_LIGHT, FighterState.HURT_BODY_MEDIUM, FighterState.HURT_BODY_HEAVY
]