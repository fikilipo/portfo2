import { EraProvider, useEra } from "./context/EraContext";
import { Hud } from "./components/Hud";
import { GlitchTransition } from "./components/GlitchTransition";
import { CustomCursor } from "./components/CustomCursor";
import { KonamiListener } from "./components/KonamiListener";
import { CommandPalette } from "./components/CommandPalette";
import { Boot } from "./scenes/Boot";
import { EraWild } from "./scenes/EraWild";
import { EraWeb2 } from "./scenes/EraWeb2";
import { EraEco } from "./scenes/EraEco";
import { Outro } from "./scenes/Outro";

function CurrentScene() {
  const { era } = useEra();
  switch (era) {
    case "boot":
      return <Boot />;
    case "wild":
      return <EraWild />;
    case "web2":
      return <EraWeb2 />;
    case "eco":
      return <EraEco />;
    case "outro":
      return <Outro />;
    default:
      return null;
  }
}

function ChromeAndScene() {
  const { era } = useEra();
  return (
    <>
      {era !== "boot" && <Hud />}
      <CustomCursor />
      <KonamiListener />
      <CommandPalette />
      <GlitchTransition />
      <CurrentScene />
    </>
  );
}

export default function App() {
  return (
    <EraProvider>
      <ChromeAndScene />
    </EraProvider>
  );
}
