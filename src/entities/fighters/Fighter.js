import { Control } from "../../constants/control.js";
import { shuffle } from "../../util/helpers.js";
import {
    FighterDirection, FighterState,
    FIGHTER_START_DISTANCE, FrameDelay,
    PUSH_FRICTION, FighterAttackType, FighterAttackStrength, FighterHurtBox, hurtStateValidFrom, FIGHTER_HURT_DELAY, FighterAttackBaseData,
} from "../../constants/fighter.js";
import { FRAME_TIME } from "../../constants/game.js";
import { STAGE_FLOOR, STAGE_MID_POINT, STAGE_PADDING } from "../../constants/stage.js";
import * as control from "../../engine/inputHandler.js";
import { boxOverlap, boxOverlapHelp, getActualBoxDimensions } from "../../util/collision.js";
import { gameState } from "../../state/gameState.js";
import { VOLUME } from "../../constants/settings.js";
import { playSound } from "../../engine/soundHandler.js";
import * as DEBUG from '../../util/fighterDebug.js';

const pushableStates = [
    FighterState.IDLE, FighterState.CROUCH, FighterState.JUMP_NEUTRAL,
    FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
]

export class Fighter {
    soundAttacks = {
        [FighterAttackStrength.LIGHT]: document.querySelector('audio#light-attack'),
        [FighterAttackStrength.MEDIUM]: document.querySelector('audio#medium-attack'),
        [FighterAttackStrength.HEAVY]: document.querySelector('audio#heavy-attack'),
    };
    soundHits = {
        [FighterAttackStrength.LIGHT]: {
            [FighterAttackType.RED]: document.querySelector('audio#light-hit'),
            [FighterAttackType.GREEN]: document.querySelector('audio#light-hit'),
        },
        [FighterAttackStrength.MEDIUM]: {
            [FighterAttackType.RED]: document.querySelector('audio#medium-hit'),
            [FighterAttackType.GREEN]: document.querySelector('audio#medium-hit'),
        },
        [FighterAttackStrength.HEAVY]: {
            [FighterAttackType.RED]: document.querySelector('audio#heavy-hit'),
            [FighterAttackType.GREEN]: document.querySelector('audio#heavy-hit'),
        },

    };


