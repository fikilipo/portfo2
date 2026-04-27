import { useState } from 'react';
import { EraProvider, useEra } from './EraContext';
import { EraSwitcher } from './components/EraSwitcher';
import { GlitchTransition } from './components/GlitchTransition';
import { MuteToggle } from './components/MuteToggle';
import { BootScreen } from './components/BootScreen';
import { Era1WildWest } from './eras/Era1WildWest';
import { Era2GoldenAge } from './eras/Era2GoldenAge';
import { Era3Ecosystem } from './eras/Era3Ecosystem';

export default function App() {
  const [booted, setBooted] = useState(false);
  return (
    <EraProvider>
      {!booted && <BootScreen onDone={() => setBooted(true)} />}
      <EraSwitcher />
      <Stage />
      <MuteToggle />
      <GlitchTransition />
    </EraProvider>
  );
}

function Stage() {
  const { era } = useEra();
  if (era === 1) return <Era1WildWest />;
  if (era === 2) return <Era2GoldenAge />;
  return <Era3Ecosystem />;
}
