import { FpsCounter } from "../entities/FpsCounter.js";
import { HpTimer } from "../entities/overlays/HpTimer.js";
import { Camera } from "../Camera.js";
import { Ken } from "../entities/fighters/Ken.js";
import { Karin } from "../entities/fighters/Karin.js";
import { STAGE_MID_POINT, STAGE_PADDING } from "../constants/stage.js";
import { Stage } from "../entities/Stage.js";
import { gameState } from "../state/gameState.js";
import { FighterId } from "../constants/fighter.js";
import { Fighter } from "../entities/fighters/fighter.js";


export class BattleScene {
    fighters = [];
    camera = undefined;
    shadows = [];
    entities = [];

    constructor() {
        this.stage;

        this.fighters = this.getFighterEntities();
        // this.camera = new Camera(STAGE_MID_POINT + STAGE_PADDING - (this.context.canvas.width/2), 0, this.fighters);
        this.camera = new Camera(STAGE_MID_POINT + STAGE_PADDING - 192, 0, this.fighters);
        
        this.overlays = [
            new HpTimer(this.fighters),
            new FpsCounter(),
        ];

        this.entities = [
            new Stage()
        ]
    }

    getFighterEntityClass(id) {
        switch (id) {
            case FighterId.KEN:
                return Ken;
            case FighterId.KARIN:
                return Karin;
            default:
                throw new Error('entity request err')
        }
    }

    getFighterEntity = (fighterState, index) => {
        const FighterEntityClass = this.getFighterEntityClass(fighterState.id);
        return new FighterEntityClass(index);
    }

    getFighterEntities() {
        const fighterEntities = gameState.fighters.map(this.getFighterEntity);

        fighterEntities[0].opponent = fighterEntities[1];
        fighterEntities[1].opponent = fighterEntities[0];

        return fighterEntities;
    }

    updateFighters(time, context) {
        for (const fighter of this.fighters) {
            fighter.update(time, context, this.camera);
        }
    }

    updateEntities(time, context) {
        for (const entity of this.entities) {
            entity.update(time, context, this.camera);
        }
    }

    updateOverlays(time, context) {
        for (const overlay of this.overlays) {
            overlay.update(time, context, this.camera);
        }
    }

    update(time, context) {
        this.updateFighters(time, context);
        this.updateEntities(time, context);
        this.camera.update(time, context);
        this.updateOverlays(time, context);
    }

    drawFighters(context) {
        for (const fighter of this.fighters) {
            fighter.draw(context, this.camera);
        }
    }

    drawEntities(context) {
        for (const entity of this.entities) {
            entity.draw(context, this.camera);
        }
    }

    drawOverlays(context) {
        for (const overlay of this.overlays) {
            overlay.draw(context, this.camera);
        }
    }

    draw(context) {
        this.drawEntities(context);
        this.drawFighters(context);
        this.drawOverlays(context);
    }
}