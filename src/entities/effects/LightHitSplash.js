import { HitSplash } from "./HitSplash.js";

export class LightHitSplash extends HitSplash {

    frames = [
        [[19, 21, 26, 34],[13, 17]],
        [[19, 21, 26, 34],[13, 17]],
        [[19, 21, 26, 34],[13, 17]],
        [[19, 21, 26, 34],[13, 17]],
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