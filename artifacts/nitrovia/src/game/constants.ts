// Global world & simulation constants for NITROVIA.
// Keeping every tunable number here makes the driving feel easy to iterate on
// without hunting through controller/AI code.

export const WORLD_HALF_SIZE = 260; // world spans [-260, 260] on X and Z
export const BLOCK_SIZE = 40; // size of one city block (street grid pitch)
export const ROAD_WIDTH = 10;
export const AVENUE_WIDTH = 16;

export const GRAVITY = -28;
export const GROUND_Y = 0;

export const DAY_NIGHT_CYCLE_SECONDS = 360; // full day/night loop, fast enough to be seen

export const CHECKPOINT_RADIUS = 7;

export const MONEY_PER_POSITION = [600, 400, 250, 150] as const; // 1st..4th
export const XP_PER_RACE_FINISH = 120;
export const XP_PER_LEVEL = 400;

export const STORAGE_KEY = "nitrovia-save-v1";
