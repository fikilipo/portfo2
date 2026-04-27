import { useEra } from '../EraContext';

export function MuteToggle() {
  const { muted, setMuted } = useEra();
  return (
    <button
      type="button"
      onClick={() => setMuted(!muted)}
      className="fixed bottom-4 right-4 z-50 rounded-full border border-white/15 bg-black/60 px-3 py-2 text-xs font-mono text-white/80 backdrop-blur hover:bg-black/80"
      aria-pressed={!muted}
      title={muted ? 'Включить звук' : 'Выключить звук'}
    >
      {muted ? '🔇 SFX off' : '🔊 SFX on'}
    </button>
  );
}
