import { create } from 'zustand';
import { StoreState } from '@/types';

export const useStore = create<StoreState>((set) => ({
  scrollProgress: 0,
  activeSceneId: 'scene-01',
  characterState: '01_HUMAN',
  isLoaded: false,
  devicePerformance: 'unknown',
  prefersReducedMotion: false,

  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  setActiveSceneId: (activeSceneId) => set({ activeSceneId }),
  setCharacterState: (characterState) => set({ characterState }),
  setIsLoaded: (isLoaded) => set({ isLoaded }),
  setDevicePerformance: (devicePerformance) => set({ devicePerformance }),
  setPrefersReducedMotion: (prefersReducedMotion) => set({ prefersReducedMotion }),
}));
