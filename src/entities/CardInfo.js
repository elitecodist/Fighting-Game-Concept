export class CardInfo {
    constructor(fighters) {
        this.discard = fighters[0].discard.length;
        this.deck = fighters[0].deck.length;
        this.hand = fighters[0].hand.length - 2;
    }

    update(time, fighters) {
        this.discard = fighters[0].discard.length;
        this.deck = fighters[0].deck.length;
        this.hand = fighters[0].hand.length - 2;
    }

    draw(context) {
        context.font = "bold 14px Arial";
        context.fillStyle = "red";
        context.textAlign = "right";
        context.fillText(`DISCARD - ${this.discard}`, 176, 25);
        context.fillText(`DECK - ${this.deck}`, 176, 36);
        context.fillText(`HAND - ${this.hand}`, 145, 220);
    }
}
