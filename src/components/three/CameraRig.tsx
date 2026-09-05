'use client';

import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

export default function CameraRig() {
  const { camera } = useThree();
  const targetPos = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();

  useFrame((state, delta) => {
    const scrollProgress = useStore.getState().scrollProgress;

    // Mouse subtle parallax input
    const mouseX = state.pointer.x * 0.25;
    const mouseY = state.pointer.y * 0.25;

    // Camera keyframe interpolation
    let posX = mouseX;
    let posY = mouseY;
    let posZ = 6.0;
    let fov = 45;
    let targetY = 0;

    if (scrollProgress <= 0.15) {
      // Scene 01: Human Study (0.00 -> 0.15)
      const t = scrollProgress / 0.15;
      posZ = THREE.MathUtils.lerp(6.0, 3.8, t);
      fov = THREE.MathUtils.lerp(45, 42, t);
    } else if (scrollProgress <= 0.32) {
      // Scene 02: Beneath The Skin (0.15 -> 0.32)
      const t = (scrollProgress - 0.15) / 0.17;
      posX = THREE.MathUtils.lerp(mouseX, 0.8 + mouseX, t);
      posY = THREE.MathUtils.lerp(mouseY, 0.6 + mouseY, t);
      posZ = THREE.MathUtils.lerp(3.8, 4.5, t);
      fov = THREE.MathUtils.lerp(42, 40, t);
    } else if (scrollProgress <= 0.50) {
      // Scene 03: Machine (0.32 -> 0.50)
      const t = (scrollProgress - 0.32) / 0.18;
      posX = THREE.MathUtils.lerp(0.8 + mouseX, mouseX, t);
      posY = THREE.MathUtils.lerp(0.6 + mouseY, mouseY, t);
      posZ = THREE.MathUtils.lerp(4.5, 2.2, t);
      fov = THREE.MathUtils.lerp(40, 50, t);
    } else if (scrollProgress <= 0.65) {
      // Scene 04: The Mind (0.50 -> 0.65)
      const t = (scrollProgress - 0.50) / 0.15;
      posZ = THREE.MathUtils.lerp(2.2, -2.5, t);
      fov = THREE.MathUtils.lerp(50, 65, t);
    } else if (scrollProgress <= 0.88) {
      // Scene 05: Neural World (0.65 -> 0.88)
      const t = (scrollProgress - 0.65) / 0.23;
      posZ = THREE.MathUtils.lerp(-2.5, 3.5, t);
      fov = THREE.MathUtils.lerp(65, 50, t);
    } else {
      // Scene 06: Nexus Reveal (0.88 -> 1.00)
      const t = (scrollProgress - 0.88) / 0.12;
      posZ = THREE.MathUtils.lerp(3.5, 5.2, t);
      fov = THREE.MathUtils.lerp(50, 45, t);
    }

    targetPos.set(posX, posY, posZ);
    lookTarget.set(0, targetY, 0);

    camera.position.lerp(targetPos, delta * 3.5);
    camera.lookAt(lookTarget);

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, fov, delta * 3.5);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
