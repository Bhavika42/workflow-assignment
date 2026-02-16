
import React from 'react';
import { NodeProps } from 'reactflow';
import { NodeData } from '../../types';
import { Loader2, CheckCircle2, AlertCircle, Play } from 'lucide-react';

interface BaseNodeProps extends NodeProps<NodeData> {
  children: React.ReactNode;
  icon: React.ReactNode;
  onRun?: () => void;
}

const BaseNode: React.FC<BaseNodeProps> = ({ id, data, selected, children, icon, onRun }) => {
  const statusColors = {
    idle: 'border-slate-800 shadow-none',
    running: 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)] ring-2 ring-blue-500/20',
    success: 'border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
    error: 'border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
  };

  return (
    <div className={`
      min-w-[260px] max-w-[340px] bg-slate-900/95 backdrop-blur-xl rounded-2xl border-2 transition-all duration-500 group
      ${selected ? 'ring-2 ring-blue-500/50 ring-offset-4 ring-offset-slate-950 scale-[1.02]' : 'hover:border-slate-700'}
      ${statusColors[data.status || 'idle']}
      ${data.status === 'running' ? 'animate-pulse' : ''}
    `}>
      <div className="flex items-center gap-3 p-4 border-b border-slate-800/50 bg-slate-950/40 rounded-t-2xl relative">
        <div className={`p-2 rounded-xl transition-colors ${data.status === 'running' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-blue-400'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-0.5">{data.label}</h3>
          <div className="flex items-center gap-1.5">
             <div className={`w-1.5 h-1.5 rounded-full ${data.status === 'success' ? 'bg-emerald-500' : data.status === 'running' ? 'bg-blue-500' : 'bg-slate-700'}`} />
             <span className="text-[9px] text-slate-500 font-bold uppercase">{data.status || 'ready'}</span>
          </div>
        </div>
        
        {onRun && data.status !== 'running' && (
          <button 
            onClick={(e) => { e.stopPropagation(); onRun(); }}
            className="p-2 hover:bg-blue-600/20 text-slate-500 hover:text-blue-400 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            title="Run single node"
          >
            <Play size={14} fill="currentColor" />
          </button>
        )}

        <div className="flex items-center">
          {data.status === 'running' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
          {data.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          {data.status === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
        </div>
      </div>
      
      <div className="p-5">
        {children}
      </div>

      {data.errorMessage && (
        <div className="px-5 pb-5 text-[10px] text-rose-400 font-medium italic leading-relaxed">
          Error: {data.errorMessage}
        </div>
      )}
    </div>
  );
};

export default BaseNode;
