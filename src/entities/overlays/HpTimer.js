import {
    KO_ANIMATION, KO_FLASH_DELAY,
    MAX_HIT_POINTS, TIME_DELAY,
    TIME_FLASH_DELAY
} from "../../constants/battle.js";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "../../constants/settings.js";
import { FPS } from "../../constants/game.js";
import { gameState } from "../../state/gameState.js";
import { drawFrame } from "../../util/context.js";

export class HpTimer {

    time = 99;
    timeTimer = 0;

    hpBars = [{
        timer: 0,
        hitPoints: MAX_HIT_POINTS,
    }, {
        timer: 0,
        hitPoints: MAX_HIT_POINTS
    }]

    koFrame = 0;
    koAnimeTimer = 0;

    frames = new Map([
        ['hpPurp', [329, 195, 18, 13]],
        ['hpBlue', [329, 268, 18, 12]],
        ['hpGreen', [329, 340, 18, 13]],
        ['hpGray', [329, 413, 18, 13]],

        ['ko', [0, 0, 110, 104]],
        ['ko2', [0, 0, 110, 104]],

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
    constructor() {
        this.healthpng = document.querySelector('img[alt="hp-bar"]');
        this.timerpng = document.querySelector('img[alt="timer"]');
        this.kopng = document.querySelector('img[alt="ko"]');
        this.kopng2 = document.querySelector('img[alt="ko2"]');
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
            if (this.hpBars[index].hitPoints <= gameState.fighters[index].hitPoints) continue;
            this.hpBars[index].hitPoints = Math.max(0, gameState.fighters[index].hitPoints);
        }
    }

    updateKoIcon(time) {
        if (this.hpBars.every((hpBar) => hpBar.hitPoints > 0)) return;
        if (time.previous < this.koAnimeTimer + KO_FLASH_DELAY[this.koFrame]) return;

        this.koFrame = 1 - this.koFrame;
        this.koAnimeTimer = time.previous;
    }

    update(time) {
        this.updateTime(time);
        this.updateHpBars(time);
        this.updateKoIcon(time);
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
            for (let i = 0; i < missingHp1 - 10; i++) {
                this.drawFrame(context, this.healthpng, 'hpGreen', i * 18, 0);
            }
            for (let i = missingHp1 - 10; i < 10; i++) {
                this.drawFrame(context, this.healthpng, 'hpBlue', i * 18, 0);
            }
        } else {
            for (let i = 0; i < missingHp1 - 20; i++) {
                this.drawFrame(context, this.healthpng, 'hpGray', i * 18, 0);
            }
            for (let i = missingHp1 - 20; i < 10; i++) {
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
            for (let i = 0; i < missingHp2 - 10; i++) {
                this.drawFrame(context, this.healthpng, 'hpGreen', (WINDOW_WIDTH - 18) - (i * 18), 0);
            }
            for (let i = missingHp2 - 10; i < 10; i++) {
                this.drawFrame(context, this.healthpng, 'hpBlue', (WINDOW_WIDTH - 18) - (i * 18), 0);
            }
        } else {
            for (let i = 0; i < missingHp2 - 20; i++) {
                this.drawFrame(context, this.healthpng, 'hpGray', (WINDOW_WIDTH - 18) - (i * 18), 0);
            }
            for (let i = missingHp2 - 20; i < 10; i++) {
                this.drawFrame(context, this.healthpng, 'hpGreen', (WINDOW_WIDTH - 18) - (i * 18), 0);
            }
        }

        if (missingHp1 >= 30) {
            switch (this.koFrame) {
                case 0:
                    this.drawFrame(context, this.kopng, KO_ANIMATION[this.koFrame], (WINDOW_WIDTH / 4), (WINDOW_HEIGHT / 2));
                    break;
                case 1:
                    this.drawFrame(context, this.kopng2, KO_ANIMATION[this.koFrame], (WINDOW_WIDTH / 4), (WINDOW_HEIGHT / 2));
                    break;
            }
        }
        if (missingHp2 >= 30) {
            switch (this.koFrame) {
                case 0:
                    this.drawFrame(context, this.kopng, KO_ANIMATION[this.koFrame], WINDOW_WIDTH - (WINDOW_WIDTH / 4), (WINDOW_HEIGHT / 2));
                    break;
                case 1:
                    this.drawFrame(context, this.kopng2, KO_ANIMATION[this.koFrame], WINDOW_WIDTH - (WINDOW_WIDTH / 4), (WINDOW_HEIGHT / 2));
                    break;
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