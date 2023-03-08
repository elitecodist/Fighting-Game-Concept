import { MAX_HIT_POINTS, TIME_DELAY, TIME_FLASH_DELAY } from "../../constants/battle.js";
import { WINDOW_WIDTH } from "../../constants/window.js";
import { FPS } from "../../constants/game.js";
import { gameState } from "../../state/gameState.js";
import { drawFrame } from "../../util/context.js";

export class HpTimer {
    constructor() {
        this.healthpng = document.querySelector('img[alt="hp-bar"]');
        this.timerpng = document.querySelector('img[alt="timer"]');
        this.kopng = document.querySelector('img[alt="ko"]');

        this.time = 99;
        this.timeTimer = 0;

        this.hpBars = [{
            timer: 0,
            hitPoints: MAX_HIT_POINTS,
        }, {
            timer: 0,
            hitPoints: MAX_HIT_POINTS
        }]

        this.frames = new Map([
            ['hpPurp', [329, 195, 18, 13]],
            ['hpBlue', [329, 268, 18, 12]],
            ['hpGreen', [329, 340, 18, 13]],
            ['hpGray', [329, 413, 18, 13]],

            ['ko', [976, 196, 145, 132]],

            ['timer1', [119, 126, 12, 14]],
            ['timer2', [139, 126, 12, 14]],
            ['timer3', [159, 126, 12, 14]],
            ['timer4', [179, 126, 12, 14]],
            ['timer5', [199, 126, 12, 14]],
            ['timer6', [119, 156, 12, 14]],
            ['timer7', [139, 156, 12, 14]],
            ['timer8', [159, 156, 12, 14]],
            ['timer9', [179, 156, 12, 14]],
            ['timer0', [199, 156, 12, 14]],
        ]);

        //Name TAGS

        this.names = gameState.fighters.map(({ id }) => `tag-${id.toLowerCase()}`);

    }

    drawFrame(context, image, frameKey, x, y, direction = 1) {
        drawFrame(context, image, this.frames.get(frameKey), x, y, direction);
    }

    updateTime(time) {
        if (time.previous > this.timeTimer + TIME_DELAY) {
            if (this.time > 0) this.time -= 1; //?
            this.timeTimer = time.previous;
        }

        if (this.time < 15 && this.time > -1
            && time.previous > this.timeFlashTimer + TIME_FLASH_DELAY
        ) {
            this.useFlashFrames = !this.useFlashFrames;
            this.timeFlashTimer = time.previous;
        }
    }

    updateHpBars(time) {
        for (const index in this.hpBars) {
            if (this.hpBars[index].hitPoints <= gameState.fighters[index].maxHp) continue;
            this.hpBars[index].hitPoints = Math.max(0, this.hpBars[index].hitPoints - (time.secondsPassed * FPS));
        }
    }

    update(time) {
        this.updateTime(time);
        this.updateHpBars(time);
    }

    drawHpBars(context) {
        const missingHp1 = MAX_HIT_POINTS - this.hpBars[0].hitPoints;
        if (this.hpBars[0].hitPoints >= 20) {
            for (let i = 0; i < missingHp1; i++) {
                this.drawFrame(context, this.healthpng, 'hpBlue', i * 18, 0);
            }
            for (let i = missingHp1; i < 10; i++) {
                this.drawFrame(context, this.healthpng, 'hpPurp', i * 18, 0);
            }
        } else if (this.hpBars[0].hitPoints >= 10) {
            for (let i = 0; i < missingHp1-10; i++) {
                this.drawFrame(context, this.healthpng, 'hpGreen', i * 18, 0);
            }
            for (let i = missingHp1-10; i < 10; i++) {
                this.drawFrame(context, this.healthpng, 'hpBlue', i * 18, 0);
            }
        } else {
            for (let i = 0; i < missingHp1-20; i++) {
                this.drawFrame(context, this.healthpng, 'hpGray', i * 18, 0);
            }
            for (let i = missingHp1-20; i < 10; i++) {
                this.drawFrame(context, this.healthpng, 'hpGreen', i * 18, 0);
            }
        }

        const missingHp2 = MAX_HIT_POINTS - this.hpBars[1].hitPoints;
        if (this.hpBars[1].hitPoints >= 20) {
            for (let i = 0; i < missingHp2; i++) {
                this.drawFrame(context, this.healthpng, 'hpBlue', (WINDOW_WIDTH - 18) - (i * 18), 0);
            }
            for (let i = missingHp2; i < 10; i++) {
                this.drawFrame(context, this.healthpng, 'hpPurp', (WINDOW_WIDTH - 18) - (i * 18), 0);
            }
        } else if (this.hpBars[1].hitPoints >= 10) {
            for (let i = 0; i < missingHp2-10; i++) {
                this.drawFrame(context, this.healthpng, 'hpGreen', (WINDOW_WIDTH - 18) - (i * 18), 0);
            }
            for (let i = missingHp2-10; i < 10; i++) {
                this.drawFrame(context, this.healthpng, 'hpBlue', (WINDOW_WIDTH - 18) - (i * 18), 0);
            }
        } else {
            for (let i = 0; i < missingHp2-20; i++) {
                this.drawFrame(context, this.healthpng, 'hpGray', (WINDOW_WIDTH - 18) - (i * 18), 0);
            }
            for (let i = missingHp2-20; i < 10; i++) {
                this.drawFrame(context, this.healthpng, 'hpGreen', (WINDOW_WIDTH - 18) - (i * 18), 0);
            }
        }
    }

    draw(context) {
        this.drawHpBars(context);


        const timeString = String(this.time).padStart(2, '00');

        this.drawFrame(context, this.timerpng, `timer${timeString.charAt(0)}`, 181, 0);
        this.drawFrame(context, this.timerpng, `timer${timeString.charAt(1)}`, 191, 0);
    }
}