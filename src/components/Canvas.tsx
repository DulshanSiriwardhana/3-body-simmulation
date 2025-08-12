import React, { useRef, useEffect, useCallback } from 'react';
import { Body, BoundingBox } from '../types/Body';

interface CanvasProps {
  bodies: Body[];
  simulationTime: string;
  totalSteps: number;
  simulationSpeed: number;
  autoZoom: boolean;
  manualScale: number;
  showTrails: boolean;
}

const CanvasPlane: React.FC<CanvasProps> = ({
  bodies,
  simulationTime,
  totalSteps,
  simulationSpeed,
  autoZoom,
  manualScale,
  showTrails
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const calculateBoundingBox = useCallback((bodies: Body[]): BoundingBox => {
    if (bodies.length === 0) {
      return { minX: -100, maxX: 100, minY: -100, maxY: 100, width: 200, height: 200, centerX: 0, centerY: 0 };
    }

    let minX = bodies[0].position.x.toNumber();
    let maxX = bodies[0].position.x.toNumber();
    let minY = bodies[0].position.y.toNumber();
    let maxY = bodies[0].position.y.toNumber();

    bodies.forEach(body => {
      const x = body.position.x.toNumber();
      const y = body.position.y.toNumber();
      
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });

    const padding = 50;
    minX -= padding;
    maxX += padding;
    minY -= padding;
    maxY += padding;

    return {
      minX,
      maxX,
      minY,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2
    };
  }, []);

  const calculateOptimalScale = useCallback((bounds: BoundingBox, canvasWidth: number, canvasHeight: number): number => {
    if (bounds.width === 0 && bounds.height === 0) return 1;
    
    const scaleX = canvasWidth / bounds.width;
    const scaleY = canvasHeight / bounds.height;
    
    return Math.min(scaleX, scaleY) * 0.8;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    const bounds = calculateBoundingBox(bodies);
    const scale = autoZoom 
      ? calculateOptimalScale(bounds, canvasWidth, canvasHeight)
      : manualScale;
    
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    
    const offsetX = autoZoom ? -bounds.centerX : 0;
    const offsetY = autoZoom ? -bounds.centerY : 0;
    
    const transform = (x: number, y: number) => ({
      x: centerX + (x + offsetX) * scale,
      y: centerY + (y + offsetY) * scale
    });
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    const gridSize = Math.max(10, Math.floor(100 / scale));
    
    for (let x = -1000; x <= 1000; x += gridSize) {
      const transformed = transform(x, -1000);
      if (transformed.x >= 0 && transformed.x <= canvasWidth) {
        ctx.beginPath();
        ctx.moveTo(transformed.x, 0);
        ctx.lineTo(transformed.x, canvasHeight);
        ctx.stroke();
      }
    }
    
    for (let y = -1000; y <= 1000; y += gridSize) {
      const transformed = transform(-1000, y);
      if (transformed.y >= 0 && transformed.y <= canvasHeight) {
        ctx.beginPath();
        ctx.moveTo(0, transformed.y);
        ctx.lineTo(canvasWidth, transformed.y);
        ctx.stroke();
      }
    }
    
    if (showTrails) {
      bodies.forEach((body) => {
        if (body.trail.length > 1) {
          ctx.strokeStyle = body.color + '80';
          ctx.lineWidth = 2;
          ctx.beginPath();
          
          for (let i = 0; i < body.trail.length - 1; i++) {
            const alpha = i / body.trail.length;
            ctx.globalAlpha = alpha * 0.8;
            
            const point = transform(body.trail[i].x, body.trail[i].y);
            
            if (i === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          }
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });
    }
    
    bodies.forEach((body) => {
      const pos = transform(body.position.x.toNumber(), body.position.y.toNumber());
      
      ctx.shadowColor = body.color;
      ctx.shadowBlur = 15;
      ctx.fillStyle = body.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, Math.max(4, body.radius * Math.sqrt(scale)), 0, 2 * Math.PI);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      ctx.strokeStyle = body.color + 'DD';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      const vEnd = transform(
        body.position.x.toNumber() + body.velocity.x.toNumber() * 50,
        body.position.y.toNumber() + body.velocity.y.toNumber() * 50
      );
      ctx.lineTo(vEnd.x, vEnd.y);
      ctx.stroke();
      
      const angle = Math.atan2(vEnd.y - pos.y, vEnd.x - pos.x);
      const arrowLength = 10;
      ctx.beginPath();
      ctx.moveTo(vEnd.x, vEnd.y);
      ctx.lineTo(
        vEnd.x - arrowLength * Math.cos(angle - Math.PI / 6),
        vEnd.y - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(vEnd.x, vEnd.y);
      ctx.lineTo(
        vEnd.x - arrowLength * Math.cos(angle + Math.PI / 6),
        vEnd.y - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
      
      ctx.fillStyle = body.color;
      ctx.font = 'bold 14px Arial';
      ctx.fillText(body.name, pos.x + 20, pos.y - 20);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '10px Arial';
      ctx.fillText(`m=${body.mass.toString()}`, pos.x + 20, pos.y - 5);
    });

    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Time: ${simulationTime}s`, 10, 25);
    ctx.fillText(`Steps: ${totalSteps.toLocaleString()}`, 10, 45);
    ctx.fillText(`Speed: ${simulationSpeed}x${simulationSpeed >= 100 ? ' (HIGH)' : ''}`, 10, 65);
    ctx.fillText(`Scale: ${scale.toFixed(3)}`, 10, 85);
    ctx.fillText(`Auto-zoom: ${autoZoom ? 'ON' : 'OFF'}`, 10, 105);
    
    if (simulationSpeed >= 500) {
      ctx.fillStyle = '#FF6B6B';
      ctx.font = 'bold 14px Arial';
      ctx.fillText('⚠ EXTREME SPEED MODE', 10, 130);
    } else if (simulationSpeed >= 100) {
      ctx.fillStyle = '#FFE66D';
      ctx.font = 'bold 14px Arial';
      ctx.fillText('⚡ HIGH SPEED MODE', 10, 130);
    }
  }, [bodies, simulationTime, totalSteps, simulationSpeed, autoZoom, manualScale, showTrails, calculateBoundingBox, calculateOptimalScale]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={800}
      className="flex-1 bg-black border-r border-gray-700"
      style={{ imageRendering: 'auto' }}
    />
  );
};

export default CanvasPlane;