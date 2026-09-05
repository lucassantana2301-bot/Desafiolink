/* eslint-disable react-hooks/immutability */
'use client';

import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { SCENES } from '@/data/scenes';

// Reusable static vector objects outside render loop (Fix 02 - Avoids memory allocation per frame)
const tempPos = new THREE.Vector3();
const tempTarget = new THREE.Vector3();
const currentPos = new THREE.Vector3();
const nextPos = new THREE.Vector3();
const currentLookAt = new THREE.Vector3();
const nextLookAt = new THREE.Vector3();
const interpolatedPos = new THREE.Vector3();
const interpolatedLookAt = new THREE.Vector3();

export default function CameraRig() {
  const { camera } = useThree();

  useFrame((state, delta) => {
    const scrollProgress = useStore.getState().scrollProgress;
    const prefersReducedMotion = useStore.getState().prefersReducedMotion;

    // Subtle mouse parallax (Disabled if reduced motion is active)
    const mouseX = prefersReducedMotion ? 0 : state.pointer.x * 0.2;
    const mouseY = prefersReducedMotion ? 0 : state.pointer.y * 0.2;

    // 1. Single Source of Truth: Find current scene and next scene from SCENES config
    let sceneIndex = 0;
    for (let i = 0; i < SCENES.length; i++) {
      if (scrollProgress >= SCENES[i].scrollRange[0] && scrollProgress <= SCENES[i].scrollRange[1]) {
        sceneIndex = i;
        break;
      }
      if (scrollProgress > SCENES[i].scrollRange[1]) {
        sceneIndex = i;
      }
    }

    const currentScene = SCENES[sceneIndex];
    const nextScene = SCENES[Math.min(sceneIndex + 1, SCENES.length - 1)];

    // 2. Calculate local progress t within current scene range [start, end]
    const rangeStart = currentScene.scrollRange[0];
    const rangeEnd = currentScene.scrollRange[1];
    const rangeSpan = Math.max(0.001, rangeEnd - rangeStart);
    const localT = THREE.MathUtils.clamp((scrollProgress - rangeStart) / rangeSpan, 0, 1);

    // 3. Set current & next target vectors
    currentPos.set(...currentScene.cameraPosition);
    nextPos.set(...nextScene.cameraPosition);

    const currentTargetArr = currentScene.cameraTarget || [0, 0, 0];
    const nextTargetArr = nextScene.cameraTarget || [0, 0, 0];
    currentLookAt.set(...currentTargetArr);
    nextLookAt.set(...nextTargetArr);

    // 4. Interpolate Position, FOV, and Target between current & next waypoints
    interpolatedPos.lerpVectors(currentPos, nextPos, localT);
    interpolatedPos.x += mouseX;
    interpolatedPos.y += mouseY;

    interpolatedLookAt.lerpVectors(currentLookAt, nextLookAt, localT);

    const interpolatedFov = THREE.MathUtils.lerp(
      currentScene.cameraFov,
      nextScene.cameraFov,
      localT
    );

    // 5. Framerate-independent smooth damp lerp (Fix 02)
    const lerpSpeed = prefersReducedMotion ? 12 : 3.5;
    const factor = 1 - Math.exp(-lerpSpeed * delta);

    tempPos.lerpVectors(camera.position, interpolatedPos, factor);
    tempTarget.lerpVectors(tempTarget, interpolatedLookAt, factor);

    camera.position.copy(tempPos);
    camera.lookAt(tempTarget);

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, interpolatedFov, factor);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
