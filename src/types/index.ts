export type DevicePerformance = 'high' | 'medium' | 'low';

export type CharacterState = '01_HUMAN' | '02_SKIN_REVEAL' | '03_HYBRID' | '04_ANDROID';

export type ObjectState = 
  | 'human-silhouette'
  | 'material-transition'
  | 'exploded-biomech'
  | 'core-reveal'
  | 'inside-matrix'
  | 'hybrid-reborn';

export interface SceneConfig {
  id: string;
  name: string;
  scrollRange: [number, number];
  title: string;
  subtitle: string;
  description: string;
  cameraPosition: [number, number, number];
  cameraFov: number;
  cameraTarget?: [number, number, number];
  objectState: ObjectState;
  shaderEffect?: string;
}

export interface StoreState {
  scrollProgress: number;
  activeSceneId: string;
  isLoaded: boolean;
  devicePerformance: DevicePerformance;
  prefersReducedMotion: boolean;
  setScrollProgress: (progress: number) => void;
  setActiveSceneId: (id: string) => void;
  setIsLoaded: (isLoaded: boolean) => void;
  setDevicePerformance: (perf: DevicePerformance) => void;
  setPrefersReducedMotion: (reduced: boolean) => void;
}
