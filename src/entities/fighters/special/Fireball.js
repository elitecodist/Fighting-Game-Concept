import { FireballState, fireballVelocity } from "../../../constants/fireball.js";
import { FRAME_TIME } from "../../../constants/game.js";

const frames = new Map([
    ['fireball-1', [[[617, 2329, 56, 28], [37, 14]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],
    ['fireball-2', [[[681, 2327, 43, 32], [25, 16]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],
    ['fireball-3', [[[0,0,0,0], [0,0]], [-15, -13, 30, 24], [-28, -20, 56, 38]]],
    
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

    constructor(fighter, type, time, onEnd) {
        this.fighter = fighter;
        this.onEnd = onEnd;
        this.velocity = fireballVelocity[type];
        this.direction = this.fighter.direction;
        this.position = {
            x: this.fighter.position.x + (76 * this.direction),
            y: this.fighter.position.y - 57,
        };
        this.animationTimer = time.previous;
    }

    updateMovement(time, camera) {
        this.position.x += (this.velocity * this.direction) * time.secondsPassed;
        
        if (this.position.x - camera.position.x > 384 + 56 || this.position.x - camera.position.x < -56) {
            this.onEnd(this);
        }
    }

    updateAnimation(time) {
        if (time.previous < this.animationTimer) return;

        this.animationFrame += 1;
        if (this.animationFrame >= animations[this.state].length) {
            this.animationFrame = 0;
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
    }
}