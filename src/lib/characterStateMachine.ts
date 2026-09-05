import { CharacterState } from '@/types';

/**
 * NEXUS Official Character State Machine
 * 
 * Maps global scrollProgress (0.00 -> 1.00) to the 5 official narrative character states:
 * 
 * 01_HUMAN       : 0.00 -> 0.15 (Scene 01 - Pure Biological Human)
 * 02_SKIN_REVEAL : 0.15 -> 0.32 (Scene 02 - Biomechanical Skin Dissolve)
 * 03_HYBRID      : 0.32 -> 0.50 (Scene 03 - 50/50 Human/Machine Structure)
 * 04_ANDROID     : 0.50 -> 0.88 (Scenes 04 & 05 - Full Synthetic Mechanical & Synaptic Core)
 * 05_NEXUS_FINAL : 0.88 -> 1.00 (Scene 06 - Final Human x Machine Convergence)
 */
export function getCharacterState(scrollProgress: number): CharacterState {
  if (scrollProgress < 0.15) {
    return '01_HUMAN';
  } else if (scrollProgress < 0.32) {
    return '02_SKIN_REVEAL';
  } else if (scrollProgress < 0.50) {
    return '03_HYBRID';
  } else if (scrollProgress < 0.88) {
    return '04_ANDROID';
  }
  return '05_NEXUS_FINAL';
}

/**
 * GLB Asset Integration Protocol Scaffold:
 * 
 * 1. Preload Strategy:
 *    - Preload GLB models lazily: humanHead.glb, hybridHead.glb, androidHead.glb.
 * 
 * 2. Crossfade & Swap Strategy:
 *    - Render active GLB mesh matching getCharacterState(scrollProgress).
 *    - Inactive GLBs use visible={false} for GPU culling.
 * 
 * 3. Memory Cleanup Strategy:
 *    - Call geometry.dispose() and material.dispose() on unmount.
 */
