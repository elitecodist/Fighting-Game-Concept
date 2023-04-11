import { FpsCounter } from "../entities/FpsCounter.js";
import { HpTimer } from "../entities/overlays/HpTimer.js";
import { Cards } from "../entities/overlays/Cards.js";
import { Camera } from "../engine/Camera.js"
import { Ken, Karin } from "../entities/fighters/index.js";
import { STAGE_MID_POINT, STAGE_PADDING } from "../constants/stage.js";
import { Stage } from "../entities/Stage.js";
import { gameState } from "../state/gameState.js";
import { FighterAttackStrength, FighterId, FighterAttackBaseData, FIGHTER_HURT_DELAY } from "../constants/fighter.js";
import { LightHitSplash, MedHitSplash, HeavyHitSplash } from "../entities/effects/index.js";
import { FRAME_TIME } from "../constants/game.js";
import { CardInfo } from "../entities/CardInfo.js";

export class BattleScene {
    fighters = [];
    camera = undefined;
    shadows = [];
    entities = [];
    overlays = [];
    hurtTimer = undefined;
    fighterDrawOrder = [0, 1];

    constructor() {
        this.stage = new Stage()

        // this.entities = [];

        this.startRound();
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
        return new FighterEntityClass(index, this.handleAttHit.bind(this), this.addEntity.bind(this));
    }

    getFighterEntities() {
        const fighterEntities = gameState.fighters.map(this.getFighterEntity);

        fighterEntities[0].opponent = fighterEntities[1];
        fighterEntities[1].opponent = fighterEntities[0];

        return fighterEntities;
    }

    getHitSplashClass(strength) {
        switch (strength) {
            case FighterAttackStrength.LIGHT:
                return LightHitSplash;
            case FighterAttackStrength.MEDIUM:
                return MedHitSplash;
            case FighterAttackStrength.HEAVY:
                return HeavyHitSplash;
            default:
                throw new Error('unknown attack strength requested');
        }
    }

    addEntity(EntityClass, ...args) {
        this.entities.push(new EntityClass(...args, this.removeEntity));
    }
    removeEntity = (entity) => {
        const index = this.entities.indexOf(entity);

        if (index < 0) return;
        this.entities.splice(index, 1);
    }

    startRound() {
        this.fighters = this.getFighterEntities();

        this.overlays = [
            new HpTimer(this.fighters),
            new Cards(this.fighters),
            new CardInfo(this.fighters),
            new FpsCounter(),
        ];

        // this.camera = new Camera(STAGE_MID_POINT + STAGE_PADDING - (this.context.canvas.width/2), 0, this.fighters);
        this.camera = new Camera(STAGE_MID_POINT + STAGE_PADDING - 192, 0, this.fighters);
    }

    handleAttHit(time, playerId, opponentId, position, strength){
        gameState.fighters[opponentId].hitPoints -= FighterAttackBaseData[strength].damage;

        this.hurtTimer = time.previous + (FIGHTER_HURT_DELAY * FRAME_TIME);
        this.fighterDrawOrder = [opponentId, playerId];
        this.addEntity(this.getHitSplashClass(strength), position.x, position.y, playerId);
    }

    updateFighters(time, context) {
        for (const fighter of this.fighters) {
            if (time.previous < this.hurtTimer) {
                fighter.updateHurtShake(time, this.hurtTimer);
            } else {
                fighter.update(time, context, this.camera);
            }
        }
    }

    updateEntities(time, context) {
        for (const entity of this.entities) {
            entity.update(time, context, this.camera);
        }
    }

    updateOverlays(time, context) {
        for (const overlay of this.overlays) {
            if (overlay.constructor.name === "Cards")
                overlay.update(time, context, this.fighters);
            else if (overlay.constructor.name === "CardInfo")
                overlay.update(time, this.fighters, context);
            else
                overlay.update(time, context, this.camera);
        }
    }

    update(time, context) {
        this.updateFighters(time, context);
        this.updateEntities(time, context);
        this.camera.update(time, context);
        this.updateOverlays(time, context);
    }

    drawStage(context) {
        this.stage.draw(context, this.camera);
    }

    drawFighters(context) {
        for (const fighterId of this.fighterDrawOrder) {
            this.fighters[fighterId].draw(context, this.camera);
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
        this.drawStage(context);
        this.drawFighters(context);
        this.drawEntities(context);
        this.drawOverlays(context);
    }
}