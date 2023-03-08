import { Control } from "../../constants/control.js";
import {
    FighterDirection, FighterState,
    FIGHTER_START_DISTANCE, FrameDelay,
    PUSH_FRICTION, FighterAttackType
} from "../../constants/fighter.js";
import { FRAME_TIME } from "../../constants/game.js";
import { STAGE_FLOOR, STAGE_MID_POINT, STAGE_PADDING } from "../../constants/stage.js";
import * as control from "../../InputHandler.js";
import { boxOverlap, boxOverlapHelp, getActualBoxDimensions } from "../../util/collision.js";

const pushableStates = [
    FighterState.IDLE, FighterState.CROUCH, FighterState.JUMP_NEUTRAL,
    FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
]

export class Fighter {
    constructor(playerId) {
        this.playerId = playerId;
        this.position = {
            x: STAGE_MID_POINT + STAGE_PADDING + (playerId === 0 ? -FIGHTER_START_DISTANCE : FIGHTER_START_DISTANCE),
            y: STAGE_FLOOR
        };
        this.velocity = { x: 0, y: 0 };
        this.initialVelocity = {};
        this.direction = playerId === 0 ? FighterDirection.RIGHT : FighterDirection.LEFT;
        this.gravity = 0;

        this.frames = new Map();
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animations = {};

        this.image = new Image();

        this.opponent;

        this.boxes = {
            push: { x: 0, y: 0, width: 0, height: 0 },
            hurt: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            hit: { x: 0, y: 0, width: 0, height: 0 },
        }

        this.states = {
            [FighterState.IDLE]: {
                init: this.handleIdleInit,
                update: this.handleIdleState,
                validFrom: [
                    undefined,
                    FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD,
                    FighterState.JUMP_NEUTRAL, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
                    FighterState.CROUCH_RISE, FighterState.JUMP_LAND, FighterState.IDLE_TURN,
                    FighterState.FIVE_PUNCH, FighterState.SIX_PUNCH, FighterState.FOUR_PUNCH,
                    FighterState.FIVE_KICK, FighterState.SIX_KICK, FighterState.FOUR_KICK,
                ],
            },
            [FighterState.WALK_FORWARD]: {
                init: this.handleWalkInit,
                update: this.handleWalkForwardState,
                validFrom: [
                    FighterState.IDLE, FighterState.WALK_BACKWARD,
                ],
            },
            [FighterState.WALK_BACKWARD]: {
                init: this.handleWalkInit,
                update: this.handleWalkBackwardState,
                validFrom: [
                    FighterState.IDLE, FighterState.WALK_FORWARD,
                ],
            },
            [FighterState.JUMP_START]: {
                init: this.handleJumpStartInit,
                update: this.handleJumpStartState,
                validFrom: [
                    FighterState.IDLE, FighterState.JUMP_LAND,
                    FighterState.WALK_FORWARD,
                    FighterState.WALK_BACKWARD,
                ],
            },
            [FighterState.JUMP_NEUTRAL]: {
                init: this.handleJumpInit,
                update: this.handleJumpState,
                validFrom: [
                    FighterState.JUMP_START
                ],
            },
            [FighterState.JUMP_FORWARD]: {
                init: this.handleJumpInit,
                update: this.handleJumpState,
                validFrom: [
                    FighterState.JUMP_START,
                ],
            },
            [FighterState.JUMP_BACKWARD]: {
                init: this.handleJumpInit,
                update: this.handleJumpState,
                validFrom: [
                    FighterState.JUMP_START,
                ],
            },
            [FighterState.JUMP_LAND]: {
                init: this.handleJumpLandInit,
                update: this.handleJumpLandState,
                validFrom: [
                    FighterState.JUMP_NEUTRAL, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD
                ],
            },
            [FighterState.CROUCH]: {
                init: () => { },
                update: this.handleCrouchState,
                validFrom: [
                    FighterState.CROUCH_DOWN, FighterState.CROUCH_TURN
                ],
            },
            [FighterState.CROUCH_DOWN]: {
                init: this.handleCrouchDownInit,
                update: this.handleCrouchDownState,
                validFrom: [
                    FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD
                ],
            },
            [FighterState.CROUCH_RISE]: {
                init: this.handleCrouchRiseInit,
                update: this.handleCrouchRiseState,
                validFrom: [
                    FighterState.CROUCH
                ],
            },
            [FighterState.IDLE_TURN]: {
                init: () => { },
                update: this.handleIdleTurnState,
                validFrom: [
                    FighterState.IDLE, FighterState.JUMP_LAND,
                    FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD
                ],
            },
            [FighterState.CROUCH_TURN]: {
                init: () => { },
                update: this.handleCrouchTurnState,
                validFrom: [
                    FighterState.CROUCH
                ],
            },
            [FighterState.FIVE_PUNCH]: {
                attackType: FighterAttackType.RED,
                init: this.handle5PInit,
                update: this.handle5PState,
                validFrom: [
                    FighterState.IDLE,
                    FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD
                ]
            },
            [FighterState.SIX_PUNCH]: {
                attackType: FighterAttackType.RED,
                init: this.handle6PInit,
                update: this.handle6PState,
                validFrom: [
                    FighterState.IDLE,
                    FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD
                ]
            },
            [FighterState.FOUR_PUNCH]: {
                attackType: FighterAttackType.RED,
                init: this.handle4PInit,
                update: this.handle4PState,
                validFrom: [
                    FighterState.IDLE,
                    FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD
                ]
            },
            [FighterState.FIVE_KICK]: {
                attackType: FighterAttackType.GREEN,
                init: this.handle5KInit,
                update: this.handle5KState,
                validFrom: [
                    FighterState.IDLE,
                    FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD
                ]
            },
            [FighterState.SIX_KICK]: {
                attackType: FighterAttackType.GREEN,
                init: this.handle6KInit,
                update: this.handle6KState,
                validFrom: [
                    FighterState.IDLE,
                    FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD
                ]
            },
            [FighterState.FOUR_KICK]: {
                attackType: FighterAttackType.GREEN,
                init: this.handle4KInit,
                update: this.handle4KState,
                validFrom: [
                    FighterState.IDLE,
                    FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD
                ]
            },
        }

        this.changeState(FighterState.IDLE);
    }

