export const PUSH_FRICTION = 66;
export const FIGHTER_START_DISTANCE = 88;

export const FighterDirection = {
    LEFT: -1,
    RIGHT: 1,
};

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