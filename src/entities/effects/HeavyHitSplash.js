import { HitSplash } from "./HitSplash.js";

export class HeavyHitSplash extends HitSplash {
    
    frames = [
        [[87, 3, 29, 72],[15, 36]],
        [[87, 3, 29, 72],[15, 36]],
        [[87, 3, 29, 72],[15, 36]],
        [[87, 3, 29, 72],[15, 36]],
    ]
    
    constructor (args, time, entityList) {
        super(args, time, entityList);
    }

//     update(time) {
//         super.update(time);
//     }

//     draw(context, camera) {
//         super.draw(context, camera);
//     }
}