    isAnimeComplete = () => this.animations[this.currentState][this.animationFrame][1] === FrameDelay.TRANSITION;

    resetVelocities() {
        this.velocity = { x: 0, y: 0 };
    }

    getDirection = () => {
        if (this.position.x + this.boxes.push.x + this.boxes.push.width <= this.opponent.position.x + this.opponent.boxes.push.x) {
            return FighterDirection.RIGHT;
        } else if (this.position.x + this.boxes.push.x >= this.opponent.position.x + this.opponent.boxes.push.x + this.opponent.boxes.push.width) {
            return FighterDirection.LEFT;
        }

        return this.direction;
    }
    getBoxes(frameKey) {
        const [,
            [pushX = 0, pushY = 0, pushWidth = 0, pushHeight = 0] = [],
            [head = [0, 0, 0, 0], body = [0, 0, 0, 0], legs = [0, 0, 0, 0]] = [],
            [hitX = 0, hitY = 0, hitWidth = 0, hitHeight = 0] = [],
        ] = this.frames.get(frameKey);

        return {
            push: { x: pushX, y: pushY, width: pushWidth, height: pushHeight },
            hurt: [head, body, legs],
            hit: { x: hitX, y: hitY, width: hitWidth, height: hitHeight }
        }
    }

    changeState = (newState) => {
        if (newState === this.currentState
            || !this.states[newState].validFrom.includes(this.currentState)) {
            console.warn(`illegal transition from ${this.currentState} to ${newState}`);
            return;
        }

        this.currentState = newState;
        this.animationFrame = 0;

        this.states[this.currentState].init()

    }

    handle5PInit = () => {
        this.resetVelocities();
    }
    handle6PInit = () => {
        this.resetVelocities();
    }
    handle4PInit = () => {
        this.resetVelocities();
    }
    handle5KInit = () => {
        this.resetVelocities();
    }
    handle6KInit = () => {
        this.resetVelocities();
    }
    handle4KInit = () => {
        this.resetVelocities();
    }

