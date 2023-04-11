export class CardInfo {
    constructor(fighters) {
        this.discard = fighters[0].discard.length;
        this.deck = fighters[0].deck.length;
    }

    update(time, fighters) {
        this.discard = fighters[0].discard.length;
        this.deck = fighters[0].deck.length;
    }

    draw(context) {
        context.font = "bold 14px Arial";
        context.fillStyle = "red";
        context.textAlign = "right";
        context.fillText(`DISCARD - ${this.discard}`, 176, 25);
        context.fillText(`DECK - ${this.deck}`, 176, 36);
    }
}
