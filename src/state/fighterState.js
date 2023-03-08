import { MAX_HIT_POINTS } from "../constants/battle.js";

export const createDefaultFighterState = (id) => ({
    id,
    score: 1,
    battles: 0,
    maxHp: MAX_HIT_POINTS
});