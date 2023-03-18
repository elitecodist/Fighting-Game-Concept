import {
    KO_ANIMATION, KO_FLASH_DELAY,
    MAX_HIT_POINTS, TIME_DELAY,
    TIME_FLASH_DELAY
} from "../../constants/battle.js";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "../../constants/settings.js";
import { FPS } from "../../constants/game.js";
import { gameState } from "../../state/gameState.js";
import { drawFrame } from "../../util/context.js";

export class Cards {

    p1inHand = 10;
    p1shuffleMeter = 0;

    animeFrame = 0;
    animeTimer = 0;

    frames = new Map([
        ['redC', [0, 0, 29, 36]],
        ['greenC', [29, 0, 29, 36]],
        ['blueC', [58, 0, 29, 36]],
    ]);
    constructor(fighters) {
        this.cardspng = document.querySelector('img[alt="cards"]');

        this.decks = [
            [
                'redC', 'redC', 'greenC', 'blueC', 'redC',
                'redC', 'redC', 'greenC', 'blueC', 'redC',
            ],
            []
        ]

        this.p1Hand = this.decks[0].slice(0,10);
        this.p1Pos = [0, 9]
        this.p1ActiveCard = this.p1Hand[this.p1Pos[0]]

        this.p2Hand = this.decks[1];
    }

    drawFrame(context, image, frameKey, x, y, direction = 1) {
        drawFrame(context, image, this.frames.get(frameKey), x, y, direction);
    }

    // updateTime(time) {
    //     if (time.previous > this.timeTimer + TIME_DELAY) {
    //         if (this.time > 0) this.time -= 1; //?
    //         this.timeTimer = time.previous;
    //     }

    //     if (this.time < 15 && this.time > -1
    //         && time.previous > this.timeFlashTimer + TIME_FLASH_DELAY
    //     ) {
    //         this.useFlashFrames = !this.useFlashFrames;
    //         this.timeFlashTimer = time.previous;
    //     }
    // }

    // updateHpBars(time) {
    //     for (const index in this.hpBars) {
    //         if (this.hpBars[index].hitPoints <= gameState.fighters[index].hitPoints) continue;
    //         this.hpBars[index].hitPoints = Math.max(0, gameState.fighters[index].hitPoints);
    //     }
    // }

    // updateKoIcon(time) {
    //     if (this.hpBars.every((hpBar) => hpBar.hitPoints > 0)) return;
    //     if (time.previous < this.koAnimationTimer + KO_FLASH_DELAY[this.koFrame]) return;

    //     this.koFrame = 1 - this.koFrame;
    //     this.koAnimationTimer = time.previous;
    // }

    update(time) {
        // this.updateTime(time);
        // this.updateCards(time);
        // this.updateKoIcon(time);
        return
    }

    drawP1Cards(context) {
        this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos[1]-1], -8, 164);//1
        this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos[1]], 5, 171);//2

        this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos[0]+2], 37, 199);//4
        this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos[0]+1], 27, 187);//3

        this.drawFrame(context, this.cardspng, this.p1ActiveCard, 17, 179);//active
    }

    draw(context) {
        this.drawP1Cards(context);



    }
}