    constructor(playerId, onAttHit) {
        this.frames = new Map();
        this.image = new Image();

        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animations = {};

        this.velocity = { x: 0, y: 0 };
        this.initialVelocity = {};
        this.direction = playerId === 0 ? FighterDirection.RIGHT : FighterDirection.LEFT;
        this.gravity = 0;

        this.attackStruck = false;

        this.playerId = playerId;
        this.position = {
            x: STAGE_MID_POINT + STAGE_PADDING + (playerId === 0 ? -FIGHTER_START_DISTANCE : FIGHTER_START_DISTANCE),
            y: STAGE_FLOOR
        };

        this.hurtShake = 0;
        this.hurtShakeTimer = 0;
        this.slideVelocity = 0;
        this.slideFriction = 0;

        this.currentState = FighterState.IDLE;
        this.hand = [];
        this.handPos = 2;
        this.activeCard = undefined;
        this.sleight = [];
        this.discard = [];

        this.opponent = undefined;
        this.onAttHit = onAttHit;

        this.boxes = {
            push: { x: 0, y: 0, width: 0, height: 0 },
            hit: { x: 0, y: 0, width: 0, height: 0 },
            hurt: {
                [FighterHurtBox.HEAD]: [0, 0, 0, 0],
                [FighterHurtBox.BODY]: [0, 0, 0, 0],
                [FighterHurtBox.LEGS]: [0, 0, 0, 0],
            }
        }


        this.states = {
            [FighterState.IDLE]: {
                init: this.handleIdleInit,
                update: this.handleIdleState,
                validFrom: [
                    FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD,
                    FighterState.JUMP_NEUTRAL, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
                    FighterState.CROUCH_RISE, FighterState.JUMP_LAND, FighterState.IDLE_TURN,
                    FighterState.FIVE_PUNCH, FighterState.SIX_PUNCH, FighterState.FOUR_PUNCH,
                    FighterState.FIVE_KICK, FighterState.SIX_KICK, FighterState.FOUR_KICK,
                    FighterState.HURT_HEAD_LIGHT, FighterState.HURT_HEAD_MEDIUM, FighterState.HURT_HEAD_HEAVY,
                    FighterState.HURT_BODY_LIGHT, FighterState.HURT_BODY_MEDIUM, FighterState.HURT_BODY_HEAVY
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
                attackStrength: FighterAttackStrength.LIGHT,
                init: this.handleAttInit,
                update: this.handle5PState,
                validFrom: [
                    FighterState.IDLE,
                    FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD,
                ]
            },
            [FighterState.SIX_PUNCH]: {
                attackType: FighterAttackType.RED,
                attackStrength: FighterAttackStrength.MEDIUM,
                init: this.handleAttInit,
                update: this.handle6PState,
                validFrom: [
                    FighterState.IDLE,
                    FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD,
                ]
            },
            [FighterState.FOUR_PUNCH]: {
                attackType: FighterAttackType.RED,
                attackStrength: FighterAttackStrength.HEAVY,
                init: this.handleAttInit,
                update: this.handle4PState,
                validFrom: [
                    FighterState.IDLE,
                    FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD
                ]
            },
            [FighterState.FIVE_KICK]: {
                attackType: FighterAttackType.GREEN,
                attackStrength: FighterAttackStrength.LIGHT,
                init: this.handleAttInit,
                update: this.handle5KState,
                validFrom: [
                    FighterState.IDLE,
                    FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD
                ]
            },
            [FighterState.SIX_KICK]: {
                attackType: FighterAttackType.GREEN,
                attackStrength: FighterAttackStrength.MEDIUM,
                init: this.handleAttInit,
                update: this.handle6KState,
                validFrom: [
                    FighterState.IDLE,
                    FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD
                ]
            },
            [FighterState.FOUR_KICK]: {
                attackType: FighterAttackType.GREEN,
                attackStrength: FighterAttackStrength.HEAVY,
                init: this.handleAttInit,
                update: this.handle4KState,
                validFrom: [
                    FighterState.IDLE,
                    FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD
                ]
            },
            [FighterState.HURT_HEAD_LIGHT]: {
                init: this.handleHurtInit,
                update: this.handleHurtState,
                validFrom: hurtStateValidFrom
            },
            [FighterState.HURT_HEAD_MEDIUM]: {
                init: this.handleHurtInit,
                update: this.handleHurtState,
                validFrom: hurtStateValidFrom
            },
            [FighterState.HURT_HEAD_HEAVY]: {
                init: this.handleHurtInit,
                update: this.handleHurtState,
                validFrom: hurtStateValidFrom
            },
            [FighterState.HURT_BODY_LIGHT]: {
                init: this.handleHurtInit,
                update: this.handleHurtState,
                validFrom: hurtStateValidFrom
            },
            [FighterState.HURT_BODY_MEDIUM]: {
                init: this.handleHurtInit,
                update: this.handleHurtState,
                validFrom: hurtStateValidFrom
            },
            [FighterState.HURT_BODY_HEAVY]: {
                init: this.handleHurtInit,
                update: this.handleHurtState,
                validFrom: hurtStateValidFrom
            },
        }
    }

    isAnimeComplete = () => this.animations[this.currentState][this.animationFrame][1] === FrameDelay.TRANSITION;

    resetVelocities() {
        this.velocity = { x: 0, y: 0 };
    }
    resetSlide(transferToOpp = false) {
        if (transferToOpp) {
            this.opponent.slideVelocity = this.slideVelocity;
            this.opponent.slideFriction = this.slideFriction;
        }
        this.slideFriction = 0;
        this.slideVelocity = 0;
    }

    expendCard(type) {
        switch (type) {
            case 'play':
                this.discard.push(this.activeCard);
                this.hand.splice(this.handPos, 1);
                if (this.handPos >= this.hand.length) this.handPos = 0;
                break;
            case 'sleight':
                if (this.activeCard === 'drawC' || this.activeCard === 'shuffleC') return;
                else {
                    this.handleSleight();
                }
                break;
        }
    }

    drawCard() {
        this.hand.splice(0, 2);
        this.discard = this.discard.concat(this.hand)
        this.hand = this.deck.slice(0, 10);
        this.deck.splice(0, 10);
        this.hand.unshift('shuffleC', 'drawC');
        this.handPos = 2;
    }

    shuffleCard() {
        this.hand.splice(0, 2);
        this.deck = this.deck.concat(this.discard, this.hand);
        this.discard = [];
        this.deck = shuffle(this.deck);
        this.hand = this.deck.slice(0, 10);
        this.deck.splice(0, 10);
        this.hand.unshift('shuffleC', 'drawC');
        this.handPos = 2;
    }

    handleSleight() {
        switch (this.sleight.length) {
            case 3:
                console.log('sleight full');
                break;
            default:
                this.sleight.push(this.activeCard);
                this.hand.splice(this.handPos, 1);
                if (this.handPos >= this.hand.length) this.handPos = 0;
        }
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
            hit: { x: hitX, y: hitY, width: hitWidth, height: hitHeight },
            hurt: {
                [FighterHurtBox.HEAD]: head,
                [FighterHurtBox.BODY]: body,
                [FighterHurtBox.LEGS]: legs,
            }
        }
    }

