import type { CharacterDefinition } from "@/game/types";

// Cosmetic driver profiles. The driver is not rendered on-track (the camera
// follows the car), but the choice is shown in the garage/HUD profile card
// and is wired up for future third-person / character-customization work.
export const CHARACTERS: CharacterDefinition[] = [
  { id: "kai", name: "Kai", gender: "male", skinTone: "#c68863", outfitColor: "#1d4ed8", style: "Street Racer" },
  { id: "mika", name: "Mika", gender: "female", skinTone: "#e0ac69", outfitColor: "#db2777", style: "Night Runner" },
  { id: "dario", name: "Dario", gender: "male", skinTone: "#8d5524", outfitColor: "#f59e0b", style: "Drift King" },
  { id: "luna", name: "Luna", gender: "female", skinTone: "#f1c27d", outfitColor: "#7c3aed", style: "Speed Queen" },
  { id: "remy", name: "Remy", gender: "male", skinTone: "#ffdbac", outfitColor: "#16a34a", style: "Underground" },
  { id: "sofia", name: "Sofia", gender: "female", skinTone: "#c68863", outfitColor: "#0891b2", style: "Circuit Pro" },
];

export function getCharacterById(id: string): CharacterDefinition {
  const character = CHARACTERS.find((c) => c.id === id);
  if (!character) {
    throw new Error(`Unknown character id: ${id}`);
  }
  return character;
}
