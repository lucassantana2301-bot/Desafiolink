export type DevicePerformance = 'high' | 'low' | 'mobile';

export interface SceneConfig {
  id: string;
  name: string;
  scrollRange: [number, number];
  title: string;
  subtitle: string;
  description: string;
  cameraPosition: [number, number, number];
  objectState: 'assembled' | 'spinning-fast' | 'exploded' | 'fly-through' | 'reassembled' | 'wireframe';
  shaderEffect?: string;
}

export interface StoreState {
  scrollProgress: number;
  activeSceneId: string;
  isLoaded: boolean;
  devicePerformance: DevicePerformance;
  setScrollProgress: (progress: number) => void;
  setActiveSceneId: (id: string) => void;
  setIsLoaded: (isLoaded: boolean) => void;
  setDevicePerformance: (perf: DevicePerformance) => void;
}
