import { CharacterState } from '@/types';

/**
 * NEXUS Character State Machine
 * 
 * Maps global scrollProgress (0.00 -> 1.00) to official character states.
 * 
 * 01_HUMAN        : 0.00 -> 0.15 (Scene 01 - Pure Biological)
 * 02_SKIN_REVEAL  : 0.15 -> 0.32 (Scene 02 - Biomechanical Shift)
 * 03_HYBRID       : 0.32 -> 0.65 & 0.88 -> 1.00 (Scenes 03, 04, 06 - 50/50 Convergence)
 * 04_ANDROID      : 0.65 -> 0.88 (Scene 05 - Synaptic Matrix / Full Synthetic Structure)
 */
export function getCharacterState(scrollProgress: number): CharacterState {
  if (scrollProgress < 0.15) {
    return '01_HUMAN';
  } else if (scrollProgress < 0.32) {
    return '02_SKIN_REVEAL';
  } else if (scrollProgress >= 0.65 && scrollProgress <= 0.88) {
    return '04_ANDROID';
  }
  return '03_HYBRID';
}

/**
 * Future GLB Asset Integration Protocol:
 * 
 * 1. Preload:
 *    useGLTF.preload('/models/humanHead.glb');
 *    useGLTF.preload('/models/hybridHead.glb');
 *    useGLTF.preload('/models/androidHead.glb');
 * 
 * 2. Crossfade & Dissolve Uniforms:
 *    - uProgress: float (0.0 -> 1.0 transition factor between current & next model)
 *    - uNoiseScale: 15.0
 *    - uEdgeWidth: 0.05
 *    - uEdgeColor: vec3(0.0, 0.94, 1.0) // Cyan #00F0FF
 * 
 * 3. Visibility Swap & Memory Cleanup:
 *    - Render active GLB mesh based on getCharacterState(scrollProgress).
 *    - Set visible={false} on inactive meshes to prevent GPU draw calls.
 *    - Dispose materials & geometries when unmounting component (material.dispose()).
 */
