import { FighterDirection, FighterState, FrameDelay, PUSH_FRICTION } from "../../constants/fighter.js";
import { STAGE_FLOOR } from "../../constants/stage.js";
import * as control from "../../InputHandler.js";
import { boxOverlap } from "../../util/collision.js";

const pushableStates = [
    FighterState.IDLE, FighterState.CROUCH, FighterState.JUMP_NEUTRAL,
    FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
]

export class Fighter {
    constructor(name, x, y, direction, playerId) {
        this.name = name;
        this.playerId = playerId;
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.initialVelocity = {};
        this.direction = direction;
        this.gravity = 0;

        this.frames = new Map();
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animations = {};

        this.image = new Image();

        this.opponent;

        this.pushBox = { x: 0, y: 0, width: 0, height: 0 };

        this.states = {
            [FighterState.IDLE]: {
                init: this.handleIdleInit,
                update: this.handleIdleState,
                validFrom: [
                    undefined,
                    FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD,
                    FighterState.JUMP_NEUTRAL, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
                    FighterState.CROUCH_RISE, FighterState.JUMP_LAND, FighterState.IDLE_TURN
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
                init: () => {},
                update: this.handleIdleTurnState,
                validFrom: [
                    FighterState.IDLE, FighterState.JUMP_LAND,
                    FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD
                ],
            },
            [FighterState.CROUCH_TURN]: {
                init: () => {},
                update: this.handleCrouchTurnState,
                validFrom: [
                    FighterState.CROUCH
                ],
            },
        }

        this.changeState(FighterState.IDLE);
    }

    isAnimeComplete = () => this.animations[this.currentState][this.animationFrame][1] === FrameDelay.TRANSITION;

    resetVelocities() {
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    getDirection = () => {
        if (this.position.x + this.pushBox.x + this.pushBox.width <= this.opponent.position.x + this.opponent.pushBox.x){
            return FighterDirection.RIGHT;
        } else if (this.position.x + this.pushBox.x >= this.opponent.position.x + this.opponent.pushBox.x + this.opponent.pushBox.width) {
            return FighterDirection.LEFT;
        }

        return this.direction;
    }
    getPushBox(frameKey) {
        const [, [x, y, width, height] = [0,0,0,0]] = this.frames.get(frameKey);

        return { x, y, width, height };
    }

    changeState = (newState) => {
        if (newState === this.currentState
            || !this.states[newState].validFrom.includes(this.currentState)) return;

        this.currentState = newState;
        this.animationFrame = 0;

        this.states[this.currentState].init()

    }

    handleIdleInit = () => {
        this.resetVelocities();
    }
    handleIdleState = () => {
        if (control.isUp(this.playerId)) this.changeState(FighterState.JUMP_START);
        else if (control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN);
        else if (control.isBackward(this.playerId, this.direction)) this.changeState(FighterState.WALK_BACKWARD);
        else if (control.isForward(this.playerId, this.direction)) this.changeState(FighterState.WALK_FORWARD);

        const newDirection = this.getDirection();

        if(newDirection !== this.direction) {
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
    
        this.direction = this.getDirection();
    }
    handleWalkBackwardState = () => {
        if (!control.isBackward(this.playerId, this.direction)) this.changeState(FighterState.IDLE);
        else if (control.isUp(this.playerId)) this.changeState(FighterState.JUMP_START);
        else if (control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN);
    
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
        } else{
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

        if(newDirection !== this.direction) {
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
        this.position.x + this.pushBox.x,
        this.position.y + this.pushBox.y,
        this.pushBox.width, this.pushBox.height,
        this.opponent.position.x + this.opponent.pushBox.x,
        this.opponent.position.y + this.opponent.pushBox.y,
        this.opponent.pushBox.width, this.opponent.pushBox.height,
    )

    updateStageConstraints(time, context) {
        if (this.position.x > context.canvas.width - this.pushBox.width) {
            this.position.x = context.canvas.width - this.pushBox.width;
        }

        if (this.position.x < this.pushBox.width) {
            this.position.x = this.pushBox.width;
        }

        if (this.hasCollidedWithOpp()) {
            if (this.position.x <= this.opponent.position.x) {
                this.position.x = Math.max(
                    (this.opponent.position.x + this.opponent.pushBox.x) - (this.pushBox.x + this.pushBox.width),
                    this.pushBox.width,
                );

                if (pushableStates.includes(this.opponent.currentState)) {
                    this.opponent.position.x += PUSH_FRICTION * time.secondsPassed;
                }
            }

            if (this.position.x >= this.opponent.position.x) {
                this.position.x = Math.min(
                    (this.opponent.position.x + this.opponent.pushBox.x + this.opponent.pushBox.width)
                    + (this.pushBox.width + this.pushBox.x),
                    context.canvas.width - this.pushBox.width,
                );

                if (pushableStates.includes(this.opponent.currentState)) {
                    this.opponent.position.x -= PUSH_FRICTION * time.secondsPassed;
                }
            }
        }
    }

    updateAnimation(time) {
        const animation = this.animations[this.currentState];
        const [frameKey, frameDelay] = animation[this.animationFrame];

        if (time.previous > this.animationTimer + frameDelay) {
            this.animationTimer = time.previous;

            if (frameDelay > FrameDelay.FREEZE) {
                this.animationFrame++;
                this.pushBox = this.getPushBox(frameKey);
            }

            if (this.animationFrame >= animation.length) {
                this.animationFrame = 0;
            }
        }
    }

    update(time, context) {
        this.position.x += (this.velocity.x * this.direction) * time.secondsPassed;
        this.position.y += this.velocity.y * time.secondsPassed;

        this.states[this.currentState].update(time, context);
        this.updateAnimation(time);
        this.updateStageConstraints(time, context);
    }

    drawDebug(context) {
        const [frameKey] = this.animations[this.currentState][this.animationFrame];
        const pushBox = this.getPushBox(frameKey);

        context.lineWidth = 1;

        //Push Box
        context.beginPath();
        context.strokeStyle = '#55FF55';
        context.fillStyle = '#55FF5555';
        context.fillRect(
            Math.floor(this.position.x + pushBox.x) + 0.5,
            Math.floor(this.position.y + pushBox.y) + 0.5,
            pushBox.width,
            pushBox.height,
        );
        context.rect(
            Math.floor(this.position.x + pushBox.x) + 0.5,
            Math.floor(this.position.y + pushBox.y) + 0.5,
            pushBox.width,
            pushBox.height,
        );
        context.stroke();

        //Origin X
        context.beginPath();
        context.strokeStyle = 'white';
        context.moveTo(Math.floor(this.position.x) - 4, Math.floor(this.position.y) - 0.5);
        context.lineTo(Math.floor(this.position.x) + 5, Math.floor(this.position.y) - 0.5);
        context.moveTo(Math.floor(this.position.x) + 0.5, Math.floor(this.position.y) - 5);
        context.lineTo(Math.floor(this.position.x) + 0.5, Math.floor(this.position.y) + 4);
        context.stroke();
    }

    draw(context) {
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
            Math.floor(this.position.x * this.direction) - originX, Math.floor(this.position.y) - originY,
            width, height
        );
        context.setTransform(1, 0, 0, 1, 0, 0);

        this.drawDebug(context);
    }
}
