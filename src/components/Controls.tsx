import React from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface ControlsProps {
  isRunning: boolean;
  onToggleSimulation: () => void;
  onResetSimulation: () => void;
  onToggleSettings: () => void;
  onClearTrails: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isRunning,
  onToggleSimulation,
  onResetSimulation,
  onToggleSettings,
  onClearTrails
}) => {
  return (
    <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
      <h1 className="text-2xl font-bold">Auto-Zoom 3-Body Simulation</h1>
      <div className="flex gap-2">
        <button
          onClick={onToggleSimulation}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-2"
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={onResetSimulation}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Reset
        </button>
        <button
          onClick={onToggleSettings}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded flex items-center gap-2"
        >
          <Settings size={16} />
          Settings
        </button>
        <button
          onClick={onClearTrails}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded"
        >
          Clear Trails
        </button>
      </div>
    </div>
  );
};

export default Controls;