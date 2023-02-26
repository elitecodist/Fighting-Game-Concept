import { FighterState } from "../../constants/fighter.js";
import { STAGE_FLOOR } from "../../constants/stage.js";
import * as control from "../../InputHandler.js";

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

        this.states = {
            [FighterState.IDLE]: {
                init: this.handleIdleInit,
                update: this.handleIdleState,
                validFrom: [
                    undefined,
                    FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD,
                    FighterState.JUMP_NEUTRAL, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
                    FighterState.CROUCH_RISE
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
            [FighterState.JUMP_NEUTRAL]: {
                init: this.handleJumpInit,
                update: this.handleJumpState,
                validFrom: [
                    FighterState.IDLE
                ],
            },
            [FighterState.JUMP_FORWARD]: {
                init: this.handleJumpInit,
                update: this.handleJumpState,
                validFrom: [
                    FighterState.IDLE, FighterState.WALK_FORWARD,
                ],
            },
            [FighterState.JUMP_BACKWARD]: {
                init: this.handleJumpInit,
                update: this.handleJumpState,
                validFrom: [
                    FighterState.IDLE, FighterState.WALK_BACKWARD,
                ],
            },
            [FighterState.CROUCH]: {
                init: () => {},
                update: this.handleCrouchState,
                validFrom: [
                    FighterState.CROUCH_DOWN
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
        }

        this.changeState(FighterState.IDLE);
    }

    changeState = (newState) => {
        if (newState === this.currentState
            || !this.states[newState].validFrom.includes(this.currentState)) return;

        this.currentState = newState;
        this.animationFrame = 0;

        this.states[this.currentState].init()
    
    }

    handleIdleInit = () => {
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
    handleIdleState = () => {
        if (control.isUp(this.playerId)) this.changeState(FighterState.JUMP_NEUTRAL);
        if (control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN);
        if (control.isBackward(this.playerId, this.direction)) this.changeState(FighterState.WALK_BACKWARD);
        if (control.isForward(this.playerId, this.direction)) this.changeState(FighterState.WALK_FORWARD);
    }

    handleWalkInit = () => {
        this.velocity.x = this.initialVelocity.x[this.currentState] ?? 0;
    }
    handleWalkForwardState = () => {
        if (!control.isForward(this.playerId, this.direction)) this.changeState(FighterState.IDLE);
        if (control.isUp(this.playerId)) this.changeState(FighterState.JUMP_FORWARD);
        if (control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN);
    }
    handleWalkBackwardState = () => {
        if (!control.isBackward(this.playerId, this.direction)) this.changeState(FighterState.IDLE);
        if (control.isUp(this.playerId)) this.changeState(FighterState.JUMP_BACKWARD);
        if (control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN);
    }

    handleJumpInit = () => {
        this.velocity.y = this.initialVelocity.jump;
        this.handleWalkInit();
    }
    handleJumpState = (time) => {
        this.velocity.y += this.gravity + time.secondsPassed;

        if (this.position.y > STAGE_FLOOR) {
            this.position.y = STAGE_FLOOR;
            this.changeState(FighterState.IDLE);
        }
    }

    handleCrouchState = () => {
        if (!control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_RISE);
    }
    handleCrouchDownInit = () => {
        this.handleIdleInit(); //velocities to 0
    }
    handleCrouchDownState = () => {
        if (this.animations[this.currentState][this.animationFrame][1] === -2){
            this.changeState(FighterState.CROUCH);
        }
    }
    handleCrouchRiseInit = () => {

    }
    handleCrouchRiseState = () => {
        if (this.animations[this.currentState][this.animationFrame][1] === -2){
            this.changeState(FighterState.IDLE);
        }
    }

    updateStageConstraints(context) {
        const WIDTH = 32;

        if (this.position.x > context.canvas.width - WIDTH){
            this.position.x = context.canvas.width - WIDTH;
        }

        if (this.position.x < WIDTH) {
            this.position.x = WIDTH;
        }
    }

    updateAnimation(time) {
        const animation = this.animations[this.currentState];
        const [, frameDelay] = animation[this.animationFrame];

        if (time.previous > this.animationTimer + frameDelay){
            this.animationTimer = time.previous;

            if (frameDelay > 0) {
                this.animationFrame++;
            }
            if (this.animationFrame >= animation.length) {
                this.animationFrame = 0;
            }
        }
    }

    update(time, context){
        this.position.x += (this.velocity.x * this.direction) * time.secondsPassed;
        this.position.y += this.velocity.y * time.secondsPassed;

        this.states[this.currentState].update(time, context);
        this.updateAnimation(time);
        this.updateStageConstraints(context);
    }

    drawDebug(context) {
        context.lineWidth = 1;

        context.beginPath();
        context.strokeStyle = 'white';
        context.moveTo(Math.floor(this.position.x) - 5.5, Math.floor(this.position.y));
        context.lineTo(Math.floor(this.position.x) + 4.5, Math.floor(this.position.y));
        context.moveTo(Math.floor(this.position.x), Math.floor(this.position.y) - 5.5);
        context.lineTo(Math.floor(this.position.x), Math.floor(this.position.y) + 4.5);
        context.stroke();
    }

    draw(context) {
        const [frameKey] = this.animations[this.currentState][this.animationFrame];
        const [
            [x, y, width, height],
            [originX, originY], 
        ] = this.frames.get(frameKey);

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