    getHurtState(attStrength, hitLocation) {
        switch (attStrength) {
            case FighterAttackStrength.LIGHT:
                if (hitLocation === FighterHurtBox.HEAD) return FighterState.HURT_HEAD_LIGHT;
                return FighterState.HURT_BODY_LIGHT;
            case FighterAttackStrength.MEDIUM:
                if (hitLocation === FighterHurtBox.HEAD) return FighterState.HURT_HEAD_MEDIUM;
                return FighterState.HURT_BODY_MEDIUM;
            case FighterAttackStrength.HEAVY:
                if (hitLocation === FighterHurtBox.HEAD) return FighterState.HURT_HEAD_HEAVY;
                return FighterState.HURT_BODY_HEAVY;
        }
    }

    setAnimationFrame(frame, time) {
        const animation = this.animations[this.currentState];

        this.animationFrame = frame;
        if (this.animationFrame >= animation.length) this.animationFrame = 0;

        const [frameKey, frameDelay] = animation[this.animationFrame];
        this.boxes = this.getBoxes(frameKey);
        this.animationTimer = time.previous + frameDelay * FRAME_TIME;
    }

    changeState = (newState, time) => {
        if (newState === this.currentState
            || !this.states[newState].validFrom.includes(this.currentState)) {
            console.warn(`illegal transition from ${this.currentState} to ${newState}`);
            return;
        }

        this.currentState = newState;
        this.setAnimationFrame(0, time);

        this.states[this.currentState].init(time);

    }

    handleAttInit = () => {
        this.resetVelocities();
        playSound(this.soundAttacks[this.states[this.currentState].attackStrength], VOLUME);
    }

    handleHurtInit = (time) => {
        this.resetVelocities();
        this.hurtShake = 2;
        this.hurtShakeTimer = time.previous + FRAME_TIME;
    }
    handleHurtState = (time) => {
        if (!this.isAnimeComplete()) return;
        this.hurtShake = 0;
        this.hurtShakeTimer = 0;
        this.changeState(FighterState.IDLE, time);
    }

