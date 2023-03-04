import { Ken } from "./entities/fighters/Ken.js"
import { Karin } from "./entities/fighters/Karin.js"
import { Stage } from "./entities/Stage.js"
import { FpsCounter } from "./entities/FpsCounter.js";
import { STAGE_MID_POINT, STAGE_PADDING } from './constants/stage.js';
import { pollGamepads, registerGamepadEvents, registerKeyboardEvents } from "./InputHandler.js";
import { Hud } from "./entities/overlays/Hud.js";
import { Camera } from "./Camera.js";
import { getContext } from "./util/context.js";

export class UntitledCardGame {
    constructor() {
        this.context = getContext();
        this.fighters = [new Ken(0), new Karin(1)];

        this.fighters[0].opponent = this.fighters[1];
        this.fighters[1].opponent = this.fighters[0];

        this.camera = new Camera(STAGE_MID_POINT + STAGE_PADDING - (this.context.canvas.width/2), 0, this.fighters);
        
        this.entities = [
            new Stage(),
            ...this.fighters,
            new FpsCounter(),
            new Hud(this.fighters),
        ];
        
        this.frameTime = {
            previous: 0,
            secondsPassed: 0
        };
    }

    update() {
        this.camera.update(this.frameTime, this.context);

        for (const entity of this.entities) {
            entity.update(this.frameTime, this.context, this.camera);
        }
    }

    draw() {
        for (const entity of this.entities) {
            entity.draw(this.context, this.camera);
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