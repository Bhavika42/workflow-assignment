
import React, { useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Crop } from 'lucide-react';
import BaseNode from './BaseNode';
import { NodeData } from '../../types';

const CropImageNode: React.FC<NodeProps<NodeData>> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // We simulation transformation purely for visual preview
  useEffect(() => {
    if (props.data.output && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const img = new Image();
      img.onload = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        // Draw just the center 50% for visual effect
        ctx.drawImage(img, img.width*0.25, img.height*0.25, img.width*0.5, img.height*0.5, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
      };
      img.src = props.data.output;
    }
  }, [props.data.output]);

  return (
    <BaseNode {...props} icon={<Crop size={16} />}>
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">X Center</label>
            <div className="bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-center">50%</div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Y Center</label>
            <div className="bg-slate-950 border border-slate-800 rounded p-1 text-[10px] text-center">50%</div>
          </div>
        </div>
        
        {props.data.output ? (
          <div className="aspect-video bg-slate-950 rounded border border-slate-800 overflow-hidden">
            <canvas ref={canvasRef} width={200} height={112} className="w-full h-full" />
          </div>
        ) : (
          <div className="aspect-video bg-slate-950/40 rounded border border-dashed border-slate-800 flex items-center justify-center">
            <span className="text-[10px] text-slate-600 uppercase font-bold">Waiting for image</span>
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
};

export default CropImageNode;
