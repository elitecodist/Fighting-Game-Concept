import { Fighter } from './Fighter.js';

export class Ken extends Fighter {
    constructor(x, y, velocity){
        super('Ken',x,y,velocity);

        this.image = document.querySelector('img[alt="ken"]');

        // this.frames = new Map([
        //     ['forwards-1', [24, 37, 66, 93]],
        //     ['forwards-2', [98, 36, 66, 94]],
        //     ['forwards-3', [172, 34, 66, 93]],
        //     ['forwards-4', [246, 32, 64, 98]],
        //     ['forwards-5', [318, 34, 66, 96]],
        //     ['forwards-6', [392, 36, 66, 94]],
        // ]);
        this.frames = new Map([
            ['forwards-1', [[24, 153, 63, 89], [32, 89]]],
            ['forwards-2', [[94, 148, 71, 94], [36, 94]]],
            ['forwards-3', [[173, 147, 68, 95], [34, 95]]],
            ['forwards-4', [[249, 146, 59, 96], [30, 96]]],
            ['forwards-5', [[316, 147, 54, 95], [27, 95]]],
            ['forwards-6', [[378, 148, 56, 94], [28, 94]]],
            
            ['backwards-1', [[442, 153, 63, 89], [32, 89]]],
            ['backwards-2', [[513, 148, 61, 94], [31, 94]]],
            ['backwards-3', [[582, 147, 54, 95], [27, 95]]],
            ['backwards-4', [[644, 146, 54, 96], [27, 96]]],
            ['backwards-5', [[706, 147, 61, 95], [31, 95]]],
            ['backwards-6', [[775, 148, 63, 94], [32, 94]]],
        ]);

        this.animations = {
            'walkForwards': ['forwards-1','forwards-2','forwards-3','forwards-4','forwards-5','forwards-6',],
            'walkBackwards': ['backwards-1','backwards-2','backwards-3','backwards-4','backwards-5','backwards-6',],
        }
    }
}
