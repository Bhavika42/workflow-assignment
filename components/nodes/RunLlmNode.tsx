
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { BrainCircuit, Sparkles } from 'lucide-react';
import BaseNode from './BaseNode';
import { NodeData } from '../../types';

const RunLlmNode: React.FC<NodeProps<NodeData>> = (props) => {
  return (
    <BaseNode {...props} icon={<BrainCircuit size={16} />}>
      <div className="space-y-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Model</label>
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-blue-400">
            <Sparkles size={12} />
            gemini-3-flash-preview
          </div>
        </div>

        {props.data.output && (
          <div className="space-y-1">
             <label className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Output</label>
             <div className="bg-slate-950/50 border border-emerald-500/30 rounded-lg p-2 max-h-48 overflow-y-auto">
               <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                 {props.data.output}
               </p>
             </div>
          </div>
        )}
        
        {!props.data.output && props.data.status === 'idle' && (
          <div className="py-8 flex flex-col items-center justify-center opacity-40">
            <BrainCircuit size={32} className="mb-2 text-slate-600" />
            <span className="text-[10px] uppercase font-bold">Ready to process</span>
          </div>
        )}
      </div>
      
      <Handle type="target" position={Position.Left} id="text" className="!top-1/4" />
      <Handle type="target" position={Position.Left} id="image" className="!top-3/4" />
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
};

export default RunLlmNode;
