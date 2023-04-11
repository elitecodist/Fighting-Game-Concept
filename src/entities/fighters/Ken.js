import { FrameDelay, FighterState, PushBox, HurtBox } from '../../constants/fighter.js';
import { Fighter } from './Fighter.js';

export class Ken extends Fighter {
    constructor(playerId, onAttackHit) {
        super(playerId, onAttackHit);

        this.deck = [
            'redC', 'redC', 'greenC', 'blueC', 'greenC',
            'redC', 'redC', 'greenC', 'blueC', 'greenC',
            'redC', 'redC', 'greenC', 'blueC', 'greenC',
            'redC', 'redC', 'greenC', 'blueC', 'greenC',
            'redC', 'redC', 'greenC', 'blueC', 'greenC',
            'redC', 'redC', 'greenC', 'blueC', 'greenC',
            'redC', 'redC', 'greenC', 'blueC', 'greenC',
            'redC', 'redC', 'greenC', 'blueC', 'greenC',
        ];

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
            ['jRoll-8', [[[676, 1202, 62, 114], [31, 114]], PushBox.JUMP]],

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

            ['jab-1', [[[31, 267, 77, 95], [39, 95]], PushBox.STAND]],
            ['jab-2', [[[116, 266, 107, 96], [39, 96]], PushBox.STAND, HurtBox.NONE, [13, -86, 56, 15]]],
            ['jab-3', [[[231, 267, 77, 95], [39, 95]], PushBox.STAND]],
            ['jab-4', [[[316, 267, 66, 95], [33, 95]], PushBox.STAND]],
            
            ['strong-1', [[[428, 267, 65, 95], [33, 95]], PushBox.STAND]],
            ['strong-2', [[[501, 267, 71, 95], [36, 95]], PushBox.STAND]],
            ['strong-3', [[[580, 268, 109, 94], [36, 94]], PushBox.STAND, HurtBox.NONE, [15, -82, 59, 13]]],
            ['strong-4', [[[697, 267, 71, 95], [36, 95]], PushBox.STAND]],
            ['strong-5', [[[776, 267, 65, 95], [33, 95]], PushBox.STAND]],
            ['strong-6', [[[849, 267, 66, 95], [33, 95]], PushBox.STAND]],
            
            ['headbutt-1', [[[24, 393, 86, 97], [39, 97]], PushBox.STAND]],
            ['headbutt-2', [[[118, 393, 94, 97], [39, 97]], PushBox.STAND]],
            ['headbutt-3', [[[220, 403, 92, 87], [39, 87]], PushBox.STAND, HurtBox.NONE, [34, -74, 27, 14]]],
            ['headbutt-4', [[[320, 395, 74, 95], [37, 95]], PushBox.STAND]],
            ['headbutt-5', [[[402, 396, 65, 94], [33, 94]], PushBox.STAND]],
            ['headbutt-6', [[[475, 396, 66, 94], [33, 94]], PushBox.STAND]],

            ['short-1', [[[24, 526, 83, 101], [42, 101]], PushBox.STAND]],
            //starting here, heel is 0 to center
            ['short-2', [[[115, 534, 59, 93], [30, 93]], PushBox.STAND]],
            ['short-3', [[[182, 539, 101, 88], [38, 88]], PushBox.STAND, HurtBox.NONE, [6, -28, 57, 14]]],
            ['short-4', [[[291, 538, 55, 89], [29, 89]], PushBox.STAND]],
            ['short-5', [[[354, 526, 83, 101], [42, 101]], PushBox.STAND]],
            ['short-6', [[[445, 533, 66, 94], [33, 94]], PushBox.STAND]],

            //heel is 0 to center
            ['forwardK-1', [[[519, 536, 67, 91], [34, 91]], PushBox.STAND]],
            ['forwardK-2', [[[594, 521, 73, 106], [31, 106]], PushBox.STAND]],
            ['forwardK-3', [[[675, 506, 86, 121], [31, 121]], PushBox.STAND]],
            ['forwardK-4', [[[769, 528, 113, 99], [37, 99]], PushBox.STAND, HurtBox.NONE, [27, -80, 49, 16]]],
            ['forwardK-5', [[[890, 539, 114, 88], [42, 88]], PushBox.STAND, HurtBox.NONE, [21, -37, 49, 16]]],
            ['forwardK-6', [[[1012, 535, 94, 92], [38, 92]], PushBox.STAND]],
            ['forwardK-7', [[[1114, 532, 74, 95], [37, 95]], PushBox.STAND]],

            ['roundhouse-1', [[[24, 756, 68, 95], [34, 95]], PushBox.STAND]],
            ['roundhouse-2', [[[100, 758, 76, 93], [38, 93]], PushBox.STAND]],
            ['roundhouse-3', [[[184, 760, 81, 91], [41, 91]], PushBox.STAND]],
            //33 footballs to center
            ['roundhouse-4', [[[273, 758, 79, 93], [16, 93]], PushBox.STAND]],
            ['roundhouse-5', [[[360, 755, 130, 96], [5, 96]], PushBox.STAND, HurtBox.NONE, [37, -58, 88, 14]]],
            ['roundhouse-6', [[[498, 756, 107, 95], [-9, 95]], PushBox.STAND]],
            ['roundhouse-7', [[[613, 758, 74, 93], [-16, 93]], PushBox.STAND]],
            ['roundhouse-8', [[[695, 757, 72, 94], [-12, 94]], PushBox.STAND]],
            ['roundhouse-9', [[[775, 756, 76, 95], [38, 95]], PushBox.STAND]],
            ['roundhouse-10', [[[859, 757, 66, 94], [33, 94]], PushBox.STAND]],

            ['fireball-1', [[[24, 2269, 74, 90], [37, 90]], PushBox.STAND]],
            ['fireball-2', [[[106, 2274, 90, 85], [45, 85]], PushBox.STAND]],
            ['fireball-3', [[[204, 2279, 96, 80], [48, 80]], PushBox.STAND]],
            ['fireball-4', [[[304, 2282, 114, 77], [57, 77]], PushBox.STAND]],//punchBox
            ['fireball-5', [[[426, 2282, 114, 77], [57, 77]], PushBox.STAND]],//punchBox
        ]);

        this.animations = {
            [FighterState.IDLE]: [
                ['idle-1', 4], ['idle-2', 4], ['idle-3', 4],
                ['idle-4', 4], ['idle-5', 4], ['idle-6', 4]
            ],
            [FighterState.WALK_FORWARD]: [
                ['forward-1', 4], ['forward-2', 4], ['forward-3', 4],
                ['forward-4', 4], ['forward-5', 4], ['forward-6', 4],
            ],
            [FighterState.WALK_BACKWARD]: [
                ['backward-1', 4], ['backward-2', 4], ['backward-3', 4],
                ['backward-4', 4], ['backward-5', 4], ['backward-6', 4],
            ],
            [FighterState.JUMP_START]: [
                ['jLand', 3], ['jLand', FrameDelay.TRANSITION]
            ],
            [FighterState.JUMP_NEUTRAL]: [
                ['jNeutral-1', 7], ['jNeutral-2', 4], ['jNeutral-3', 4],
                ['jNeutral-4', 6], ['jNeutral-5', 5], ['jNeutral-6', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_FORWARD]: [
                ['jRoll-1', 4], ['jRoll-2', 3], ['jRoll-3', 3],
                ['jRoll-4', 3], ['jRoll-5', 3], ['jRoll-6', 4],
                ['jRoll-7', 3], ['jRoll-8', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_BACKWARD]: [
                ['jRoll-7', 12], ['jRoll-6', 3], ['jRoll-5', 3],
                ['jRoll-4', 3], ['jRoll-3', 3], ['jRoll-2', 3],
                ['jRoll-1', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_LAND]: [
                ['jLand', 2], ['jLand', 7], ['jLand', FrameDelay.TRANSITION],
            ],
            [FighterState.CROUCH]: [
                ['crouch-3', FrameDelay.FREEZE],
            ],
            [FighterState.CROUCH_DOWN]: [
                ['crouch-1', 2], ['crouch-2', 2], ['crouch-3', 2], ['crouch-3', FrameDelay.TRANSITION],
            ],
            [FighterState.CROUCH_RISE]: [
                ['crouch-3', 2], ['crouch-2', 2], ['crouch-1', 2], ['crouch-1', FrameDelay.TRANSITION],
            ],
            [FighterState.IDLE_TURN]: [
                ['iTurn-3', 2], ['iTurn-2', 2], ['iTurn-1', 2], ['iTurn-1', FrameDelay.TRANSITION],
            ],
            [FighterState.CROUCH_TURN]: [
                ['cTurn-3', 2], ['cTurn-2', 2], ['cTurn-1', 2], ['cTurn-1', FrameDelay.TRANSITION],
            ],
            [FighterState.FIVE_PUNCH]: [
                ['jab-1', 2], ['jab-2', 4], ['jab-3', 4], ['jab-4', FrameDelay.TRANSITION],
            ],
            [FighterState.SIX_PUNCH]: [
                ['strong-1', 1], ['strong-2', 2], ['strong-3', 4], ['strong-4', 3], ['strong-5', 3], ['strong-6', FrameDelay.TRANSITION],
            ],
            [FighterState.FOUR_PUNCH]: [
                ['headbutt-1', 1], ['headbutt-2', 2], ['headbutt-3', 4], ['headbutt-4', 3], ['headbutt-5', 3], ['headbutt-6', FrameDelay.TRANSITION],
            ],
            [FighterState.FIVE_KICK]: [
                ['short-1', 3], ['short-2', 3], ['short-3', 8], ['short-4', 4], ['short-5', 1], ['short-6', FrameDelay.TRANSITION],
            ],
            [FighterState.SIX_KICK]: [
                ['forwardK-1', 2], ['forwardK-2', 4], ['forwardK-3', 5],
                ['forwardK-4', 4], ['forwardK-5', 3], ['forwardK-6', 3],
                ['forwardK-7', FrameDelay.TRANSITION],
            ],
            [FighterState.FOUR_KICK]: [
                ['roundhouse-1', 2], ['roundhouse-2', 3], ['roundhouse-3', 3],
                ['roundhouse-4', 3], ['roundhouse-5', 5], ['roundhouse-6', 5],
                ['roundhouse-7', 5], ['roundhouse-8', 4], ['roundhouse-9', 3],
                ['roundhouse-10', FrameDelay.TRANSITION],
            ],
            [FighterState.BLUE_1]: [
                ['special-1', 2], ['special-2', 8], ['special-3', 2],
                ['special-4', 40], ['special-5', FrameDelay.TRANSITION],
            ],
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

        this.states[FighterState.SPECIAL_1] = {
            init: this.handleFireballInit,
            update: this.handleFireballState,
            validFrom: [
                FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD,
                FighterState.IDLE_TURN, FighterState.CROUCH, FighterState.CROUCH_DOWN,
                FighterState.CROUCH_RISE, FighterState.CROUCH_TURN
            ]
        }
        this.states[FighterState.IDLE].validFrom = [...this.states[FighterState.IDLE].validFrom, FighterState.BLUE_1];
    }

    handleFireballInit = () => {
        this.resetVelocities();
    }

    handleFireballState = (time) => {
        if (!this.hasAnimationCompleted()) return;
        this.changeState(FighterState.IDLE, time);
    }
}