    // handleLightAttReset(time) {
    //     this.setAnimationFrame(0, time);
    //     this.handleAttInit();
    //     this.attackStruck = false;
    // }

    handle5PState = (time) => {
        if (!this.isAnimeComplete()) return;
        this.changeState(FighterState.IDLE, time);
    }
    handle6PState = (time) => {
        if (!this.isAnimeComplete()) return;
        this.changeState(FighterState.IDLE, time);
    }
    handle4PState = (time) => {
        if (!this.isAnimeComplete()) return;
        this.changeState(FighterState.IDLE, time);
    }
    handle5KState = (time) => {
        if (!this.isAnimeComplete()) return;
        this.changeState(FighterState.IDLE, time);
    }
    handle6KState = (time) => {
        if (!this.isAnimeComplete()) return;
        this.changeState(FighterState.IDLE, time);
    }
    handle4KState = (time) => {
        if (!this.isAnimeComplete()) return;
        this.changeState(FighterState.IDLE, time);
    }

    handleIdleInit = () => {
        this.resetVelocities();
        this.attackStruck = false;
    }
    handleIdleState = (time) => {
        if (control.isUp(this.playerId))
            this.changeState(FighterState.JUMP_START, time);
        else if (control.isDown(this.playerId))
            this.changeState(FighterState.CROUCH_DOWN, time);
        else if (control.isBackward(this.playerId, this.direction)) {
            this.changeState(FighterState.WALK_BACKWARD, time);
        }
        else if (control.isForward(this.playerId, this.direction)) {
            this.changeState(FighterState.WALK_FORWARD, time);
        }
        else if (control.isAccept(this.playerId)) {
            switch (this.activeCard) {
                case 'redC':
                    this.changeState(FighterState.FIVE_PUNCH, time);
                    this.expendCard('play');
                    break;
                case 'greenC':
                    this.changeState(FighterState.FIVE_KICK, time);
                    this.expendCard('play');
                    break;
                case 'blueC':
                    this.changeState(FighterState.BLUE_1, time);
                    this.expendCard('play');
                    break;
                case 'drawC':
                    this.drawCard();
                    break;
                case 'shuffleC':
                    this.shuffleCard();
                    break;
            }
        }
        else if (control.isSleight(this.playerId)) {
            this.expendCard('sleight');
        }

        const newDirection = this.getDirection();

        if (newDirection !== this.direction) {
            this.direction = newDirection;
            this.changeState(FighterState.IDLE_TURN, time);
        }
    }

    handleWalkForwardState = (time) => {
        if (!control.isForward(this.playerId, this.direction)) this.changeState(FighterState.IDLE, time);
        else if (control.isUp(this.playerId)) this.changeState(FighterState.JUMP_START, time);
        else if (control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN, time);

        if (control.isAccept(this.playerId)) {
            switch (this.activeCard) {
                case 'redC':
                    this.changeState(FighterState.SIX_PUNCH, time);
                    this.expendCard('play');
                    break;
                case 'greenC':
                    this.changeState(FighterState.SIX_KICK, time);
                    this.expendCard('play');
                    break;
                case 'drawC':
                    this.drawCard();
                    break;
                case 'shuffleC':
                    this.shuffleCard();
                    break;
            }
        }
        else if (control.isSleight(this.playerId)) {
            this.expendCard('sleight');
        }
        // else if (control.is6P(this.playerId))
        //     this.changeState(FighterState.SIX_PUNCH, time);
        // else if (control.is4P(this.playerId))
        //     this.changeState(FighterState.FOUR_PUNCH, time);
        // else if (control.is5K(this.playerId))
        //     this.changeState(FighterState.FIVE_KICK, time);
        // else if (control.is6K(this.playerId))
        //     this.changeState(FighterState.SIX_KICK, time);
        // else if (control.is4K(this.playerId))
        //     this.changeState(FighterState.FOUR_KICK, time);

        this.direction = this.getDirection();
    }
    handleWalkBackwardState = (time) => {
        if (!control.isBackward(this.playerId, this.direction)) this.changeState(FighterState.IDLE, time);
        else if (control.isUp(this.playerId)) this.changeState(FighterState.JUMP_START, time);
        else if (control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN, time);

        if (control.isAccept(this.playerId)) {
            switch (this.activeCard) {
                case 'redC':
                    this.changeState(FighterState.FOUR_PUNCH, time);
                    this.expendCard('play');
                    break;
                case 'greenC':
                    this.changeState(FighterState.FOUR_KICK, time);
                    this.expendCard('play');
                    break;
                case 'drawC':
                    this.drawCard();
                    break;
                case 'shuffleC':
                    this.shuffleCard();
                    break;
            }
        }
        else if (control.isSleight(this.playerId)) {
            this.expendCard('sleight');
        }
        // else if (control.is6P(this.playerId))
        //     this.changeState(FighterState.SIX_PUNCH, time);
        // else if (control.is4P(this.playerId))
        //     this.changeState(FighterState.FOUR_PUNCH, time);
        // else if (control.is5K(this.playerId))
        //     this.changeState(FighterState.FIVE_KICK, time);
        // else if (control.is6K(this.playerId))
        //     this.changeState(FighterState.SIX_KICK, time);
        // else if (control.is4K(this.playerId))
        //     this.changeState(FighterState.FOUR_KICK, time);

        this.direction = this.getDirection();
    }

