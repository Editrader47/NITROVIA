import { useGameStore } from "@/game/state/store";
import { MainMenu } from "@/game/screens/MainMenu";
import { Garage } from "@/game/screens/Garage";
import { CharacterSelect } from "@/game/screens/CharacterSelect";
import { ModeSelect } from "@/game/screens/ModeSelect";
import { RaceResults } from "@/game/screens/RaceResults";
import { GameScene } from "@/game/GameScene";

export function GameRoot() {
  const screen = useGameStore((s) => s.screen);

  switch (screen) {
    case "menu":
      return <MainMenu />;
    case "garage":
      return <Garage />;
    case "character":
      return <CharacterSelect />;
    case "modeSelect":
      return <ModeSelect />;
    case "playing":
      return <GameScene />;
    case "raceResults":
      return <RaceResults />;
    default:
      return <MainMenu />;
  }
}
