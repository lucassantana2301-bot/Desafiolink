'use client';

import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

export default function CameraRig() {
  const { camera } = useThree();
  const targetPos = new THREE.Vector3();

  useFrame((state, delta) => {
    const scrollProgress = useStore.getState().scrollProgress;

    // Mouse subtle parallax
    const mouseX = state.pointer.x * 0.3;
    const mouseY = state.pointer.y * 0.3;

    // Camera Waypoints based on narrative scroll progress:
    // 0.0 -> Scene 01: [0, 0, 5]
    // 0.3 -> Scene 02: [0, 0, 2.8] (Zoom)
    // 0.5 -> Scene 03: [0, 1.2, 4] (Exploded view high-angle)
    // 0.7 -> Scene 04: [0, 0, 1.5] (Fly-through)
    // 1.0 -> Scene 06: [0, 0, 6] (Blueprint zoom-out)

    let posX = mouseX;
    let posY = mouseY;
    let posZ = 5.0;

    if (scrollProgress <= 0.3) {
      const t = scrollProgress / 0.3;
      posZ = THREE.MathUtils.lerp(5.0, 2.8, t);
    } else if (scrollProgress <= 0.6) {
      const t = (scrollProgress - 0.3) / 0.3;
      posY = THREE.MathUtils.lerp(mouseY, 1.2, t);
      posZ = THREE.MathUtils.lerp(2.8, 4.0, t);
    } else if (scrollProgress <= 0.85) {
      const t = (scrollProgress - 0.6) / 0.25;
      posY = THREE.MathUtils.lerp(1.2, 0.0, t);
      posZ = THREE.MathUtils.lerp(4.0, 1.8, t);
    } else {
      const t = (scrollProgress - 0.85) / 0.15;
      posZ = THREE.MathUtils.lerp(1.8, 6.0, t);
    }

    targetPos.set(posX, posY, posZ);
    camera.position.lerp(targetPos, delta * 3.5);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
