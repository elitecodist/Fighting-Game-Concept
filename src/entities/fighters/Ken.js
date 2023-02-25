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

            ['jNeutral-1', [[95, 1208, 62, 108], [31, 108]]],
            ['jNeutral-2', [[817, 1228, 64, 88], [32, 88]]],
            ['jNeutral-3', [[889, 1246, 61, 70], [31, 70]]],
            ['jNeutral-4', [[958, 1251, 61, 65], [31, 65]]],
            ['jNeutral-5', [[1027, 1230, 64, 86], [32, 86]]],
            ['jNeutral-6', [[676, 1202, 62, 114], [31, 114]]],

            //base animation is forward jump
            ['jRoll-1', [[95, 1208, 62, 108], [31, 108]]],
            ['jRoll-2', [[161, 1208, 61, 108], [31, 108]]],
            ['jRoll-3', [[230, 1229, 60, 87], [30, 87]]],
            ['jRoll-4', [[298, 1268, 97, 48], [49, 48]]],
            ['jRoll-5', [[403, 1239, 59, 77], [30, 77]]],
            ['jRoll-6', [[470, 1258, 115, 58], [58, 58]]],
            ['jRoll-7', [[593, 1222, 79, 94], [40, 94]]],
        ]);

        this.animations = {
            [FighterState.IDLE]: [
                ['idle-1', 68], ['idle-2', 68], ['idle-3', 68],
                ['idle-4', 68], ['idle-5', 68], ['idle-6', 68]
            ],
            [FighterState.WALK_FORWARD]: [
                ['forward-1', 65], ['forward-2', 65], ['forward-3', 65], 
                ['forward-4', 65], ['forward-5', 65], ['forward-6', 65],
            ],
            [FighterState.WALK_BACKWARD]: [
                ['backward-1', 65], ['backward-2', 65], ['backward-3', 65],
                ['backward-4', 65], ['backward-5', 65], ['backward-6', 65],
            ],
            [FighterState.JUMP_NEUTRAL]: [
                ['jNeutral-1', 150], ['jNeutral-2', 70], ['jNeutral-3', 70], 
                ['jNeutral-4', 70], ['jNeutral-5', 70], ['jNeutral-6', -1], 
            ],
            [FighterState.JUMP_FORWARD]: [
                ['jRoll-1', 180], ['jRoll-2', 50], ['jRoll-3', 50], 
                ['jRoll-4', 50], ['jRoll-5', 50], ['jRoll-6', 50], 
                ['jRoll-7', 0],
            ],
            [FighterState.JUMP_BACKWARD]: [
                ['jRoll-7', 200], ['jRoll-6', 50], ['jRoll-5', 50], 
                ['jRoll-4', 50], ['jRoll-3', 50], ['jRoll-2', 50], 
                ['jRoll-1', 0], 
            ]
        };

        this.initialVelocity = {
            x: {
                [FighterState.WALK_FORWARD]: 200,
                [FighterState.WALK_BACKWARD]: -150,
                [FighterState.JUMP_FORWARD]: 170,
                [FighterState.JUMP_BACKWARD]: -200,
            },
            jump: -800,
        };

        this.gravity = 50;
    }
}
