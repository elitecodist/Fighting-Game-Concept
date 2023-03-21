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

        this.p1Hand = fighters[0].deck.slice(0, 10);
        this.p1Hand.unshift('shuffleC', 'drawC');
        this.p1Pos = 2;
        this.p1Sleight = [];

        this.p1CardExpended = false;

        fighters[0].hand = this.p1Hand;
        fighters[0].handPos = this.p1Pos;
        fighters[0].activeCard = this.p1Hand[this.p1Pos]
        fighters[0].sleight = this.p1Sleight;


    }

    drawFrame(context, image, frameKey, x, y, direction = 1) {
        drawFrame(context, image, this.frames.get(frameKey), x, y, direction);
    }

    updateCards(time, fighters) {
        this.p1CardExpended = false;

        //update properties changed in Fighter class
        this.p1Pos = fighters[0].handPos
        this.p1Sleight = fighters[0].sleight

        //update hand position
        if (control.isScrollR(0)) {
            if (this.p1Pos === this.p1Hand.length - 1) this.p1Pos = 0; else this.p1Pos += 1;
        }
        if (control.isScrollL(0)) {
            if (this.p1Pos === 0) this.p1Pos = this.p1Hand.length - 1; else this.p1Pos -= 1;
        }
        fighters[0].handPos = this.p1Pos;

        //update active card
        fighters[0].activeCard = this.p1Hand[this.p1Pos]

        //update sleights
        fighters[0].sleight = this.p1Sleight

        console.log(this.p1Pos)
        console.log(this.p1Hand)
    }

    update(time, fighters) {
        this.updateCards(time, fighters);
        return
    }

    assignCards(context, playerHand, playerPos) {

        let firstCard = '';
        let secondCard = '';
        let thirdCard = '';
        let fourthCard = '';

        switch (playerPos - 2) {
            case -2:
                firstCard = playerHand[playerHand.length - 2];
                break;
            case -1:
                firstCard = playerHand[playerHand.length - 1];
                break;
            default:
                firstCard = playerHand[playerPos - 2];
        }
        switch (playerPos - 1) {
            case -1:
                secondCard = playerHand[playerHand.length - 1];
                break;
            default:
                secondCard = playerHand[playerPos - 1];
        }
        switch (playerPos + 1) {
            case playerHand.length:
                thirdCard = playerHand[0];
                break;
            default:
                thirdCard = playerHand[playerPos + 1];
        }
        switch (playerPos + 2) {
            case playerHand.length:
                fourthCard = playerHand[0];
                break;
            case playerHand.length + 1:
                fourthCard = playerHand[1];
                break;
            default:
                fourthCard = playerHand[playerPos + 2];
        }

        return [firstCard, secondCard, thirdCard, fourthCard];
    }

    drawP1Cards(context) {

        const [firstCard, secondCard, thirdCard, fourthCard] = this.assignCards(context, this.p1Hand, this.p1Pos);

        this.drawFrame(context, this.cardspng, firstCard, -8, 164);//1
        this.drawFrame(context, this.cardspng, secondCard, 5, 171);//2
        this.drawFrame(context, this.cardspng, fourthCard, 37, 199);//4
        this.drawFrame(context, this.cardspng, thirdCard, 27, 187);//3
        this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos], 17, 179);//active

        for (let i = 0; i < this.p1Sleight.length; i++) {
            context.scale(0.75, 0.75)
            this.drawFrame(context, this.cardspng, this.p1Sleight[i], 35 * i + 10, 20);//1
        }
    }

    draw(context) {
        this.drawP1Cards(context);



    }
}
