import { VOLUME } from "../constants/settings.js";
import { playSound } from "../engine/soundHandler.js";
import { drawFrame } from "../util/context.js";

export class Stage {
    constructor(){
        this.image = document.querySelector('img[alt="background"]');
        
        this.music = document.querySelector('audio#hypeboi');
        playSound(this.music, VOLUME);
        // playSound(this.music, 0);

        this.frames = new Map([
            ['background', [0, 0, 621, 240]]
        ])
    }

    update () {
        
    }

    drawFrame(context, frameKey, x, y) {
        drawFrame(context, this.image, this.frames.get(frameKey), x, y);
    }
    
    draw(context, camera) {
        this.drawFrame(context, 'background', -camera.position.x, -camera.position.y);
        // this.drawFrame(context, 'background', -120, 0);
    }
}

