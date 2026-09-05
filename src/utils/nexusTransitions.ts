import { CharacterState } from '@/types';

export type ModelType = 'human' | 'hybrid' | 'android';

export interface CharacterTransitionData {
  activeState: CharacterState;
  previousState: CharacterState | null;
  nextState: CharacterState | null;
  primaryModel: ModelType;
  secondaryModel: ModelType | null;
  dissolveProgress: number; // 0.0 to 1.0 for crossfade/dissolve shader
  localProgress: number;    // 0.0 to 1.0 normalized within current scroll boundary
}

/**
 * NEXUS Character Transformation Machine (Pure Function)
 * 
 * Evaluates global scroll progress (0.00 -> 1.00) without React state triggers or GC allocations.
 * Used inside useFrame tick loop to drive model visibilities and material dissolve uniforms.
 */
export function getCharacterTransition(scrollProgress: number): CharacterTransitionData {
  const p = Math.max(0, Math.min(1, scrollProgress));

  if (p < 0.15) {
    const localProgress = p / 0.15;
    return {
      activeState: '01_HUMAN',
      previousState: null,
      nextState: '02_SKIN_REVEAL',
      primaryModel: 'human',
      secondaryModel: null,
      dissolveProgress: 0,
      localProgress,
    };
  } else if (p < 0.32) {
    const localProgress = (p - 0.15) / 0.17;
    return {
      activeState: '02_SKIN_REVEAL',
      previousState: '01_HUMAN',
      nextState: '03_HYBRID',
      primaryModel: 'human',
      secondaryModel: 'hybrid',
      dissolveProgress: localProgress,
      localProgress,
    };
  } else if (p < 0.50) {
    const localProgress = (p - 0.32) / 0.18;
    return {
      activeState: '03_HYBRID',
      previousState: '02_SKIN_REVEAL',
      nextState: '04_ANDROID',
      primaryModel: 'hybrid',
      secondaryModel: null,
      dissolveProgress: 0,
      localProgress,
    };
  } else if (p < 0.88) {
    const localProgress = (p - 0.50) / 0.38;
    return {
      activeState: '04_ANDROID',
      previousState: '03_HYBRID',
      nextState: '05_NEXUS_FINAL',
      primaryModel: 'hybrid',
      secondaryModel: 'android',
      dissolveProgress: localProgress,
      localProgress,
    };
  } else {
    const localProgress = (p - 0.88) / 0.12;
    return {
      activeState: '05_NEXUS_FINAL',
      previousState: '04_ANDROID',
      nextState: null,
      primaryModel: 'android',
      secondaryModel: 'hybrid',
      dissolveProgress: 1.0 - localProgress * 0.5,
      localProgress,
    };
  }
}
