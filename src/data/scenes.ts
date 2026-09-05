import { SceneConfig } from '@/types';
import scenesData from '../../SCENES.json';

export const SCENES: SceneConfig[] = scenesData as SceneConfig[];

export function getActiveScene(progress: number): SceneConfig {
  const current = SCENES.find(
    (scene) => progress >= scene.scrollRange[0] && progress <= scene.scrollRange[1]
  );
  return current || SCENES[0];
}
