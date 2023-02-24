import { FighterState } from '../../constants/fighter.js';
import { Fighter } from './Fighter.js';

export class Ken extends Fighter {
    constructor(x, y, velocity){
        super('Ken',x,y,velocity);

        this.image = document.querySelector('img[alt="ken"]');

        this.frames = new Map([
            ['idle-1', [[24, 37, 66, 93], [33, 93]]],
            ['idle-2', [[98, 36, 66, 94], [33, 94]]],
            ['idle-3', [[172, 34, 66, 93], [33, 93]]],
            ['idle-4', [[246, 32, 64, 98], [32, 98]]],
            ['idle-5', [[318, 34, 66, 96], [33, 96]]],
            ['idle-6', [[392, 36, 66, 94], [33, 94]]],

            ['forward-1', [[24, 153, 63, 89], [32, 89]]],
            ['forward-2', [[94, 148, 71, 94], [36, 94]]],
            ['forward-3', [[173, 147, 68, 95], [34, 95]]],
            ['forward-4', [[249, 146, 59, 96], [30, 96]]],
            ['forward-5', [[316, 147, 54, 95], [27, 95]]],
            ['forward-6', [[378, 148, 56, 94], [28, 94]]],
            
            ['backward-1', [[442, 153, 63, 89], [32, 89]]],
            ['backward-2', [[513, 148, 61, 94], [31, 94]]],
            ['backward-3', [[582, 147, 54, 95], [27, 95]]],
            ['backward-4', [[644, 146, 54, 96], [27, 96]]],
            ['backward-5', [[706, 147, 61, 95], [31, 95]]],
            ['backward-6', [[775, 148, 63, 94], [32, 94]]],
        ]);

        this.animations = {
            [FighterState.IDLE]: ['idle-1','idle-2','idle-3','idle-4','idle-5','idle-6'],
            [FighterState.WALK_FORWARD]: ['forward-1','forward-2','forward-3','forward-4','forward-5','forward-6',],
            [FighterState.WALK_BACKWARD]: ['backward-1','backward-2','backward-3','backward-4','backward-5','backward-6',],
        }
    }
}
