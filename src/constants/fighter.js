export const PUSH_FRICTION = 66;
export const FIGHTER_START_DISTANCE = 88;

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

export const FighterAttackBaseData = {
    [FighterAttackStrength.LIGHT]: {
        score: 0,
        damage: 1,
    },
    [FighterAttackStrength.MEDIUM]: {
        score: 0,
        damage: 1,
    },
    [FighterAttackStrength.HEAVY]: {
        score: 0,
        damage: 1,
    },
}

export const FighterState = {
    IDLE: 'idle',
    WALK_FORWARD: 'walkForward',
    WALK_BACKWARD: 'walkBackward',
    JUMP_START: 'jumpStart',
    JUMP_NEUTRAL: 'jumpNeutral',
    JUMP_FORWARD: 'jumpForward',
    JUMP_BACKWARD: 'jumpBackward',
    JUMP_LAND: 'jumpLand',
    CROUCH: 'crouch',
    CROUCH_DOWN: 'crouchDown',
    CROUCH_RISE: 'crouchRise',
    IDLE_TURN: 'idleTurn',
    CROUCH_TURN: 'crouchTurn',
    FIVE_PUNCH: '5p',
    SIX_PUNCH: '6p',
    FOUR_PUNCH: '4P',
    FIVE_KICK: '5k',
    SIX_KICK: '6k',
    FOUR_KICK: '4k'
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