    handleIdleTurnState = (time) => {
        this.handleIdleState();

        if (!this.isAnimeComplete()) return;
        this.changeState(FighterState.IDLE, time);
    }
    handleCrouchTurnState = (time) => {
        this.handleCrouchState();

        if (!this.isAnimeComplete()) return;
        this.changeState(FighterState.CROUCH, time);
    }

    handleWalkInit = () => {
        this.velocity.x = this.initialVelocity.x[this.currentState] ?? 0;
    }

    handleJumpStartInit = () => {
        this.resetVelocities();
    }
    handleJumpStartState = (time) => {
        if (this.isAnimeComplete()) {
            if (control.isBackward(this.playerId, this.direction)) {
                this.changeState(FighterState.JUMP_BACKWARD, time);
            } else if (control.isForward(this.playerId, this.direction)) {
                this.changeState(FighterState.JUMP_FORWARD, time);
            } else {
                this.changeState(FighterState.JUMP_NEUTRAL, time);
            }
        }
    }

    handleJumpLandInit = () => {
        this.resetVelocities();
    }
    handleJumpLandState = (time) => {
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

        this.changeState(newState, time);
    }

    handleJumpInit = () => {
        this.velocity.y = this.initialVelocity.jump;
        this.handleWalkInit();
    }
    handleJumpState = (time) => {
        this.velocity.y += this.gravity + time.secondsPassed;

        if (this.position.y > STAGE_FLOOR) {
            this.position.y = STAGE_FLOOR;
            this.changeState(FighterState.JUMP_LAND, time);
        }
    }

