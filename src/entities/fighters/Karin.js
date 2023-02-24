import { Fighter } from './Fighter.js';
import { FighterState } from '../../constants/fighter.js';

export class Karin extends Fighter {
    constructor(x, y, velocity){
        super('Karin',x,y,velocity);

        this.image = document.querySelector('img[alt="karin"]');

        this.frames = new Map([
            ['idle-1', [[24, 37, 66, 93], [33, 93]]],
            ['idle-2', [[98, 36, 66, 94], [33, 94]]],
            ['idle-3', [[172, 34, 66, 93], [33, 93]]],
            ['idle-4', [[246, 32, 64, 98], [32, 98]]],
            ['idle-5', [[318, 34, 66, 96], [33, 96]]],
            ['idle-6', [[392, 36, 66, 94], [33, 94]]],

            ['forward-1', [[16, 134, 93, 85], [47, 85]]],
            ['forward-2', [[313, 128, 76, 91], [38, 91]]],
            ['forward-3', [[478, 127, 72, 92], [36, 92]]],
            ['forward-4', [[637, 130, 72, 89], [36, 89]]],
            ['forward-5', [[800, 131, 75, 88], [38, 88]]],
            ['forward-6', [[1061, 134, 88, 85], [44, 85]]],

            ['backward-1', [[16, 241, 83, 86], [42, 86]]],
            ['backward-2', [[277, 238, 72, 89], [36, 89]]],
            ['backward-3', [[436, 235, 72, 92], [36, 92]]],
            ['backward-4', [[597, 236, 72, 89], [36, 89]]],
            ['backward-5', [[776, 241, 93, 86], [47, 86]]],
            ['backward-6', [[1074, 241, 83, 86], [42, 86]]],
        ]);


        // this.frame = [16, 27, 88, 84];
        this.animations = {
            [FighterState.IDLE]: ['idle-1','idle-2','idle-3','idle-4','idle-5','idle-6'],
            [FighterState.WALK_FORWARD]: ['forward-1','forward-2','forward-3','forward-4','forward-5','forward-6',],
            [FighterState.WALK_BACKWARD]: ['backward-1','backward-2','backward-3','backward-4','backward-5','backward-6',],
        }
    }
}
