import { create } from 'zustand';
import { StoreState } from '@/types';

export const useStore = create<StoreState>((set) => ({
  scrollProgress: 0,
  activeSceneId: 'scene-01',
  isLoaded: false,
  devicePerformance: 'high',
  prefersReducedMotion: false,

  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  setActiveSceneId: (activeSceneId) => set({ activeSceneId }),
  setIsLoaded: (isLoaded) => set({ isLoaded }),
  setDevicePerformance: (devicePerformance) => set({ devicePerformance }),
  setPrefersReducedMotion: (prefersReducedMotion) => set({ prefersReducedMotion }),
}));
