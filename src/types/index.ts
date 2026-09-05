export type DevicePerformance = 'high' | 'low' | 'mobile';

export interface SceneConfig {
  id: string;
  name: string;
  scrollRange: [number, number];
  title: string;
  subtitle: string;
  description: string;
  cameraPosition: [number, number, number];
  cameraFov?: number;
  objectState: 'human-silhouette' | 'material-transition' | 'exploded-biomech' | 'core-reveal' | 'inside-matrix' | 'hybrid-reborn' | string;
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
