import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useProgress, Html, Bounds } from '@react-three/drei';
import * as THREE from 'three';
import { DualSenseModel } from './GamepadModel';
import { useTheme } from '../../context/ThemeContext';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: '10px', color: '#00dcff', fontFamily: 'monospace', fontSize: '12px',
        letterSpacing: '2px',
      }}>
        <div style={{
          width: '120px', height: '3px',
          background: 'rgba(0,220,255,0.12)', borderRadius: '99px', overflow: 'hidden',
        }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            background: 'linear-gradient(90deg,#00dcff,#7b2fff)',
            borderRadius: '99px', transition: 'width 0.3s ease',
            boxShadow: '0 0 8px #00dcff',
          }} />
        </div>
        <span>{Math.round(progress)}% LOADING</span>
      </div>
    </Html>
  );
}

export default function GamepadScene() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 35 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      gl={{
        alpha: true,
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: isDark ? 1.8 : 2.0, // Phơi sáng cao hơn để cực kỳ sáng
      }}
      shadows
    >
      {/* Ánh sáng môi trường cực mạnh */}
      <ambientLight intensity={isDark ? 1.5 : 2.0} />

      {/* Key light */}
      <pointLight
        position={[-4, 4, 4]}
        intensity={isDark ? 6 : 4}
        color={isDark ? '#00dcff' : '#6b21e8'}
        castShadow
      />

      {/* Fill light */}
      <pointLight
        position={[4, 0, 3]}
        intensity={isDark ? 4 : 3}
        color={isDark ? '#7b2fff' : '#0066cc'}
      />

      {/* Rim light */}
      <pointLight
        position={[0, -3, -2]}
        intensity={isDark ? 2.5 : 1.5}
        color={isDark ? '#ff2d78' : '#db2777'}
      />

      {/* Back rim */}
      <pointLight
        position={[0, 1, -3]}
        intensity={isDark ? 3 : 1}
        color="#00dcff"
      />

      <Suspense fallback={<Loader />}>
        <Bounds fit clip observe margin={1.25}>
          <DualSenseModel isDark={isDark} />
        </Bounds>

        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={isDark ? 0.5 : 0.15}
          scale={6} blur={3} far={3}
          color={isDark ? '#001a33' : '#6b21e8'}
        />

        {/* Night preset → ít ánh sáng môi trường, hòa với nền tối */}
        <Environment preset="night" />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 1.8}
        dampingFactor={0.06}
        enableDamping
      />
    </Canvas>
  );
}
