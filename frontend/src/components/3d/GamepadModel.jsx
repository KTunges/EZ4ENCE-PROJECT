import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';

export function DualSenseModel({ isDark = true }) {
  const group = useRef();
  const { scene } = useGLTF('/models/dualsense.glb');

  // Fix materials sau khi model load
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (!child.isMesh) return;

      child.material = child.material.clone();

      // ✅ Fix xuyên qua hoàn toàn: force transparent off và dùng FrontSide
      child.material.side = THREE.FrontSide;
      child.material.depthWrite = true;
      child.material.depthTest = true;
      child.material.transparent = false;
      child.material.opacity = 1;

      if (isDark) {
        // Hoàn toàn không ám màu, giữ nguyên màu gốc (trắng sáng rực rỡ)
        child.material.roughness = Math.max(0.1, (child.material.roughness ?? 0.5) * 0.6);
        child.material.metalness = Math.min(1, (child.material.metalness ?? 0) + 0.15);
        child.material.envMapIntensity = 3.5; // Nhận tối đa ánh sáng từ môi trường
        child.material.emissive = new THREE.Color('#000000');
        child.material.emissiveIntensity = 0;
      } else {
        child.material.envMapIntensity = 1;
      }

      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    });
  }, [scene, isDark]);


  // Auto-rotate + float
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = clock.getElapsedTime() * 0.28;
    group.current.position.y = Math.sin(clock.getElapsedTime() * 0.7) * 0.05;
  });

  return (
    <Center>
      <group ref={group}>
        <primitive object={scene} />
      </group>
    </Center>
  );
}

useGLTF.preload('/models/dualsense.glb');
