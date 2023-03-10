import { HitSplash } from "./HitSplash.js";

export class LightHitSplash extends HitSplash {
    constructor (x, y, playerId, onEnd) {
        super(x, y, playerId, onEnd);

        this.frames = [
            [[19, 21, 26, 34],[13, 17]],
            [[19, 21, 26, 34],[13, 17]],
            [[19, 21, 26, 34],[13, 17]],
            [[19, 21, 26, 34],[13, 17]],
        ]
    }

    update(time) {
        super.update(time);
    }

    draw(context, camera) {
        super.draw(context, camera);
    }
}