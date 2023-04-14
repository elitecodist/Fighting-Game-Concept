import { TIME_DELAY, KO_FLASH_DELAY } from "../../constants/battle.js";
import { FrameDelay } from "../../constants/fighter.js";
import { FRAME_TIME } from "../../constants/game.js";
import * as control from "../../engine/inputHandler.js";
import { gameState } from "../../state/gameState.js";
import { drawFrame } from "../../util/context.js";
import { playSound } from "../../engine/soundHandler.js";
import { VOLUME } from "../../constants/settings.js";

export class Cards {

    // time = 0;
    // animeTimer = 0;

    cardSounds = {
        'scroll': document.querySelector('audio#scroll'),
    };

    frames = new Map([
        ['redC', [0, 0, 29, 36]],
        ['greenC', [29, 0, 29, 36]],
        ['blueC', [58, 0, 29, 36]],
        ['drawC', [87, 0, 29, 36]],
        ['shuffleC', [116, 0, 29, 36]],
    ]);
    constructor(fighters) {
        this.cardspng = document.querySelector('img[alt="cards"]');

        this.p1inHand = 10;
        this.p1shuffleMeter = 0;

        this.p1FirstCard = '';
        this.p1SecondCard = '';
        this.p1ThirdCard = '';
        this.p1FourthCard = '';
        this.p1ScrollLAnime = false;
        this.p1ScrollRAnime = false;
        this.p1IsInSleightCombo = fighters[0].isInSleightCombo;

        this.p2FirstCard = '';
        this.p2SecondCard = '';
        this.p2ThirdCard = '';
        this.p2FourthCard = '';

        this.p1Hand = fighters[0].deck.slice(0, 10);
        fighters[0].deck.splice(0, 10);
        this.p1Hand.unshift('shuffleC', 'drawC');
        this.p1Pos = 2;
        this.p1Sleight = [];
        this.p1Discard = [];

        this.p1CardExpended = false;

        fighters[0].hand = this.p1Hand;
        fighters[0].handPos = this.p1Pos;
        fighters[0].activeCard = this.p1Hand[this.p1Pos]
        this.p1ActiveCard = this.p1Hand[this.p1Pos]
        fighters[0].sleight = this.p1Sleight;
        fighters[0].discard = this.p1Discard;


    }

    drawFrame(context, image, frameKey, x, y, direction = 1) {
        drawFrame(context, image, this.frames.get(frameKey), x, y, direction);
    }

    // updateAnimeTimer(time) {
    //     if (time.previous < this.animeTimer + 5 * FRAME_TIME) return;
    //     this.animeTimer = time.previous;
    // }

    p1UpdateCards(time, context, fighters) {
        this.p1CardExpended = false;

        //update properties changed in Fighter class
        this.p1Hand = fighters[0].hand;
        this.p1Pos = fighters[0].handPos;
        this.p1Sleight = fighters[0].sleight;
        this.p1Discard = fighters[0].discard;
        this.p1IsInSleightCombo = fighters[0].isInSleightCombo;

        //update hand position
        if (!control.isSleight(0)) {
            if (control.isScrollL(0)) {
                if (this.p1Pos === 0) this.p1Pos = this.p1Hand.length - 1; else this.p1Pos -= 1;
                this.p1ScrollLAnime = true;
                playSound(this.cardSounds['scroll'], VOLUME);
            }
            if (control.isScrollR(0)) {
                if (this.p1Pos === this.p1Hand.length - 1) this.p1Pos = 0; else this.p1Pos += 1;
                this.p1ScrollRAnime = true;
                playSound(this.cardSounds['scroll'], VOLUME);
            }
        }
        fighters[0].handPos = this.p1Pos;

        //update active card in Fighter/Cards Class
        this.p1ActiveCard = this.p1Hand[this.p1Pos]
        fighters[0].activeCard = this.p1Hand[this.p1Pos]

        //update misc
        fighters[0].hand = this.p1Hand;
        fighters[0].sleight = this.p1Sleight;
        fighters[0].discard = this.p1Discard;

    }

    update(time, context, fighters) {
        // this.updateAnimeTimer(time);
        this.p1UpdateCards(time, context, fighters);
        return
    }

    assignCards(context, playerHand, playerPos) {

        switch (playerPos - 2) {
            case -2:
                this.p1FirstCard = playerHand[playerHand.length - 2];
                break;
            case -1:
                this.p1FirstCard = playerHand[playerHand.length - 1];
                break;
            default:
                this.p1FirstCard = playerHand[playerPos - 2];
        }
        switch (playerPos - 1) {
            case -1:
                this.p1SecondCard = playerHand[playerHand.length - 1];
                break;
            default:
                this.p1SecondCard = playerHand[playerPos - 1];
        }
        switch (playerPos + 1) {
            case playerHand.length:
                this.p1ThirdCard = playerHand[0];
                break;
            default:
                this.p1ThirdCard = playerHand[playerPos + 1];
        }
        switch (playerPos + 2) {
            case playerHand.length:
                this.p1FourthCard = playerHand[0];
                break;
            case playerHand.length + 1:
                this.p1FourthCard = playerHand[1];
                break;
            default:
                this.p1FourthCard = playerHand[playerPos + 2];
        }
    }

    drawP1Cards(context) {

        for (let i = 0; i < this.p1Sleight.length; i++) {
            if (this.p1IsInSleightCombo) {
                context.scale(0.75, 0.75)
                this.drawFrame(context, this.cardspng, this.p1Sleight[i], 35 * i + 10 + 200, 50);
            } else {
                context.scale(0.75, 0.75)
                this.drawFrame(context, this.cardspng, this.p1Sleight[i], 35 * i + 10, 20);
            }
        }

        if (this.p1ScrollLAnime) {
            //transition anime
            this.drawFrame(context, this.cardspng, this.p1FirstCard, -2, 168);//1
            this.drawFrame(context, this.cardspng, this.p1SecondCard, 11, 175);//2
            this.drawFrame(context, this.cardspng, this.p1FourthCard, 40, 203);//4
            this.drawFrame(context, this.cardspng, this.p1ThirdCard, 32, 193);//3
            this.drawFrame(context, this.cardspng, this.p1ActiveCard, 22, 183);//active

            this.p1ScrollLAnime = false;
            //include delay timer here if necessary
            return;
        }
        if (this.p1ScrollRAnime) {
            //transition anime
            this.drawFrame(context, this.cardspng, this.p1FirstCard, -14, 162);//1
            this.drawFrame(context, this.cardspng, this.p1SecondCard, -2, 168);//2
            this.drawFrame(context, this.cardspng, this.p1FourthCard, 32, 193);//4
            this.drawFrame(context, this.cardspng, this.p1ThirdCard, 22, 183);//3
            this.drawFrame(context, this.cardspng, this.p1ActiveCard, 11, 175);//active

            this.p1ScrollRAnime = false;
            //include delay timer here if necessary
            return;
        }

        this.assignCards(context, this.p1Hand, this.p1Pos);

        this.drawFrame(context, this.cardspng, this.p1FirstCard, -8, 164);//1
        this.drawFrame(context, this.cardspng, this.p1SecondCard, 5, 171);//2
        this.drawFrame(context, this.cardspng, this.p1FourthCard, 37, 199);//4
        this.drawFrame(context, this.cardspng, this.p1ThirdCard, 27, 187);//3
        this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos], 17, 179);//active
    }

    draw(context) {
        this.drawP1Cards(context);



    }
}
