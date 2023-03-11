import { Fighter } from './Fighter.js';
import { 
    FighterState, PushBox, HurtBox,
    FrameDelay, FIGHTER_HURT_DELAY 
} from '../../constants/fighter.js';

export class Karin extends Fighter {
    constructor(playerId, onAttackHit) {
        super(playerId, onAttackHit);

        this.image = document.querySelector('img[alt="karin"]');

        this.frames = new Map([
            ['idle-1', [[[16, 27, 88, 84], [44, 84]], PushBox.STAND, HurtBox.STAND]],
            ['idle-2', [[[210, 26, 90, 85], [45, 85]], PushBox.STAND, HurtBox.STAND]],
            ['idle-3', [[[308, 25, 90, 86], [45, 86]], PushBox.STAND, HurtBox.STAND]],
            ['idle-4', [[[406, 24, 89, 87], [45, 87]], PushBox.STAND, HurtBox.STAND]],
            ['idle-5', [[[503, 24, 87, 87], [44, 87]], PushBox.STAND, HurtBox.STAND]],
            ['idle-6', [[[598, 24, 87, 87], [44, 87]], PushBox.STAND, HurtBox.STAND]],

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

            ['jab-1', [[[16, 344, 89, 87], [45, 87]], PushBox.STAND]],
            ['jab-2', [[[113, 343, 113, 88], [45, 88]], PushBox.STAND]],
            ['jab-3', [[[234, 343, 109, 88], [45, 88]], PushBox.STAND]],
            ['jab-4', [[[351, 344, 89, 87], [45, 87]], PushBox.STAND]],
            ['jab-5', [[[448, 345, 87, 86], [44, 86]], PushBox.STAND]],

            ['strong-1', [[[16, 448, 94, 86], [47, 86]], PushBox.STAND]],
            ['strong-2', [[[118, 450, 124, 84], [47, 84]], PushBox.STAND]],
            ['strong-3', [[[250, 450, 120, 84], [47, 84]], PushBox.STAND]],
            ['strong-4', [[[378, 450, 120, 84], [47, 84]], PushBox.STAND]],
            ['strong-5', [[[506, 448, 105, 86], [47, 86]], PushBox.STAND]],
            ['strong-6', [[[619, 447, 94, 87], [47, 87]], PushBox.STAND]],
            ['strong-7', [[[721, 448, 87, 86], [44, 86]], PushBox.STAND]],

            ['ballet-1', [[[16, 575, 93, 85], [47, 85]], PushBox.STAND]],
            ['ballet-2', [[[117, 551, 71, 109], [15, 109]], PushBox.STAND]],
            ['ballet-3', [[[196, 550, 68, 110], [-3, 110]], PushBox.STAND]],
            ['ballet-4', [[[272, 562, 109, 98], [9, 98]], PushBox.STAND]],
            ['ballet-5', [[[389, 563, 109, 97], [9, 97]], PushBox.STAND]],
            ['ballet-6', [[[506, 563, 109, 97], [9, 97]], PushBox.STAND]],
            ['ballet-7', [[[623, 562, 108, 98], [9, 98]], PushBox.STAND]],
            ['ballet-8', [[[739, 563, 92, 97], [8, 97]], PushBox.STAND]],
            ['ballet-9', [[[839, 568, 66, 92], [12, 92]], PushBox.STAND]],
            ['ballet-10', [[[913, 574, 87, 86], [44, 86]], PushBox.STAND]],

            //ll to centerx
            ['short-1', [[[16, 676, 70, 95], [35, 95]], PushBox.STAND]],
            ['short-2', [[[94, 678, 67, 93], [15, 93]], PushBox.STAND]],
            ['short-3', [[[169, 683, 126, 88], [27, 88]], PushBox.STAND]],
            ['short-4', [[[303, 682, 118, 89], [22, 89]], PushBox.STAND]],
            ['short-5', [[[429, 678, 67, 93], [15, 93]], PushBox.STAND]],
            ['short-6', [[[504, 685, 87, 86], [44, 86]], PushBox.STAND]],

            //23 heel to center
            ['forwardK-1', [[[16, 787, 87, 97], [44, 97]], PushBox.STAND]],
            ['forwardK-2', [[[111, 791, 60, 93], [8, 93]], PushBox.STAND]],
            ['forwardK-3', [[[179, 792, 121, 92], [18, 92]], PushBox.STAND]],
            ['forwardK-4', [[[308, 792, 117, 92], [14, 92]], PushBox.STAND]],
            ['forwardK-5', [[[433, 792, 114, 92], [11, 92]], PushBox.STAND]],
            ['forwardK-6', [[[555, 791, 92, 93], [8, 93]], PushBox.STAND]],
            ['forwardK-7', [[[655, 795, 61, 89], [31, 89]], PushBox.STAND]],
            ['forwardK-8', [[[724, 798, 87, 86], [44, 86]], PushBox.STAND]],

            // ['roundhouse-1', [[[], []], PushBox.STAND]],
            // ['roundhouse-2', [[[], []], PushBox.STAND]],
            // ['roundhouse-3', [[[], []], PushBox.STAND]],
            // ['roundhouse-4', [[[], []], PushBox.STAND]],
            // ['roundhouse-5', [[[], []], PushBox.STAND]],
            // ['roundhouse-6', [[[], []], PushBox.STAND]],
            // ['roundhouse-7', [[[], []], PushBox.STAND]],
            // ['roundhouse-8', [[[], []], PushBox.STAND]],
            // ['roundhouse-9', [[[], []], PushBox.STAND]],
            // ['roundhouse-10', [[[], []], PushBox.STAND]],

            //27 right toe to center
            ['hit-head-1', [[[16, 5086, 86, 84], [43, 84]], PushBox.STAND, HurtBox.STAND]],
            ['hit-head-2', [[[110, 5084, 92, 86], [43, 86]], PushBox.STAND, HurtBox.STAND]],
            ['hit-head-3', [[[210, 5085, 100, 85], [61, 85]], PushBox.STAND, HurtBox.STAND]],
            ['hit-head-4', [[[318, 5086, 103, 84], [65, 84]], PushBox.STAND, HurtBox.STAND]],

            //34 right toe to center
            ['hit-body-1', [[[429, 5087, 86, 83], [43, 83]], PushBox.STAND, HurtBox.STAND]],
            ['hit-body-2', [[[523, 5087, 81, 83], [46, 83]], PushBox.STAND, HurtBox.STAND]],
            ['hit-body-3', [[[612, 5088, 78, 82], [54, 82]], PushBox.STAND, HurtBox.STAND]],
            ['hit-body-4', [[[698, 5086, 83, 84], [65, 84]], PushBox.STAND, HurtBox.STAND]],
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
                ['jNeutral-1', 9], ['jNeutral-2', 4], ['jNeutral-3', 4],
                ['jNeutral-4', 4], ['jNeutral-5', 4], ['jNeutral-6', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_FORWARD]: [
                ['jNeutral-1', 6], ['jNeutral-2', 3], ['jRoll-5', 3],
                ['jRoll-4', 3], ['jRoll-3', 3], ['jRoll-2', 3],
                ['jRoll-1', FrameDelay.FREEZE],
            ],
            [FighterState.JUMP_BACKWARD]: [
                ['jRoll-1', 6], ['jRoll-2', 4], ['jRoll-3', 3],
                ['jRoll-4', 3], ['jRoll-5', 3], ['jRoll-6', 3],
                ['jRoll-7', FrameDelay.FREEZE],
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
                ['jab-1', 2], ['jab-2', 4], ['jab-3', 4], ['jab-4', 3], ['jab-5', FrameDelay.TRANSITION],
            ],
            [FighterState.SIX_PUNCH]: [
                ['strong-1', 1], ['strong-2', 2], ['strong-3', 4], ['strong-4', 3], ['strong-5', 3], ['strong-6', 3], ['strong-7', FrameDelay.TRANSITION],
            ],
            [FighterState.FOUR_PUNCH]: [
                ['ballet-1', 1], ['ballet-2', 2], ['ballet-3', 4],
                ['ballet-4', 3], ['ballet-5', 3], ['ballet-6', 3],
                ['ballet-7', 3], ['ballet-8', 3], ['ballet-9', 3],
                ['ballet-10', FrameDelay.TRANSITION],
            ],
            [FighterState.FIVE_KICK]: [
                ['short-1', 3], ['short-2', 3], ['short-3', 8], ['short-4', 4], ['short-5', 1], ['short-6', FrameDelay.TRANSITION],
            ],
            [FighterState.SIX_KICK]: [
                ['forwardK-1', 3], ['forwardK-2', 4], ['forwardK-3', 5],
                ['forwardK-4', 5], ['forwardK-5', 4], ['forwardK-6', 3],
                ['forwardK-7', 2], ['forwardK-8', FrameDelay.TRANSITION],
            ],
            [FighterState.HURT_HEAD_LIGHT]: [
                ['hit-head-1', FIGHTER_HURT_DELAY], ['hit-head-1', 3], ['hit-head-2', 8], ['hit-head-2', FrameDelay.TRANSITION],
            ],
            [FighterState.HURT_HEAD_MEDIUM]: [
                ['hit-head-1', FIGHTER_HURT_DELAY], ['hit-head-1', 3], ['hit-head-2', 4],
                ['hit-head-3', 9], ['hit-head-3', FrameDelay.TRANSITION],
            ],
            [FighterState.HURT_HEAD_HEAVY]: [
                ['hit-head-2', FIGHTER_HURT_DELAY], ['hit-head-2', 7], ['hit-head-3', 4],
                ['hit-head-4', 9], ['hit-head-4', FrameDelay.TRANSITION],
            ],
            [FighterState.HURT_BODY_LIGHT]: [
                ['hit-body-1', FIGHTER_HURT_DELAY], ['hit-body-1', 11],
                ['hit-body-1', FrameDelay.TRANSITION],
            ],
            [FighterState.HURT_BODY_MEDIUM]: [
                ['hit-body-1', FIGHTER_HURT_DELAY], ['hit-body-1', 7],
                ['hit-body-2', 9], ['hit-body-2', FrameDelay.TRANSITION],
            ],
            [FighterState.HURT_BODY_HEAVY]: [
                ['hit-body-2', FIGHTER_HURT_DELAY], ['hit-body-2', 3], ['hit-body-3', 4],
                ['hit-body-4', 4], ['hit-body-4', 9], ['hit-body-4', FrameDelay.TRANSITION],
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
    }
}