    handle5PState = () => {
        if (!this.isAnimeComplete()) return;
        this.changeState(FighterState.IDLE);
    }
    handle6PState = () => {
        if (!this.isAnimeComplete()) return;
        this.changeState(FighterState.IDLE);
    }
    handle4PState = () => {
        if (!this.isAnimeComplete()) return;
        this.changeState(FighterState.IDLE);
    }
    handle5KState = () => {
        if (this.animationFrame < 2) return;
        if (control.is5K(this.playerId)) this.animationFrame = 0;

        if (!this.isAnimeComplete()) return;
        this.changeState(FighterState.IDLE);
    }
    handle6KState = () => {
        if (!this.isAnimeComplete()) return;
        this.changeState(FighterState.IDLE);
    }
    handle4KState = () => {
        if (!this.isAnimeComplete()) return;
        this.changeState(FighterState.IDLE);
    }

    handleIdleInit = () => {
        this.resetVelocities();
    }
    handleIdleState = () => {
        if (control.isUp(this.playerId))
            this.changeState(FighterState.JUMP_START);
        else if (control.isDown(this.playerId))
            this.changeState(FighterState.CROUCH_DOWN);
        else if (control.isBackward(this.playerId, this.direction))
            this.changeState(FighterState.WALK_BACKWARD);
        else if (control.isForward(this.playerId, this.direction))
            this.changeState(FighterState.WALK_FORWARD);
        else if (control.is5P(this.playerId))
            this.changeState(FighterState.FIVE_PUNCH);
        else if (control.is6P(this.playerId))
            this.changeState(FighterState.SIX_PUNCH);
        else if (control.is4P(this.playerId))
            this.changeState(FighterState.FOUR_PUNCH);
        else if (control.is5K(this.playerId))
            this.changeState(FighterState.FIVE_KICK);
        else if (control.is6K(this.playerId))
            this.changeState(FighterState.SIX_KICK);
        else if (control.is4K(this.playerId))
            this.changeState(FighterState.FOUR_KICK);

        const newDirection = this.getDirection();

        if (newDirection !== this.direction) {
            this.direction = newDirection;
            this.changeState(FighterState.IDLE_TURN);
        }
    }

    handleIdleTurnState = () => {
        this.handleIdleState();

        if (!this.isAnimeComplete()) return;
        this.changeState(FighterState.IDLE);
    }
    handleCrouchTurnState = () => {
        this.handleCrouchState();

        if (!this.isAnimeComplete()) return;
        this.changeState(FighterState.CROUCH);
    }

    handleWalkInit = () => {
        this.velocity.x = this.initialVelocity.x[this.currentState] ?? 0;
    }
    handleWalkForwardState = () => {
        if (!control.isForward(this.playerId, this.direction)) this.changeState(FighterState.IDLE);
        else if (control.isUp(this.playerId)) this.changeState(FighterState.JUMP_START);
        else if (control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN);

        if (control.is5P(this.playerId))
            this.changeState(FighterState.FIVE_PUNCH);
        else if (control.is6P(this.playerId))
            this.changeState(FighterState.SIX_PUNCH);
        else if (control.is4P(this.playerId))
            this.changeState(FighterState.FOUR_PUNCH);
        else if (control.is5K(this.playerId))
            this.changeState(FighterState.FIVE_KICK);
        else if (control.is6K(this.playerId))
            this.changeState(FighterState.SIX_KICK);
        else if (control.is4K(this.playerId))
            this.changeState(FighterState.FOUR_KICK);

        this.direction = this.getDirection();
    }
    handleWalkBackwardState = () => {
        if (!control.isBackward(this.playerId, this.direction)) this.changeState(FighterState.IDLE);
        else if (control.isUp(this.playerId)) this.changeState(FighterState.JUMP_START);
        else if (control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN);

        if (control.is5P(this.playerId))
            this.changeState(FighterState.FIVE_PUNCH);
        else if (control.is6P(this.playerId))
            this.changeState(FighterState.SIX_PUNCH);
        else if (control.is4P(this.playerId))
            this.changeState(FighterState.FOUR_PUNCH);
        else if (control.is5K(this.playerId))
            this.changeState(FighterState.FIVE_KICK);
        else if (control.is6K(this.playerId))
            this.changeState(FighterState.SIX_KICK);
        else if (control.is4K(this.playerId))
            this.changeState(FighterState.FOUR_KICK);

        this.direction = this.getDirection();
    }

