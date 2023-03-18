import * as control from "../../engine/inputHandler.js";
import { gameState } from "../../state/gameState.js";
import { drawFrame } from "../../util/context.js";

export class Cards {

    animeFrame = 0;
    animeTimer = 0;

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

        this.p1Hand = fighters[0].deck.slice(0,10);
        this.p1Hand.push('shuffleC', 'drawC');
        this.p1Pos = 0
        fighters[0].activeCard = this.p1Hand[0]
    }

    drawFrame(context, image, frameKey, x, y, direction = 1) {
        drawFrame(context, image, this.frames.get(frameKey), x, y, direction);
    }

    updateCards(time, fighters) {
        //update hand position
        if(control.isScrollR(0)) if(this.p1Pos === this.p1Hand.length - 1) this.p1Pos = 0; else this.p1Pos += 1;
        if(control.isScrollL(0)) if(this.p1Pos === 0) this.p1Pos = this.p1Hand.length - 1; else this.p1Pos -= 1;

        //update active card
        fighters[0].activeCard = this.p1Hand[this.p1Pos]
    }

    update(time, fighters) {
        this.updateCards(time, fighters);
        return
    }

    drawP1Cards(context) {

        switch (this.p1Pos){
            case 0:
                this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Hand.length - 2], -8, 164);//1
                this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Hand.length - 1], 5, 171);//2
                this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos + 2], 37, 199);//4
                this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos + 1], 27, 187);//3
                break;
            case 1:
                this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Hand.length - 1], -8, 164);//1
                this.drawFrame(context, this.cardspng, this.p1Hand[0], 5, 171);//2
                this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos + 2], 37, 199);//4
                this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos + 1], 27, 187);//3
                break;
            case (this.p1Hand.length - 2)://shuffleC
                this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos - 2], -8, 164);//1
                this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos - 1], 5, 171);//2
                this.drawFrame(context, this.cardspng, this.p1Hand[0], 37, 199);//4
                this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos + 1], 27, 187);//3
                break;
            case (this.p1Hand.length - 1)://drawC
                this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos - 2], -8, 164);//1
                this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos - 1], 5, 171);//2
                this.drawFrame(context, this.cardspng, this.p1Hand[1], 37, 199);//4
                this.drawFrame(context, this.cardspng, this.p1Hand[0], 27, 187);//3
                break;
            default:
                this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos - 2], -8, 164);//1
                this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos - 1], 5, 171);//2
                this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos + 2], 37, 199);//4
                this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos + 1], 27, 187);//3
                break;
        }

        this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos], 17, 179);//active
    }

    draw(context) {
        this.drawP1Cards(context);



    }
}
