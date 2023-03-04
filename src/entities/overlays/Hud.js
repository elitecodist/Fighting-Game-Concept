import { TIME_DELAY, TIME_FLASH_DELAY } from "../../constants/battle.js";
import { drawFrame } from "../../util/context.js";

export class Hud {
    constructor(fighters) {
        this.healthpng = document.querySelector('img[alt="hp-bar"]');
        this.timerpng = document.querySelector('img[alt="timer"]');
        this.kopng = document.querySelector('img[alt="ko"]');

        this.time = 99;
        this.timeTimer = 0;
        this.fighters = fighters;

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
        const [{ name: name1 }, { name: name2 }] = this.fighters;
        this.names = [`${name1}-nametag`, `${name2}-nametag`]

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
            )
        {
            this.useFlashFrames = !this.useFlashFrames;
            this.timeFlashTimer = time.previous;
        }
    }

    update(time) {
        this.updateTime(time);
    }

    drawHpBars(context) {
        for (let i = 0; i < 10; i++) {
            this.drawFrame(context, this.healthpng, 'hpPurp', i*18 + 0, 0);
        }
        for (let i = 0; i < 10; i++) {
            this.drawFrame(context, this.healthpng, 'hpPurp', (384-18)-(i*18), 0);
        }
    }

    draw(context) {
        this.drawHpBars(context);

        
        const timeString = String(this.time).padStart(2, '00');

        this.drawFrame(context, this.timerpng, `timer${timeString.charAt(0)}`, 181, 0);
        this.drawFrame(context, this.timerpng, `timer${timeString.charAt(1)}`, 191, 0);
    }
}