    handleJumpStartInit = () => {
        this.resetVelocities();
    }
    handleJumpStartState = () => {
        if (this.isAnimeComplete()) {
            if (control.isBackward(this.playerId, this.direction)) {
                this.changeState(FighterState.JUMP_BACKWARD);
            } else if (control.isForward(this.playerId, this.direction)) {
                this.changeState(FighterState.JUMP_FORWARD);
            } else {
                this.changeState(FighterState.JUMP_NEUTRAL);
            }
        }
    }

    handleJumpLandInit = () => {
        this.resetVelocities();
    }
    handleJumpLandState = () => {
        if (this.animationFrame < 1) return;

        let newState = FighterState.IDLE;

        if (!control.isIdle(this.playerId)) {
            this.direction = this.getDirection();

            this.handleIdleState();
        } else {
            const newDirection = this.getDirection();

            if (newDirection !== this.direction) {
                this.direction = newDirection;
                newState = FighterState.IDLE_TURN;
            } else {
                if (!this.isAnimeComplete()) return;
            }
        }

        this.changeState(newState);
    }

    handleJumpInit = () => {
        this.velocity.y = this.initialVelocity.jump;
        this.handleWalkInit();
    }
    handleJumpState = (time) => {
        this.velocity.y += this.gravity + time.secondsPassed;

        if (this.position.y > STAGE_FLOOR) {
            this.position.y = STAGE_FLOOR;
            this.changeState(FighterState.JUMP_LAND);
        }
    }

    handleCrouchState = () => {
        if (!control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_RISE);

        const newDirection = this.getDirection();

        if (newDirection !== this.direction) {
            this.direction = newDirection;
            this.changeState(FighterState.CROUCH_TURN)
        }
    }
    handleCrouchDownInit = () => {
        this.resetVelocities(); //velocities to 0
    }
    handleCrouchDownState = () => {
        if (this.isAnimeComplete()) {
            this.changeState(FighterState.CROUCH);
        }

        if (!control.isDown(this.playerId)) {
            this.currentState = FighterState.CROUCH_RISE;
            this.animationFrame = this.animations[FighterState.CROUCH_RISE][this.animationFrame].length - this.animationFrame;
        }
    }
    handleCrouchRiseInit = () => {

    }
    handleCrouchRiseState = () => {
        if (this.isAnimeComplete()) {
            this.changeState(FighterState.IDLE);
        }
    }

    hasCollidedWithOpp = () => boxOverlap(
        this.position.x + this.boxes.push.x,
        this.position.y + this.boxes.push.y,
        this.boxes.push.width, this.boxes.push.height,
        this.opponent.position.x + this.opponent.boxes.push.x,
        this.opponent.position.y + this.opponent.boxes.push.y,
        this.opponent.boxes.push.width, this.opponent.boxes.push.height,
    )

    updateStageConstraints(time, context, camera) {
        if (this.position.x > camera.position.x + context.canvas.width - this.boxes.push.width) {
            this.position.x = camera.position.x + context.canvas.width - this.boxes.push.width;
        }

        if (this.position.x < camera.position.x + this.boxes.push.width) {
            this.position.x = camera.position.x + this.boxes.push.width;
        }

        if (this.hasCollidedWithOpp()) {
            if (this.position.x <= this.opponent.position.x) {
                this.position.x = Math.max(
                    (this.opponent.position.x + this.opponent.boxes.push.x) - (this.boxes.push.x + this.boxes.push.width),
                    camera.position.x + this.boxes.push.width,
                );

                if (pushableStates.includes(this.opponent.currentState)) {
                    this.opponent.position.x += PUSH_FRICTION * time.secondsPassed;
                }
            }

            if (this.position.x >= this.opponent.position.x) {
                this.position.x = Math.min(
                    (this.opponent.position.x + this.opponent.boxes.push.x + this.opponent.boxes.push.width)
                    + (this.boxes.push.width + this.boxes.push.x),
                    camera.position.x + context.canvas.width - this.boxes.push.width,
                );

                if (pushableStates.includes(this.opponent.currentState)) {
                    this.opponent.position.x -= PUSH_FRICTION * time.secondsPassed;
                }
            }
        }
    }

