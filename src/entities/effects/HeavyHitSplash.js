import { HitSplash } from "./HitSplash.js";

export class HeavyHitSplash extends HitSplash {
    constructor (x, y, playerId, onEnd) {
        super(x, y, playerId, onEnd);

        this.frames = [
            [[87, 3, 29, 72],[15, 36]],
            [[87, 3, 29, 72],[15, 36]],
            [[87, 3, 29, 72],[15, 36]],
            [[87, 3, 29, 72],[15, 36]],
        ]
    }

    update(time) {
        super.update(time);
    }

    draw(context, camera) {
        super.draw(context, camera);
    }
}