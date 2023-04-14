import { FighterAttackStrength, FighterAttackType, FighterHurtBox } from "../../../constants/fighter.js";
import { FireballCollideState, FireballState, fireballVelocity } from "../../../constants/fireball.js";
import { FRAME_TIME } from "../../../constants/game.js";
import { getActualBoxDimensions, boxOverlapHelp } from "../../../util/collision.js";
import * as DEBUG from '../../../util/fighterDebug.js';

const frames = new Map([
    ['fireball-1', [[[617, 2329, 56, 28], [37, 14]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],
    ['fireball-2', [[[681, 2327, 43, 32], [25, 16]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],
    ['fireball-3', [[[0, 0, 0, 0], [0, 0]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],

    ['fireball-collide-1', [[[786, 2306, 38, 40], [19, 20]], [0, 0, 0, 0]]],
    ['fireball-collide-2', [[[832, 2303, 50, 47], [26, 24]], [0, 0, 0, 0]]],
    ['fireball-collide-3', [[[890, 2301, 57, 51], [55, 26]], [0, 0, 0, 0]]],
]);

const animations = {
    [FireballState.ACTIVE]: [
        ['fireball-1', 2], ['fireball-3', 2],
        ['fireball-2', 2], ['fireball-3', 2],
    ],
    [FireballState.COLLIDE]: [
        ['fireball-collide-1', 9], ['fireball-collide-2', 5], ['fireball-collide-3', 9],
    ],
};

export class Fireball {
    image = document.querySelector('img[alt="ken"]');

    animationFrame = 0;
    state = FireballState.ACTIVE;

    boxes = {
        push: { x: -28, y: -20, width: 56, height: 38 },
        hit: { x: -15, y: -13, width: 30, height: 24 },
    }

    constructor(args, time, entityList) {
        const [fighter, strength] = args;
        this.fighter = fighter;
        this.entityList = entityList;
        this.velocity = fireballVelocity[strength];
        this.direction = this.fighter.direction;
        this.position = {
            x: this.fighter.position.x + (76 * this.direction),
            y: this.fighter.position.y - 57,
        };
        this.animationTimer = time.previous;
    }

    hasCollidedFB(hitBox) {
        const otherFireballs = this.entityList.entities.filter((fireball) => fireball instanceof Fireball && fireball !== this);
        if (otherFireballs.length === 0) return;

        for (const fireball of otherFireballs) {
            const [x, y, width, height] = frames.get(animations[fireball.state][fireball.animationFrame][0])[1];
            const otherActualHitBox = getActualBoxDimensions(fireball.position, fireball.direction, { x, y, width, height });

            if (boxOverlapHelp(hitbox, otherActualHitBox)) return FireballCollideState.FIREBALL;
        }
    }

    hasCollided() {
        const [x, y, width, height] = frames.get(animations[this.state][this.animationFrame][0])[1];
        const actualHitBox = getActualBoxDimensions(this.position, this.direction, { x, y, width, height });

        return this.hasCollidedOpp(actualHitBox) ?? this.hasCollidedFB(actualHitBox);
    }

    hasCollidedOpp(actualHitBox) {
        for (const [, hurtBox] of Object.entries(this.fighter.opponent.boxes.hurt)) {
            const [x, y, width, height] = hurtBox;
            const actualOpponentHurtBox = getActualBoxDimensions(
                this.fighter.opponent.position,
                this.fighter.opponent.direction,
                { x, y, width, height },
            );

            if (boxOverlapHelp(actualHitBox, actualOpponentHurtBox)) {
                return FireballCollideState.OPPONENT;
            }
        }

        return false;
    }

    updateMovement(time, camera) {
        if (this.state !== FireballState.ACTIVE) return;

        this.position.x += (this.velocity * this.direction) * time.secondsPassed;

        if (this.position.x - camera.position.x > 384 + 56 || this.position.x - camera.position.x < -56) {
            this.entityList.remove(this);
        }

        const hasCollided = this.hasCollided();
        if (!hasCollided) return;

        this.state = FireballState.COLLIDE;
        this.animationFrame = 0;
        this.animationTimer = time.previous + animations[this.state][this.animationFrame][1] * FRAME_TIME;
        
        if (hasCollided !== FireballCollideState.OPPONENT) return;
        
        this.fighter.opponent.handleAtkHit(time, FighterAttackStrength.LIGHT, FighterAttackType.RED, undefined, FighterHurtBox.HEAD)
    }

    updateAnimation(time) {
        if (time.previous < this.animationTimer) return;

        this.animationFrame += 1;
        if (this.animationFrame >= animations[this.state].length) {
            this.animationFrame = 0;
            if (this.state === FireballState.COLLIDE) this.entityList.remove(this);
        }

        this.animationTimer = time.previous + animations[this.state][this.animationFrame][1] * FRAME_TIME;
    }

    update(time, _, camera) {
        this.updateMovement(time, camera);
        this.updateAnimation(time);
    }

    draw(context, camera) {
        const [frameKey] = animations[this.state][this.animationFrame];
        const [[
            [x, y, width, height],
            [originX, originY],
        ]] = frames.get(frameKey);

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

        DEBUG.drawCollisionInfo(this, context, camera);
    }
}