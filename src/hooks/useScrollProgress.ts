import { useStore } from '@/store/useStore';

export function useScrollProgress() {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const activeSceneId = useStore((state) => state.activeSceneId);

  return { scrollProgress, activeSceneId };
}
