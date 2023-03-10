import { HitSplash } from "./HitSplash.js";

export class MedHitSplash extends HitSplash {
    constructor (x, y, playerId, onEnd) {
        super(x, y, playerId, onEnd);

        this.frames = [
            [[54, 21, 27, 36],[14, 18]],
            [[54, 21, 27, 36],[14, 18]],
            [[54, 21, 27, 36],[14, 18]],
            [[54, 21, 27, 36],[14, 18]],
        ]
    }

    update(time) {
        super.update(time);
    }

    draw(context, camera) {
        super.draw(context, camera);
    }
}