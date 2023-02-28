import { FrameDelay, FighterState, PushBox } from '../../constants/fighter.js';
import { Fighter } from './Fighter.js';

export class Ken extends Fighter {
    constructor(x, y, direction, playerId) {
        super('Ken', x, y, direction, playerId);

        this.image = document.querySelector('img[alt="ken"]');

        this.frames = new Map([
            ['idle-1', [[[24, 37, 66, 93], [33, 93]], PushBox.STAND]],
            ['idle-2', [[[98, 36, 66, 94], [33, 94]], PushBox.STAND]],
            ['idle-3', [[[172, 34, 66, 93], [33, 93]], PushBox.STAND]],
            ['idle-4', [[[246, 32, 64, 98], [32, 98]], PushBox.STAND]],
            ['idle-5', [[[318, 34, 66, 96], [33, 96]], PushBox.STAND]],
            ['idle-6', [[[392, 36, 66, 94], [33, 94]], PushBox.STAND]],

            ['forward-1', [[[24, 153, 63, 89], [32, 89]], PushBox.STAND]],
            ['forward-2', [[[94, 148, 71, 94], [36, 94]], PushBox.STAND]],
            ['forward-3', [[[173, 147, 68, 95], [34, 95]], PushBox.STAND]],
            ['forward-4', [[[249, 146, 59, 96], [30, 96]], PushBox.STAND]],
            ['forward-5', [[[316, 147, 54, 95], [27, 95]], PushBox.STAND]],
            ['forward-6', [[[378, 148, 56, 94], [28, 94]], PushBox.STAND]],

            ['backward-1', [[[442, 153, 63, 89], [32, 89]], PushBox.STAND]],
            ['backward-2', [[[513, 148, 61, 94], [31, 94]], PushBox.STAND]],
            ['backward-3', [[[582, 147, 54, 95], [27, 95]], PushBox.STAND]],
            ['backward-4', [[[644, 146, 54, 96], [27, 96]], PushBox.STAND]],
            ['backward-5', [[[706, 147, 61, 95], [31, 95]], PushBox.STAND]],
            ['backward-6', [[[775, 148, 63, 94], [32, 94]], PushBox.STAND]],

            ['jNeutral-1', [[[95, 1208, 62, 108], [31, 108]], PushBox.JUMP]],
            ['jNeutral-2', [[[817, 1228, 64, 88], [32, 88]], PushBox.JUMP]],
            ['jNeutral-3', [[[889, 1246, 61, 70], [31, 70]], PushBox.JUMP]],
            ['jNeutral-4', [[[958, 1251, 61, 65], [31, 65]], PushBox.JUMP]],
            ['jNeutral-5', [[[1027, 1230, 64, 86], [32, 86]], PushBox.JUMP]],
            ['jNeutral-6', [[[676, 1202, 62, 114], [31, 114]], PushBox.JUMP]],

            //base animation is forward jump
            ['jRoll-1', [[[95, 1208, 62, 108], [31, 108]], PushBox.JUMP]],
            ['jRoll-2', [[[161, 1208, 61, 108], [31, 108]], PushBox.JUMP]],
            ['jRoll-3', [[[230, 1229, 60, 87], [30, 87]], PushBox.JUMP]],
            ['jRoll-4', [[[298, 1268, 97, 48], [49, 48]], PushBox.JUMP]],
            ['jRoll-5', [[[403, 1239, 59, 77], [30, 77]], PushBox.JUMP]],
            ['jRoll-6', [[[470, 1258, 115, 58], [58, 58]], PushBox.JUMP]],
            ['jRoll-7', [[[593, 1222, 79, 94], [40, 94]], PushBox.JUMP]],

            ['jLand', [[[746, 1227, 63, 89], [32, 89]], PushBox.STAND]],

            ['crouch-1', [[[24, 867, 63, 89], [32, 89]], PushBox.STAND]],
            ['crouch-2', [[[95, 884, 62, 72], [31, 72]], PushBox.SEMICROUCH]],
            ['crouch-3', [[[165, 891, 62, 65], [31, 65]], PushBox.CROUCH]],

            ['iTurn-1', [[[466, 34, 67, 96], [34, 96]], PushBox.STAND]],
            ['iTurn-2', [[[541, 35, 65, 95], [33, 95]], PushBox.STAND]],
            ['iTurn-3', [[[614, 36, 67, 94], [34, 94]], PushBox.STAND]],

            ['cTurn-2', [[[303, 891, 60, 65], [30, 65]], PushBox.CROUCH]],
            ['cTurn-3', [[[371, 891, 61, 65], [31, 65]], PushBox.CROUCH]],
            ['cTurn-1', [[[235, 891, 60, 65], [30, 65]], PushBox.CROUCH]],
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
                ['jRoll-1', 70], ['jRoll-2', 50], ['jRoll-3', 50],
                ['jRoll-4', 50], ['jRoll-5', 50], ['jRoll-6', 50],
                ['jRoll-7', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_BACKWARD]: [
                ['jRoll-7', 200], ['jRoll-6', 50], ['jRoll-5', 50],
                ['jRoll-4', 50], ['jRoll-3', 50], ['jRoll-2', 50],
                ['jRoll-1', FrameDelay.FREEZE],
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
