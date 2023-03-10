import { FRAME_TIME } from "./game.js";

export const TIME_DELAY = 60 * FRAME_TIME;
export const TIME_FLASH_DELAY = 3 * FRAME_TIME;
export const TIME_FRAME_KEYS = ['time', 'time-flash'];
export const KO_FLASH_DELAY = [4 * FRAME_TIME, 7 * FRAME_TIME];
export const KO_ANIMATION = ['ko', 'ko2'];

export const MAX_HIT_POINTS = 30;
export const HEALTH_COLOR = '#F3F300';
export const HEALTH_DMG_COLOR = '#F30000';