    handleCrouchState = (time) => {
        if (!control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_RISE, time);

        const newDirection = this.getDirection();

        if (newDirection !== this.direction) {
            this.direction = newDirection;
            this.changeState(FighterState.CROUCH_TURN, time)
        }
    }
    handleCrouchDownInit = () => {
        this.resetVelocities(); //velocities to 0
    }
    handleCrouchDownState = (time) => {
        if (this.isAnimeComplete()) {
            this.changeState(FighterState.CROUCH, time);
        }

        if (!control.isDown(this.playerId)) {
            this.currentState = FighterState.CROUCH_RISE;
            this.setAnimationFrame(
                Math.max(0, this.animations[FighterState.CROUCH_RISE][this.animationFrame].length - this.animationFrame),
                time,
            );
        }
    }
    handleCrouchRiseInit = () => {

    }
    handleCrouchRiseState = (time) => {
        if (this.isAnimeComplete()) {
            this.changeState(FighterState.IDLE, time);
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
            this.resetSlide(true);
        }

        if (this.position.x < camera.position.x + this.boxes.push.width) {
            this.position.x = camera.position.x + this.boxes.push.width;
            this.resetSlide(true);
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

    handleAttHit(time, attStrength, hitLocation) {
        const newState = this.getHurtState(attStrength, hitLocation);
        const { velocity, friction } = FighterAttackBaseData[attStrength].slide;

        this.slideVelocity = velocity;
        this.slideFriction = friction;
        this.changeState(newState, time);

        DEBUG.logHit(this, attStrength, hitLocation);
    }

    updateAnime(time) {
        const animation = this.animations[this.currentState];
        if (animation[this.animationFrame][1] <= FrameDelay.FREEZE || time.previous <= this.animationTimer) return;

        this.setAnimationFrame(this.animationFrame + 1, time);
    }

    updateHitBoxCollided(time) {
        const { attackStrength, attackType } = this.states[this.currentState];

        if (!attackType || this.attackStruck) return;

        const actualHitBox = getActualBoxDimensions(this.position, this.direction, this.boxes.hit);

        for (const [hurtLocation, hurtBox] of Object.entries(this.opponent.boxes.hurt)) {
            const [x, y, width, height] = hurtBox;
            const actualOpponentHurtBox = getActualBoxDimensions(
                this.opponent.position,
                this.opponent.direction,
                { x, y, width, height },
            );

            if (!boxOverlapHelp(actualHitBox, actualOpponentHurtBox)) continue;

            playSound(this.soundHits[attackStrength][attackType], VOLUME);

            const hitPosition = {
                x: (actualHitBox.x + (actualHitBox.width / 2) + actualOpponentHurtBox.x + (actualOpponentHurtBox.width / 2)) / 2,
                y: (actualHitBox.y + (actualHitBox.height / 2) + actualOpponentHurtBox.y + (actualOpponentHurtBox.height / 2)) / 2,
            };
            hitPosition.x -= 4 - Math.random() * 8;
            hitPosition.y -= 4 - Math.random() * 8;

            this.onAttHit(
                time,
                this.playerId, this.opponent.playerId, hitPosition,
                this.states[this.currentState].attackStrength
            );
            this.opponent.handleAttHit(time, attackStrength, hurtLocation);
            this.attackStruck = true;
            return;

        }
    }

    updateHurtShake(time, delay) {
        if (this.hurtShakeTimer === 0 || time.previous <= this.hurtShakeTimer) return;

        const shakeAmount = (delay - time.previous < (FIGHTER_HURT_DELAY * FRAME_TIME) / 2 ? 1 : 2);

        this.hurtShake = shakeAmount - this.hurtShake;
        this.hurtShakeTimer = time.previous + FRAME_TIME
    }

    updateSlide(time) {
        if (this.slideVelocity >= 0) return;

        this.slideVelocity += this.slideFriction * time.secondsPassed;
        if (this.slideVelocity < 0) return;

        this.resetSlide();
    }

    updatePos(time) {
        this.position.x += ((this.velocity.x + this.slideVelocity) * this.direction) * time.secondsPassed;
        this.position.y += this.velocity.y * time.secondsPassed;
    }

    update(time, context, camera) {
        this.states[this.currentState].update(time, context);
        this.updateSlide(time);
        this.updatePos(time);
        this.updateAnime(time);
        this.updateStageConstraints(time, context, camera);
        this.updateHitBoxCollided(time);
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
            Math.floor((this.position.x - this.hurtShake - camera.position.x) * this.direction) - originX,
            Math.floor(this.position.y - camera.position.y) - originY,
            width, height
        );
        context.setTransform(1, 0, 0, 1, 0, 0);

        DEBUG.drawCollisionInfo(this, context, camera);
    }
}
