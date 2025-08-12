import React from 'react';
import { Body } from '../types/Body';
import { Decimal } from '../utils/Decimal';

interface InfoPanelProps {
  bodies: Body[];
  G: Decimal;
  isRunning: boolean;
  autoZoom: boolean;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ bodies, G, isRunning, autoZoom }) => {
  return (
    <div className="w-80 bg-gray-800 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Body Properties</h3>
      {bodies.map((body) => (
        <div key={body.id} className="mb-4 p-3 bg-gray-700 rounded">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: body.color }}
            />
            {body.name}
          </h4>
          <div className="space-y-1 text-xs">
            <div><span className="text-gray-400">Mass:</span> {body.mass.toString()}</div>
            <div><span className="text-gray-400">Pos X:</span> {body.position.x.toString()}</div>
            <div><span className="text-gray-400">Pos Y:</span> {body.position.y.toString()}</div>
            <div><span className="text-gray-400">Vel X:</span> {body.velocity.x.toString()}</div>
            <div><span className="text-gray-400">Vel Y:</span> {body.velocity.y.toString()}</div>
            <div><span className="text-gray-400">Acc X:</span> {body.acceleration.x.toString()}</div>
            <div><span className="text-gray-400">Acc Y:</span> {body.acceleration.y.toString()}</div>
          </div>
        </div>
      ))}
      
      <div className="mt-6 p-3 bg-gray-700 rounded">
        <h4 className="font-medium mb-2">Simulation Status</h4>
        <div className="text-xs space-y-1">
          <div><span className="text-gray-400">Precision:</span> High-precision arithmetic</div>
          <div><span className="text-gray-400">Integration:</span> Verlet method</div>
          <div><span className="text-gray-400">G:</span> {G.toString()}</div>
          <div><span className="text-gray-400">Bodies:</span> {bodies.length}</div>
          <div><span className="text-gray-400">Status:</span> {isRunning ? 'Running' : 'Paused'}</div>
          <div><span className="text-gray-400">Auto-zoom:</span> {autoZoom ? 'Enabled' : 'Disabled'}</div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;