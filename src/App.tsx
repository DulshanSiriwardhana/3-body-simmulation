import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Decimal } from './utils/Decimal';
import { Vector3DUtils } from './utils/Vector3D';
import { PhysicsEngine } from './utils/Physics';
import { Body, SimulationState } from './types/Body';
import Controls from './components/Controls';
import Settings from './components/Settings';
import InfoPanel from './components/InfoPanel';
import CanvasPlane from './components/Canvas';

const App: React.FC = () => {
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const physicsEngineRef = useRef<PhysicsEngine>();
  
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [timeStep, setTimeStep] = useState('0.01');
  const [minDistance, setMinDistance] = useState('1');
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [autoZoom, setAutoZoom] = useState(true);
  const [manualScale, setManualScale] = useState(1);
  const [showTrails, setShowTrails] = useState(true);
  const [maxTrailLength, setMaxTrailLength] = useState(2000);

  const G = new Decimal('0.0000000000667');
  
  const [simulationState, setSimulationState] = useState<SimulationState>({
    bodies: [
      {
        id: 0,
        name: 'Body 1',
        mass: new Decimal('10000000000'),
        position: { x: new Decimal('0'), y: new Decimal('0'), z: new Decimal('0') },
        velocity: { x: new Decimal('0'), y: new Decimal('0'), z: new Decimal('0') },
        acceleration: Vector3DUtils.zero(),
        color: '#3B82F6',
        radius: 8,
        trail: []
      },
      {
        id: 1,
        name: 'Body 2',
        mass: new Decimal('10000000000'),
        position: { x: new Decimal('20'), y: new Decimal('0'), z: new Decimal('0') },
        velocity: { x: new Decimal('0'), y: new Decimal('0'), z: new Decimal('0') },
        acceleration: Vector3DUtils.zero(),
        color: '#EF4444',
        radius: 8,
        trail: []
      },
      {
        id: 2,
        name: 'Body 3',
        mass: new Decimal('10000000000'),
        position: { x: new Decimal('10'), y: new Decimal('17.3205'), z: new Decimal('0') },
        velocity: { x: new Decimal('0'), y: new Decimal('0'), z: new Decimal('0') },
        acceleration: Vector3DUtils.zero(),
        color: '#F59E0B',
        radius: 10,
        trail: []
      }
    ],
    time: new Decimal('0'),
    totalSteps: 0
  });

  // Initialize physics engine
  useEffect(() => {
    physicsEngineRef.current = new PhysicsEngine(G, new Decimal(minDistance));
  }, [G, minDistance]);

  // Update physics engine parameters
  useEffect(() => {
    if (physicsEngineRef.current) {
      physicsEngineRef.current.setMinDistance(new Decimal(minDistance));
    }
  }, [minDistance]);

  const updateSimulation = useCallback(() => {
    if (!physicsEngineRef.current) return;

    const dt = new Decimal(timeStep);
    const newState = { ...simulationState };

    const updatedBodies = physicsEngineRef.current.updateBodies(newState.bodies, dt);
    
    updatedBodies.forEach((body, _index) => {
      if (showTrails && newState.totalSteps % Math.max(1, Math.floor(simulationSpeed / 10)) === 0) {
        body.trail.push({
          x: body.position.x.toNumber(),
          y: body.position.y.toNumber(),
          z: body.position.z.toNumber()
        });
        
        if (body.trail.length > maxTrailLength) {
          body.trail.shift();
        }
      }
    });
    
    newState.bodies = updatedBodies;
    newState.time = newState.time.add(dt);
    newState.totalSteps += 1;
    
    setSimulationState(newState);
  }, [simulationState, timeStep, showTrails, simulationSpeed, maxTrailLength]);

  useEffect(() => {
    const animate = (currentTime: number) => {
      if (isRunning) {
        const deltaTime = currentTime - lastTimeRef.current;
        
        if (deltaTime > 10) {
          const maxStepsPerFrame = Math.min(100, Math.max(1, Math.floor(simulationSpeed)));
          const stepsThisFrame = simulationSpeed <= 10 
            ? Math.max(1, Math.floor(simulationSpeed))
            : maxStepsPerFrame;
          
          for (let i = 0; i < stepsThisFrame; i++) {
            updateSimulation();
          }
          lastTimeRef.current = currentTime;
        }
        
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    if (isRunning) {
      lastTimeRef.current = performance.now();
      animate(lastTimeRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, updateSimulation, simulationSpeed]);

  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setSimulationState({
      bodies: [
        {
          id: 0,
          name: 'Body 1',
          mass: new Decimal('1'),
          position: { x: new Decimal('0'), y: new Decimal('0'), z: new Decimal('0') },
          velocity: { x: new Decimal('0'), y: new Decimal('0.2'), z: new Decimal('0') },
          acceleration: Vector3DUtils.zero(),
          color: '#3B82F6',
          radius: 8,
          trail: []
        },
        {
          id: 1,
          name: 'Body 2',
          mass: new Decimal('1'),
          position: { x: new Decimal('100'), y: new Decimal('0'), z: new Decimal('0') },
          velocity: { x: new Decimal('0'), y: new Decimal('-0.2'), z: new Decimal('0') },
          acceleration: Vector3DUtils.zero(),
          color: '#EF4444',
          radius: 8,
          trail: []
        },
        {
          id: 2,
          name: 'Body 3',
          mass: new Decimal('2'),
          position: { x: new Decimal('-50'), y: new Decimal('86.6'), z: new Decimal('0') },
          velocity: { x: new Decimal('0.1732'), y: new Decimal('-0.1'), z: new Decimal('0') },
          acceleration: Vector3DUtils.zero(),
          color: '#F59E0B',
          radius: 10,
          trail: []
        }
      ],
      time: new Decimal('0'),
      totalSteps: 0
    });
  };

  const clearTrails = () => {
    const newState = { ...simulationState };
    newState.bodies = newState.bodies.map(body => ({ ...body, trail: [] }));
    setSimulationState(newState);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className="w-full max-h-screen bg-gray-900 text-white flex flex-col">
      <Controls
        isRunning={isRunning}
        onToggleSimulation={toggleSimulation}
        onResetSimulation={resetSimulation}
        onToggleSettings={toggleSettings}
        onClearTrails={clearTrails}
      />

      {showSettings && (
        <Settings
          timeStep={timeStep}
          setTimeStep={setTimeStep}
          minDistance={minDistance}
          setMinDistance={setMinDistance}
          simulationSpeed={simulationSpeed}
          setSimulationSpeed={setSimulationSpeed}
          maxTrailLength={maxTrailLength}
          setMaxTrailLength={setMaxTrailLength}
          autoZoom={autoZoom}
          setAutoZoom={setAutoZoom}
          showTrails={showTrails}
          setShowTrails={setShowTrails}
          manualScale={manualScale}
          setManualScale={setManualScale}
        />
      )}

      <div className="flex-1 flex h-full">
        <CanvasPlane
          bodies={simulationState.bodies}
          simulationTime={simulationState.time.toString()}
          totalSteps={simulationState.totalSteps}
          simulationSpeed={simulationSpeed}
          autoZoom={autoZoom}
          manualScale={manualScale}
          showTrails={showTrails}
        />
        
        <InfoPanel
          bodies={simulationState.bodies}
          G={G}
          isRunning={isRunning}
          autoZoom={autoZoom}
        />
      </div>
    </div>
  );
};

export default App;