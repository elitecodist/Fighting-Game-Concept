import { Fighter } from './Fighter.js';
import { FighterState } from '../../constants/fighter.js';

export class Karin extends Fighter {
    constructor(x, y, direction, playerId) {
        super('Karin', x, y, direction, playerId);

        this.image = document.querySelector('img[alt="karin"]');

        this.frames = new Map([
            ['idle-1', [[16, 27, 88, 84], [44, 84]]],
            ['idle-2', [[210, 26, 90, 85], [45, 85]]],
            ['idle-3', [[308, 25, 90, 86], [45, 86]]],
            ['idle-4', [[406, 24, 89, 87], [45, 87]]],
            ['idle-5', [[503, 24, 87, 87], [44, 87]]],
            ['idle-6', [[598, 24, 87, 87], [44, 87]]],

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

            ['jNeutral-1', [[101, 1711, 56, 117], [28, 117]]],
            ['jNeutral-2', [[165, 1737, 62, 91], [31, 91]]],
            ['jNeutral-3', [[319, 1774, 73, 54], [37, 54]]],
            ['jNeutral-4', [[400, 1772, 75, 56], [38, 56]]],
            ['jNeutral-5', [[568, 1742, 71, 86], [36, 86]]],
            ['jNeutral-6', [[647, 1720, 67, 108], [34, 108]]],

            //base animation is backward jump
            ['jRoll-1', [[101, 1844, 45, 118], [23, 118]]],
            ['jRoll-2', [[154, 1851, 67, 111], [34, 111]]],
            ['jRoll-3', [[322, 1896, 113, 66], [57, 66]]],
            ['jRoll-4', [[523, 1890, 80, 72], [40, 72]]],
            ['jRoll-5', [[611, 1902, 88, 60], [44, 60]]],
            ['jRoll-6', [[794, 1873, 73, 89], [37, 89]]],
            ['jRoll-7', [[875, 1854, 67, 108], [34, 108]]],

            ['crouch-1', [[16, 1028, 91, 79], [46, 79]]],
            ['crouch-2', [[115, 1042, 77, 65], [39, 65]]],
            ['crouch-3', [[200, 1045, 69, 62], [35, 62]]],
        ]);


        // this.frame = [16, 27, 88, 84];
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
                ['jNeutral-1', 180], ['jNeutral-2', 50], ['jRoll-5', 50],
                ['jRoll-4', 50], ['jRoll-3', 50], ['jRoll-2', 50],
                ['jRoll-1', 0],
            ],
            [FighterState.JUMP_BACKWARD]: [
                ['jRoll-1', 180], ['jRoll-2', 50], ['jRoll-3', 50],
                ['jRoll-4', 50], ['jRoll-5', 50], ['jRoll-6', 50],
                ['jRoll-7', 0],
            ],
            [FighterState.CROUCH]: [
                ['crouch-3', 0],
            ],
            [FighterState.CROUCH_DOWN]: [
                ['crouch-1', 30], ['crouch-2', 30], ['crouch-3', 30], ['crouch-3', -2],
            ],
            [FighterState.CROUCH_RISE]: [
                ['crouch-3', 30], ['crouch-2', 30], ['crouch-1', 30], ['crouch-1', -2],
            ]
        };

        this.initialVelocity = {
            x: {
                [FighterState.WALK_FORWARD]: 220,
                [FighterState.WALK_BACKWARD]: -170,
                [FighterState.JUMP_FORWARD]: 190,
                [FighterState.JUMP_BACKWARD]: -220,
            },
            jump: -800,
        };

        this.gravity = 50;
    }
}
