import { Ken } from "./entities/fighters/ken.js"
import { Karin } from "./entities/fighters/karin.js"
import { Stage } from "./entities/stage.js"
import { FpsCounter } from "./entities/fpsCounter.js";
import { STAGE_FLOOR } from './constants/stage.js';

const GameViewport = {
    WIDTH: 384,
    HEIGHT: 224,
};

window.addEventListener('load', function() {
    const canvasElem = document.querySelector('canvas');
    const context = canvasElem.getContext('2d');

    canvasElem.width = GameViewport.WIDTH;
    canvasElem.height = GameViewport.HEIGHT;

    const entities = [
        new Stage(),
        new Ken(80,STAGE_FLOOR,150),
        new Karin(80,STAGE_FLOOR,-150),
        new FpsCounter()
    ];

    let frameTime = {
        previous: 0,
        secondsPassed: 0
    };

    

    function frame(time) {
        window.requestAnimationFrame(frame);

        frameTime = {
            secondsPassed: (time - frameTime.previous) / 1000,
            previous: time,
        }

        for (const entity of entities) {
            entity.update(frameTime, context);
        }
        for (const entity of entities) {
            entity.draw(context);
        }

    }
    window.requestAnimationFrame(frame);

})