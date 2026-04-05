import { Suspense, useRef, useCallback, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import AnatomyModel from './AnatomyModel';
import AnatomyLabels from './AnatomyLabels';
import ViewerControls from './ViewerControls';
import LayerPanel from './LayerPanel';
import PartLabel from './PartLabel';
import LoadingOverlay from './LoadingOverlay';

const DEFAULT_CAMERA = {
  position: [0, 1.0, 2.8],
  target: [0, 0.85, 0],
  fov: 40,
};

function Scene({ gender, activeLayer, selectedPart, onPartClick, onHover, onControlsReady, showLabels, onLabelAnchorsComputed }) {
  const orbitRef = useRef();
  const idleTimer = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [labelAnchors, setLabelAnchors] = useState([]);

  useEffect(() => {
    if (orbitRef.current) {
      onControlsReady?.(orbitRef.current);
    }
  }, [onControlsReady]);

  const handleInteractionStart = useCallback(() => {
    setAutoRotate(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setAutoRotate(true), 5000);
  }, []);

  useEffect(() => {
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  const handleLabelAnchors = useCallback((anchors) => {
    setLabelAnchors(anchors);
    onLabelAnchorsComputed?.(anchors);
  }, [onLabelAnchorsComputed]);

  return (
    <>
      <Environment preset="studio" />

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} color="#ffeedd" />
      <directionalLight position={[-3, 3, -3]} intensity={0.4} color="#ddeeff" />
      <directionalLight position={[0, 3, -5]} intensity={0.3} color="#ffffff" />

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.35}
        blur={2.5}
        far={2}
        resolution={256}
        color="#444444"
      />

      <OrbitControls
        ref={orbitRef}
        enableDamping
        dampingFactor={0.08}
        minDistance={1.5}
        maxDistance={5}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.5}
        target={DEFAULT_CAMERA.target}
        autoRotate={autoRotate}
        autoRotateSpeed={0.5}
        rotateSpeed={0.5}
        enablePan
        panSpeed={0.5}
        touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
        onStart={handleInteractionStart}
        onEnd={handleInteractionEnd}
      />

      <AnatomyModel
        gender={gender}
        activeLayer={activeLayer}
        selectedPart={selectedPart}
        onPartClick={onPartClick}
        onHover={onHover}
        onHoveredGroupChange={setHoveredRegion}
        onLabelAnchorsComputed={handleLabelAnchors}
      />

      <AnatomyLabels
        showLabels={showLabels}
        labelAnchors={labelAnchors}
        hoveredRegion={hoveredRegion}
        selectedPart={selectedPart}
        onLabelClick={onPartClick}
      />
    </>
  );
}

const AnatomyViewer = ({ gender, selectedPart, onPartClick, onHover, activeLayer, onLayerChange }) => {
  const controlsRef = useRef(null);
  const [labelInfo, setLabelInfo] = useState({ name: null, x: 0, y: 0 });
  const [showLabels, setShowLabels] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef();

  const handleHover = useCallback((bodyPartKey, displayName, pointer) => {
    if (displayName && pointer) {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((pointer.x + 1) / 2) * rect.width;
        const y = ((1 - pointer.y) / 2) * rect.height;
        setLabelInfo({ name: displayName, x, y });
      }
    } else {
      setLabelInfo({ name: null, x: 0, y: 0 });
    }
    onHover?.(bodyPartKey);
  }, [onHover]);

  const handleResetCamera = useCallback(() => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      const camera = controls.object;

      gsap.to(camera.position, {
        x: DEFAULT_CAMERA.position[0],
        y: DEFAULT_CAMERA.position[1],
        z: DEFAULT_CAMERA.position[2],
        duration: 0.8,
        ease: 'power2.inOut',
        onUpdate: () => controls.update(),
      });

      gsap.to(controls.target, {
        x: DEFAULT_CAMERA.target[0],
        y: DEFAULT_CAMERA.target[1],
        z: DEFAULT_CAMERA.target[2],
        duration: 0.8,
        ease: 'power2.inOut',
      });
    }
  }, []);

  const handleZoomIn = useCallback(() => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      const camera = controls.object;
      const dir = new THREE.Vector3().subVectors(controls.target, camera.position).normalize();
      gsap.to(camera.position, {
        x: camera.position.x + dir.x * 0.5,
        y: camera.position.y + dir.y * 0.5,
        z: camera.position.z + dir.z * 0.5,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: () => controls.update(),
      });
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      const camera = controls.object;
      const dir = new THREE.Vector3().subVectors(controls.target, camera.position).normalize();
      gsap.to(camera.position, {
        x: camera.position.x - dir.x * 0.5,
        y: camera.position.y - dir.y * 0.5,
        z: camera.position.z - dir.z * 0.5,
        duration: 0.4,
        ease: 'power2.out',
        onUpdate: () => controls.update(),
      });
    }
  }, []);

  const handleControlsReady = useCallback((controls) => {
    controlsRef.current = controls;
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      {/* Loading overlay shown until model renders */}
      {!isLoaded && <LoadingOverlay />}

      <Canvas
        dpr={[1, 1.5]}
        camera={{
          position: DEFAULT_CAMERA.position,
          fov: DEFAULT_CAMERA.fov,
          near: 0.1,
          far: 100,
        }}
        frameloop="always"
        style={{ touchAction: 'none' }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
        }}
      >
        <Suspense fallback={null}>
          <Scene
            gender={gender}
            activeLayer={activeLayer}
            selectedPart={selectedPart}
            onPartClick={onPartClick}
            onHover={handleHover}
            onControlsReady={handleControlsReady}
            showLabels={showLabels}
            onLabelAnchorsComputed={() => setIsLoaded(true)}
          />
        </Suspense>
      </Canvas>

      {/* Layer panel (left side) */}
      <LayerPanel activeLayer={activeLayer} onLayerChange={onLayerChange} />

      {/* Bottom toolbar */}
      <ViewerControls
        onResetCamera={handleResetCamera}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels(!showLabels)}
      />

      {/* Cursor-following tooltip */}
      <PartLabel name={labelInfo.name} x={labelInfo.x} y={labelInfo.y} />
    </div>
  );
};

export default AnatomyViewer;
