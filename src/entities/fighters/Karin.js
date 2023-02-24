import { Fighter } from './Fighter.js';

export class Karin extends Fighter {
    constructor(x, y, velocity){
        super('Karin',x,y,velocity);

        this.image = document.querySelector('img[alt="karin"]');

        this.frames = new Map([
            ['forwards-1', [[16, 134, 93, 85], [47, 85]]],
            ['forwards-2', [[313, 128, 76, 91], [38, 91]]],
            ['forwards-3', [[478, 127, 72, 92], [36, 92]]],
            ['forwards-4', [[637, 130, 72, 89], [36, 89]]],
            ['forwards-5', [[800, 131, 75, 88], [38, 88]]],
            ['forwards-6', [[1061, 134, 88, 85], [44, 85]]],

            ['backwards-1', [[16, 241, 83, 86], [42, 86]]],
            ['backwards-2', [[277, 238, 72, 89], [36, 89]]],
            ['backwards-3', [[436, 235, 72, 92], [36, 92]]],
            ['backwards-4', [[597, 236, 72, 89], [36, 89]]],
            ['backwards-5', [[776, 241, 93, 86], [47, 86]]],
            ['backwards-6', [[1074, 241, 83, 86], [42, 86]]],
        ]);


        // this.frame = [16, 27, 88, 84];
        this.animations = {
            'walkForwards': ['forwards-1','forwards-2','forwards-3','forwards-4','forwards-5','forwards-6',],
            'walkBackwards': ['backwards-1','backwards-2','backwards-3','backwards-4','backwards-5','backwards-6',],
        }
    }
}
