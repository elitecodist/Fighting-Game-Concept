import { FRAME_TIME } from "../../constants/game.js";

export class HitSplash {
    constructor(args, time, entityList) {
        const [x, y, playerId] = args;

        this.image = document.querySelector('img[alt="hit-splash"]');
        this.position = { x, y };
        this.playerId = playerId;
        this.entityList = entityList;

        this.frames = [];
        this.animationFrame = -1;
        this.animationTimer = 0;
    }

    update(time) {
        if (time.previous < this.animationTimer + this.frames.length * FRAME_TIME) return;
        this.animationFrame += 1;
        this.animationTimer = time.previous;

        if (this.animationFrame >= this.frames.length) this.entityList.remove(this);
    }

    draw(context, camera) {
        const [
            [x, y, width, height], [originX, originY],
        ] = this.frames[this.animationFrame];

        context.drawImage(
            this.image,
            x, y,
            width, height,
            Math.floor(this.position.x - camera.position.x - originX),
            Math.floor(this.position.y - camera.position.y - originY),
            width, height
        );
    }
}