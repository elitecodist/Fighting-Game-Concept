import { Fighter } from './Fighter.js';
import { FighterState, PushBox, FrameDelay } from '../../constants/fighter.js';

export class Karin extends Fighter {
    constructor(x, y, direction, playerId) {
        super('Karin', x, y, direction, playerId);

        this.image = document.querySelector('img[alt="karin"]');

        this.frames = new Map([
            ['idle-1', [[[16, 27, 88, 84], [44, 84]], PushBox.STAND]],
            ['idle-2', [[[210, 26, 90, 85], [45, 85]], PushBox.STAND]],
            ['idle-3', [[[308, 25, 90, 86], [45, 86]], PushBox.STAND]],
            ['idle-4', [[[406, 24, 89, 87], [45, 87]], PushBox.STAND]],
            ['idle-5', [[[503, 24, 87, 87], [44, 87]], PushBox.STAND]],
            ['idle-6', [[[598, 24, 87, 87], [44, 87]], PushBox.STAND]],

            ['forward-1', [[[16, 134, 93, 85], [47, 85]], PushBox.STAND]],
            ['forward-2', [[[313, 128, 76, 91], [38, 91]], PushBox.STAND]],
            ['forward-3', [[[478, 127, 72, 92], [36, 92]], PushBox.STAND]],
            ['forward-4', [[[637, 130, 72, 89], [36, 89]], PushBox.STAND]],
            ['forward-5', [[[800, 131, 75, 88], [38, 88]], PushBox.STAND]],
            ['forward-6', [[[1061, 134, 88, 85], [44, 85]], PushBox.STAND]],

            ['backward-1', [[[16, 241, 83, 86], [42, 86]], PushBox.STAND]],
            ['backward-2', [[[277, 238, 72, 89], [36, 89]], PushBox.STAND]],
            ['backward-3', [[[436, 235, 72, 92], [36, 92]], PushBox.STAND]],
            ['backward-4', [[[597, 236, 72, 89], [36, 89]], PushBox.STAND]],
            ['backward-5', [[[776, 241, 93, 86], [47, 86]], PushBox.STAND]],
            ['backward-6', [[[1074, 241, 83, 86], [42, 86]], PushBox.STAND]],

            ['jNeutral-1', [[[101, 1711, 56, 117], [28, 117]], PushBox.JUMP]],
            ['jNeutral-2', [[[165, 1737, 62, 91], [31, 91]], PushBox.JUMP]],
            ['jNeutral-3', [[[319, 1774, 73, 54], [37, 54]], PushBox.JUMP]],
            ['jNeutral-4', [[[400, 1772, 75, 56], [38, 56]], PushBox.JUMP]],
            ['jNeutral-5', [[[568, 1742, 71, 86], [36, 86]], PushBox.JUMP]],
            ['jNeutral-6', [[[647, 1720, 67, 108], [34, 108]], PushBox.JUMP]],

            //base animation is backward jump
            ['jRoll-1', [[[101, 1844, 45, 118], [23, 118]], PushBox.JUMP]],
            ['jRoll-2', [[[154, 1851, 67, 111], [34, 111]], PushBox.JUMP]],
            ['jRoll-3', [[[322, 1896, 113, 66], [57, 66]], PushBox.JUMP]],
            ['jRoll-4', [[[523, 1890, 80, 72], [40, 72]], PushBox.JUMP]],
            ['jRoll-5', [[[611, 1902, 88, 60], [44, 60]], PushBox.JUMP]],
            ['jRoll-6', [[[794, 1873, 73, 89], [37, 89]], PushBox.JUMP]],
            ['jRoll-7', [[[875, 1854, 67, 108], [34, 108]], PushBox.JUMP]],

            ['jLand', [[[859, 1764, 77, 64], [39, 64]], PushBox.CROUCH]],

            ['crouch-1', [[[16, 1028, 91, 79], [46, 79]], PushBox.STAND]],
            ['crouch-2', [[[115, 1042, 77, 65], [39, 65]], PushBox.SEMICROUCH]],
            ['crouch-3', [[[200, 1045, 69, 62], [35, 62]], PushBox.CROUCH]],

            ['iTurn-1', [[[788, 24, 88, 86], [44, 86]], PushBox.STAND]],
            ['iTurn-2', [[[884, 24, 88, 86], [44, 86]], PushBox.STAND]],
            ['iTurn-3', [[[980, 25, 87, 85], [44, 85]], PushBox.STAND]],

            ['cTurn-1', [[[277, 1043, 67, 64], [34, 64]], PushBox.CROUCH]],
            ['cTurn-2', [[[352, 1043, 67, 64], [34, 64]], PushBox.CROUCH]],
            ['cTurn-3', [[[427, 1044, 69, 63], [35, 63]], PushBox.CROUCH]],
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
            [FighterState.JUMP_START]: [
                ['jLand', 50], ['jLand', FrameDelay.TRANSITION]
            ],
            [FighterState.JUMP_NEUTRAL]: [
                ['jNeutral-1', 150], ['jNeutral-2', 70], ['jNeutral-3', 70],
                ['jNeutral-4', 70], ['jNeutral-5', 70], ['jNeutral-6', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_FORWARD]: [
                ['jNeutral-1', 100], ['jNeutral-2', 50], ['jRoll-5', 50],
                ['jRoll-4', 50], ['jRoll-3', 50], ['jRoll-2', 50],
                ['jRoll-1', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_BACKWARD]: [
                ['jRoll-1', 100], ['jRoll-2', 70], ['jRoll-3', 50],
                ['jRoll-4', 50], ['jRoll-5', 50], ['jRoll-6', 50],
                ['jRoll-7', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_LAND]: [
                ['jLand', 33], ['jLand', 117], ['jLand', FrameDelay.TRANSITION],
            ],
            [FighterState.CROUCH]: [
                ['crouch-3', FrameDelay.FREEZE],
            ],
            [FighterState.CROUCH_DOWN]: [
                ['crouch-1', 30], ['crouch-2', 30], ['crouch-3', 30], ['crouch-3', FrameDelay.TRANSITION],
            ],
            [FighterState.CROUCH_RISE]: [
                ['crouch-3', 30], ['crouch-2', 30], ['crouch-1', 30], ['crouch-1', FrameDelay.TRANSITION],
            ],
            [FighterState.IDLE_TURN]: [
                ['iTurn-3', 33], ['iTurn-2', 33], ['iTurn-1', 33], ['iTurn-1', FrameDelay.TRANSITION],
            ],
            [FighterState.CROUCH_TURN]: [
                ['cTurn-3', 33], ['cTurn-2', 33], ['cTurn-1', 33], ['cTurn-1', FrameDelay.TRANSITION],
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
