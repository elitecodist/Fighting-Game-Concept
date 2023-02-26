import { Ken } from "./entities/fighters/Ken.js"
import { Karin } from "./entities/fighters/Karin.js"
import { Stage } from "./entities/Stage.js"
import { FpsCounter } from "./entities/FpsCounter.js";
import { STAGE_FLOOR } from './constants/stage.js';
import { FighterDirection } from "./constants/fighter.js";
import { pollGamepads, registerGamepadEvents, registerKeyboardEvents } from "./InputHandler.js";

export class UntitledCardGame {
    constructor() {
        this.context = this.getContext();
        this.fighters = [
            new Ken(104, STAGE_FLOOR, FighterDirection.RIGHT, 0),
            new Karin(280, STAGE_FLOOR, FighterDirection.LEFT, 1),
        ];
        
        this.entities = [
            new Stage(),
            ...this.fighters,
            new FpsCounter()
        ];
        
        this.frameTime = {
            previous: 0,
            secondsPassed: 0
        };
    }

    getContext() {
        const canvasElem = document.querySelector('canvas');
        const context = canvasElem.getContext('2d');
        
        context.imageSmoothingEnabled = false;

        return context;
    }

    update() {
        for (const entity of this.entities) {
            entity.update(this.frameTime, this.context);
        }
    }

    draw() {
        for (const entity of this.entities) {
            entity.draw(this.context)
        }
    }

    frame(time) {
        window.requestAnimationFrame(this.frame.bind(this));

        this.frameTime = {
            secondsPassed: (time - this.frameTime.previous) / 1000,
            previous: time,
        }

        pollGamepads();
        this.update();
        this.draw();

    }

    // handleFormSubmit(event) {
    //     event.preventDefault();

    //     const selectedCheckboxes = Array
    //         .from(event.target.querySelectorAll('input:checked'))
    //         .map(checkbox => checkbox.value);

    //     const options = event.target.querySelector('select');

    //     this.fighters.forEach(fighter => {
    //         if (selectedCheckboxes.includes(fighter.name)) {
    //             fighter.changeState(options.value);
    //         }
    //     })
    // }

    start() {
        // document.addEventListener('submit', this.handleFormSubmit.bind(this));
    
        registerKeyboardEvents();
        registerGamepadEvents();

        window.requestAnimationFrame(this.frame.bind(this));
    }

}