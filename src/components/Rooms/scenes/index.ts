import { BibliotecaScene } from './BibliotecaScene';
import { CosmicoScene } from './CosmicoScene';
import { CyberpunkScene } from './CyberpunkScene';
import { LareiraScene } from './LareiraScene';
import { LofiScene } from './LofiScene';
import { FlorestaScene } from './FlorestaScene';

export const SCENES: Record<string, React.ComponentType> = {
  'biblioteca': BibliotecaScene,
  'cosmico': CosmicoScene,
  'cyberpunk': CyberpunkScene,
  'lareira': LareiraScene,
  'lofi': LofiScene,
  'floresta': FlorestaScene,
};

export { BibliotecaScene, CosmicoScene, CyberpunkScene, LareiraScene, LofiScene, FlorestaScene };
