'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { SCENES } from '@/data/scenes';

export default function CameraRig() {
  const { camera } = useThree();

  // Component instance vector references (Fix F - Prevents global module scope mutable state)
  const tempPos = useRef(new THREE.Vector3());
  const tempTarget = useRef(new THREE.Vector3());
  const currentPos = useRef(new THREE.Vector3());
  const nextPos = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());
  const nextLookAt = useRef(new THREE.Vector3());
  const interpolatedPos = useRef(new THREE.Vector3());
  const interpolatedLookAt = useRef(new THREE.Vector3());
  const perspectiveCamRef = useRef<THREE.PerspectiveCamera | null>(null);

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
    currentPos.current.set(...currentScene.cameraPosition);
    nextPos.current.set(...nextScene.cameraPosition);

    const currentTargetArr = currentScene.cameraTarget || [0, 0, 0];
    const nextTargetArr = nextScene.cameraTarget || [0, 0, 0];
    currentLookAt.current.set(...currentTargetArr);
    nextLookAt.current.set(...nextTargetArr);

    // 4. Interpolate Position, FOV, and Target between current & next waypoints
    interpolatedPos.current.lerpVectors(currentPos.current, nextPos.current, localT);
    interpolatedPos.current.x += mouseX;
    interpolatedPos.current.y += mouseY;

    interpolatedLookAt.current.lerpVectors(currentLookAt.current, nextLookAt.current, localT);

    const interpolatedFov = THREE.MathUtils.lerp(
      currentScene.cameraFov,
      nextScene.cameraFov,
      localT
    );

    // 5. Framerate-independent smooth damp lerp (Fix F)
    const lerpSpeed = prefersReducedMotion ? 12 : 3.5;
    const factor = 1 - Math.exp(-lerpSpeed * delta);

    tempPos.current.lerpVectors(camera.position, interpolatedPos.current, factor);
    tempTarget.current.lerpVectors(tempTarget.current, interpolatedLookAt.current, factor);

    camera.position.copy(tempPos.current);
    camera.lookAt(tempTarget.current);

    if (camera instanceof THREE.PerspectiveCamera) {
      perspectiveCamRef.current = camera;
      perspectiveCamRef.current.fov = THREE.MathUtils.lerp(perspectiveCamRef.current.fov, interpolatedFov, factor);
      perspectiveCamRef.current.updateProjectionMatrix();
    }
  });

  return null;
}
