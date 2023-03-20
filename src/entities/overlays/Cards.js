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

        this.p1CardExpended = false;

        fighters[0].hand = this.p1Hand;
        fighters[0].handPos = this.p1Pos;
        fighters[0].activeCard = this.p1Hand[0];


    }

    drawFrame(context, image, frameKey, x, y, direction = 1) {
        drawFrame(context, image, this.frames.get(frameKey), x, y, direction);
    }

    updateCards(time, fighters) {
        this.p1CardExpended = false;

        //update properties from Fighter class
        if (this.p1Hand !== fighters[0].hand) {
            this.p1CardExpended = true;
            this.p1Hand = fighters[0].hand
        }
        this.p1Pos = fighters[0].handPos

        //update hand position
        if (control.isScrollR(0)) {
            if (this.p1Pos === this.p1Hand.length - 1) this.p1Pos = 0; else this.p1Pos += 1;
        }
        if (control.isScrollL(0)) if (this.p1Pos === 0) this.p1Pos = this.p1Hand.length - 1; else this.p1Pos -= 1;

        fighters[0].handPos = this.p1Pos;

        //update active card
        fighters[0].activeCard = this.p1Hand[this.p1Pos]

        console.log(this.p1Pos)
    }

    update(time, fighters) {
        this.updateCards(time, fighters);
        return
    }

    drawP1Cards(context) {


        let firstCard = '';
        let secondCard = '';
        let thirdCard = '';
        let fourthCard = '';

        try{
            firstCard = this.p1Hand[this.p1Pos - 2];
        } catch (error) {}
        try{
            secondCard = this.p1Hand[this.p1Pos - 1];
        } catch (error) {}
        try{
            thirdCard = this.p1Hand[this.p1Pos + 1];
        }catch (error) {}
        try{
            fourthCard = this.p1Hand[this.p1Pos + 2];
        }catch (error) {}

        this.drawFrame(context, this.cardspng, firstCard, -8, 164);//1
        this.drawFrame(context, this.cardspng, secondCard, 5, 171);//2
        this.drawFrame(context, this.cardspng, fourthCard, 37, 199);//4
        this.drawFrame(context, this.cardspng, thirdCard, 27, 187);//3
        this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos], 17, 179);//active

        // switch (this.p1Hand.length) {
        //     case 4:
        //         switch (this.p1Pos) {
        //             case 0:
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Hand.length - 2], -8, 164);//1
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Hand.length - 1], 5, 171);//2
        //                 //4
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos + 1], 27, 187);//3
        //                 break;
        //             case 1:
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Hand.length - 1], -8, 164);//1
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[0], 5, 171);//2
        //                 //4
        //                 //3
        //                 break;
        //             case 2:
        //                 //1
        //                 //2
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[0], 37, 199);//4
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Hand.length - 1], 27, 187);//3
        //                 break;
        //             case 3:
        //                 //1
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Hand.length - 2], 5, 171);//2
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[1], 37, 199);//4
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[0], 27, 187);//3
        //                 break;
        //         }
        //         break;
        //     case 3:
        //         switch (this.p1Pos) {
        //             case 0:
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Hand.length - 2], -8, 164);//1
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Hand.length - 1], 5, 171);//2
        //                 //4
        //                 //3
        //                 break;
        //             case 1:
        //                 //1
        //                 //2
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[0], 37, 199);//4
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Hand.length - 1], 27, 187);//3
        //                 break;
        //             case 2:
        //                 //1
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Hand.length - 2], 5, 171);//2
        //                 //4
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[0], 27, 187);//3
        //                 break;
        //         }
        //         break;
        //     case 2:
        //         switch (this.p1Pos) {
        //             case 0:
        //                 //1
        //                 //2
        //                 //4
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Hand.length - 1], 27, 187);//3
        //                 break;
        //             case 1:
        //                 //1
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Hand.length - 2], 5, 171);//2
        //                 break;
        //         }
        //         break;
        //     default:
        //         switch (this.p1Pos) {
        //             case 0:
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Hand.length - 2], -8, 164);//1
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Hand.length - 1], 5, 171);//2
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos + 2], 37, 199);//4
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos + 1], 27, 187);//3
        //                 break;
        //             case 1:
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Hand.length - 1], -8, 164);//1
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[0], 5, 171);//2
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos + 2], 37, 199);//4
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos + 1], 27, 187);//3
        //                 break;
        //             case (this.p1Hand.length - 2)://shuffleC
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos - 2], -8, 164);//1
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos - 1], 5, 171);//2
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[0], 37, 199);//4
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos + 1], 27, 187);//3
        //                 break;
        //             case (this.p1Hand.length - 1)://drawC
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos - 2], -8, 164);//1
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos - 1], 5, 171);//2
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[1], 37, 199);//4
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[0], 27, 187);//3
        //                 break;
        //             default:
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos - 2], -8, 164);//1
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos - 1], 5, 171);//2
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos + 2], 37, 199);//4
        //                 this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos + 1], 27, 187);//3
        //                 break;
        //         }
        // }
        if (this.p1Hand.length < 5) {

        } else {
            switch (this.p1Pos) {
                case 0://shuffleC
                    this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Hand.length - 2], -8, 164);//1
                    this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Hand.length - 1], 5, 171);//2
                    this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos + 2], 37, 199);//4
                    this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos + 1], 27, 187);//3
                    break;
                case 1://drawC
                    this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Hand.length - 1], -8, 164);//1
                    this.drawFrame(context, this.cardspng, this.p1Hand[0], 5, 171);//2
                    this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos + 2], 37, 199);//4
                    this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos + 1], 27, 187);//3
                    break;
                case (this.p1Hand.length - 2):
                    this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos - 2], -8, 164);//1
                    this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos - 1], 5, 171);//2
                    this.drawFrame(context, this.cardspng, this.p1Hand[0], 37, 199);//4
                    this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos + 1], 27, 187);//3
                    break;
                case (this.p1Hand.length - 1):
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
        }
        this.drawFrame(context, this.cardspng, this.p1Hand[this.p1Pos], 17, 179);//active
    }

    draw(context) {
        this.drawP1Cards(context);



    }
}
