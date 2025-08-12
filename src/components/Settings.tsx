import React from 'react';

interface SettingsProps {
  timeStep: string;
  setTimeStep: (value: string) => void;
  minDistance: string;
  setMinDistance: (value: string) => void;
  simulationSpeed: number;
  setSimulationSpeed: (value: number) => void;
  maxTrailLength: number;
  setMaxTrailLength: (value: number) => void;
  autoZoom: boolean;
  setAutoZoom: (value: boolean) => void;
  showTrails: boolean;
  setShowTrails: (value: boolean) => void;
  manualScale: number;
  setManualScale: (value: number) => void;
}

const Settings: React.FC<SettingsProps> = ({
  timeStep,
  setTimeStep,
  minDistance,
  setMinDistance,
  simulationSpeed,
  setSimulationSpeed,
  maxTrailLength,
  setMaxTrailLength,
  autoZoom,
  setAutoZoom,
  showTrails,
  setShowTrails,
  manualScale,
  setManualScale
}) => {
  return (
    <div className="bg-gray-800 p-4 border-b border-gray-700">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Time Step (s)</label>
          <input
            type="text"
            value={timeStep}
            onChange={(e) => setTimeStep(e.target.value)}
            className="w-full px-3 py-1 bg-gray-700 rounded text-sm"
            placeholder="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Min Distance</label>
          <input
            type="text"
            value={minDistance}
            onChange={(e) => setMinDistance(e.target.value)}
            className="w-full px-3 py-1 bg-gray-700 rounded text-sm"
            placeholder="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Simulation Speed</label>
          <input
            type="range"
            min="0.1"
            max="1000"
            step="0.1"
            value={simulationSpeed}
            onChange={(e) => setSimulationSpeed(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-400">{simulationSpeed}x</span>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max Trail Length</label>
          <input
            type="range"
            min="100"
            max="5000"
            value={maxTrailLength}
            onChange={(e) => setMaxTrailLength(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-gray-400">{maxTrailLength}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoZoom}
              onChange={(e) => setAutoZoom(e.target.checked)}
            />
            <span className="text-sm">Auto-Zoom</span>
          </label>
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showTrails}
              onChange={(e) => setShowTrails(e.target.checked)}
            />
            <span className="text-sm">Show Trails</span>
          </label>
        </div>
        {!autoZoom && (
          <div>
            <label className="block text-sm font-medium mb-1">Manual Scale</label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={manualScale}
              onChange={(e) => setManualScale(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-gray-400">{manualScale.toFixed(1)}x</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;