import { Ken } from "./entities/fighters/Ken.js"
import { Karin } from "./entities/fighters/Karin.js"
import { Stage } from "./entities/Stage.js"
import { FpsCounter } from "./entities/FpsCounter.js";
import { STAGE_MID_POINT, STAGE_PADDING } from './constants/stage.js';
import { pollGamepads, registerGamepadEvents, registerKeyboardEvents } from "./InputHandler.js";
import { HpTimer } from "./entities/overlays/HpTimer.js";
import { Camera } from "./Camera.js";
import { getContext } from "./util/context.js";
import { BattleScene } from "./scenes/BattleScene.js";

export class UntitledCardGame {
    context = getContext();

    frameTime = {
        previous: 0,
        secondsPassed: 0
    };

    constructor() {
        this.scene = new BattleScene();
    }


    frame(time) {
        window.requestAnimationFrame(this.frame.bind(this));

        this.frameTime = {
            secondsPassed: (time - this.frameTime.previous) / 1000,
            previous: time,
        }

        pollGamepads();
        this.scene.update(this.frameTime, this.context);
        this.scene.draw(this.context);

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