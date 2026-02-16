
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Film } from 'lucide-react';
import BaseNode from './BaseNode';
import { NodeData } from '../../types';

const ExtractFrameNode: React.FC<NodeProps<NodeData>> = (props) => {
  return (
    <BaseNode {...props} icon={<Film size={16} />}>
      <div className="space-y-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Timestamp</label>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200">
            50% (Center Frame)
          </div>
        </div>
        
        {props.data.output ? (
          <div className="aspect-video bg-slate-950 rounded border border-slate-800 overflow-hidden">
            <img src={props.data.output} className="w-full h-full object-cover" alt="Extracted frame" />
          </div>
        ) : (
          <div className="aspect-video bg-slate-950/40 rounded border border-dashed border-slate-800 flex items-center justify-center">
            <span className="text-[10px] text-slate-600 uppercase font-bold">Waiting for video</span>
          </div>
        )}
      </div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
};

export default ExtractFrameNode;
