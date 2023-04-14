import { HitSplash } from "./HitSplash.js";

export class MedHitSplash extends HitSplash {
    frames = [
        [[54, 21, 27, 36],[14, 18]],
        [[54, 21, 27, 36],[14, 18]],
        [[54, 21, 27, 36],[14, 18]],
        [[54, 21, 27, 36],[14, 18]],
    ]
    constructor (args, time, entityList) {
        super(args, time, entityList);
    }

    // update(time) {
    //     super.update(time);
    // }

    // draw(context, camera) {
    //     super.draw(context, camera);
    // }
}