    updateAnimation(time) {
        const animation = this.animations[this.currentState];
        const [, frameDelay] = animation[this.animationFrame];

        if (time.previous <= this.animationTimer + frameDelay * FRAME_TIME) return;
        this.animationTimer = time.previous;

        if (frameDelay <= FrameDelay.FREEZE) return;
        this.animationFrame++;

        if (this.animationFrame >= animation.length) {
            this.animationFrame = 0;
        }
        this.boxes = this.getBoxes(animation[this.animationFrame][0]);

    }

    updateAttackBoxCollided(time) {
        if (!this.states[this.currentState].attackType) return;


        const actualHitBox = getActualBoxDimensions(this.position, this.direction, this.boxes.hit);

        for (const hurt of this.opponent.boxes.hurt) {
            const [x, y, width, height] = hurt;
            const actualOpponentHurtBox = getActualBoxDimensions(
                this.opponent.position,
                this.opponent.direction,
                { x, y, width, height },
            );

            if (!boxOverlapHelp(actualHitBox, actualOpponentHurtBox)) return;

            const hurtIndex = this.opponent.boxes.hurt.indexOf(hurt);
            const hurtName = ['head', 'body', 'legs']

            console.log(`hit ${hurtName[hurtIndex]}`)
        }
    }

    update(time, context, camera) {
        this.position.x += (this.velocity.x * this.direction) * time.secondsPassed;
        this.position.y += this.velocity.y * time.secondsPassed;

        this.states[this.currentState].update(time, context);
        this.updateAnimation(time);
        this.updateStageConstraints(time, context, camera);
        this.updateAttackBoxCollided(time);
    }

    drawDebugBox(context, camera, dimensions, baseColor) {
        if (!Array.isArray(dimensions)) return;

        const [x = 0, y = 0, width = 0, height = 0] = dimensions;

        context.beginPath();
        context.strokeStyle = baseColor + 'AA';
        context.fillStyle = baseColor + '44';
        context.fillRect(
            Math.floor(this.position.x + (x * this.direction) - camera.position.x) + 0.5,
            Math.floor(this.position.y + y - camera.position.y) + 0.5,
            width * this.direction,
            height,
        );
        context.rect(
            Math.floor(this.position.x + (x * this.direction) - camera.position.x) + 0.5,
            Math.floor(this.position.y + y - camera.position.y) + 0.5,
            width * this.direction,
            height,
        );
        context.stroke();
    }

    drawDebug(context, camera) {
        const [frameKey] = this.animations[this.currentState][this.animationFrame];
        const boxes = this.getBoxes(frameKey);

        context.lineWidth = 1;

        //Push Boxes
        this.drawDebugBox(context, camera, Object.values(boxes.push), '#55FF55');
        //Hurt Boxes
        for (const hurtBox of boxes.hurt) {
            this.drawDebugBox(context, camera, hurtBox, '#7777FF');
        }
        //Hit Box
        this.drawDebugBox(context, camera, Object.values(boxes.hit), '#FF0000');

        //Origin X
        context.beginPath();
        context.strokeStyle = 'white';
        context.moveTo(Math.floor(this.position.x - camera.position.x) - 4, Math.floor(this.position.y - camera.position.y) - 0.5);
        context.lineTo(Math.floor(this.position.x - camera.position.x) + 5, Math.floor(this.position.y - camera.position.y) - 0.5);
        context.moveTo(Math.floor(this.position.x - camera.position.x) + 0.5, Math.floor(this.position.y - camera.position.y) - 5);
        context.lineTo(Math.floor(this.position.x - camera.position.x) + 0.5, Math.floor(this.position.y - camera.position.y) + 4);
        context.stroke();
    }

    draw(context, camera) {
        const [frameKey] = this.animations[this.currentState][this.animationFrame];
        const [[
            [x, y, width, height],
            [originX, originY],
        ]] = this.frames.get(frameKey);

        context.scale(this.direction, 1);
        context.drawImage(
            this.image,
            x, y,
            width, height,
            Math.floor((this.position.x - camera.position.x) * this.direction) - originX,
            Math.floor(this.position.y - camera.position.y) - originY,
            width, height
        );
        context.setTransform(1, 0, 0, 1, 0, 0);

        this.drawDebug(context, camera);
    }
}
