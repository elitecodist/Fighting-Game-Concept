import { MAX_HIT_POINTS } from "../constants/battle.js";

export const createDefaultFighterState = (id) => ({
    id,
    score: 1,
    battles: 0,
    hitPoints: MAX_HIT_POINTS
});