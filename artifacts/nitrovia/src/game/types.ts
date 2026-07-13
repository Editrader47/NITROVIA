export type VehicleCategory =
  | "compact"
  | "muscle"
  | "suv"
  | "pickup"
  | "sport"
  | "hyper"
  | "classic"
  | "electric";

export interface VehicleStats {
  topSpeed: number; // world units / second
  acceleration: number; // units / second^2
  braking: number;
  handling: number; // turn rate radians/sec at low speed
  driftGrip: number; // 0..1, higher = easier to hold a drift
  nitroPower: number; // extra top speed multiplier while boosting
  mass: number; // affects collision response only
}

export interface VehicleDefinition {
  id: string;
  category: VehicleCategory;
  name: string;
  price: number;
  unlockLevel: number;
  color: string;
  accentColor: string;
  stats: VehicleStats;
  bodyStyle: "hatch" | "muscle" | "suv" | "pickup" | "sport" | "hyper" | "classic" | "electric";
}

export interface CharacterDefinition {
  id: string;
  name: string;
  gender: "male" | "female";
  skinTone: string;
  outfitColor: string;
  style: string;
}

export type GameScreen =
  | "menu"
  | "garage"
  | "character"
  | "modeSelect"
  | "playing"
  | "raceResults";

export type GameMode = "freeroam" | "race";

export interface RaceResult {
  position: number;
  totalRacers: number;
  timeSeconds: number;
  moneyEarned: number;
  xpEarned: number;
}
