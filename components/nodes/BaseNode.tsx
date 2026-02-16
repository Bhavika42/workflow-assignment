
import React from 'react';
import { NodeProps } from 'reactflow';
import { NodeData } from '../../types';
import { Loader2, CheckCircle2, AlertCircle, Play, Globe } from 'lucide-react';

interface BaseNodeProps extends NodeProps<NodeData> {
  children: React.ReactNode;
  icon: React.ReactNode;
  onRun?: () => void;
}

const BaseNode: React.FC<BaseNodeProps> = ({ id, data, selected, children, icon, onRun }) => {
  const statusColors = {
    idle: 'border-slate-800 shadow-none',
    running: 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-1 ring-blue-500/30',
    success: 'border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.05)]',
    error: 'border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.15)]',
  };

  return (
    <div className={`
      min-w-[280px] max-w-[360px] bg-slate-900/98 backdrop-blur-2xl rounded-2xl border-2 transition-all duration-500 group
      ${selected ? 'ring-2 ring-blue-500/40 ring-offset-4 ring-offset-slate-950 scale-[1.01]' : 'hover:border-slate-700/50'}
      ${statusColors[data.status || 'idle']}
      ${data.status === 'running' ? 'animate-pulse' : ''}
    `}>
      <div className="flex items-center gap-3 p-4 border-b border-slate-800/40 bg-slate-950/30 rounded-t-2xl relative">
        <div className={`p-2.5 rounded-xl transition-all duration-300 ${data.status === 'running' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-110' : 'bg-slate-800 text-slate-400 group-hover:text-blue-400 group-hover:bg-slate-700'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-[10px] font-black text-slate-200 uppercase tracking-[0.2em]">{data.label}</h3>
            {data.service && (
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 font-bold border border-slate-700/50 flex items-center gap-1">
                <Globe size={8} />
                {data.service}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
             <div className={`w-1.5 h-1.5 rounded-full transition-colors ${data.status === 'success' ? 'bg-emerald-500' : data.status === 'running' ? 'bg-blue-500 animate-ping' : 'bg-slate-700'}`} />
             <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{data.status || 'ready'}</span>
          </div>
        </div>
        
        {onRun && data.status !== 'running' && (
          <button 
            onClick={(e) => { e.stopPropagation(); onRun(); }}
            className="p-2.5 bg-slate-800 hover:bg-blue-600/20 text-slate-500 hover:text-blue-400 rounded-xl transition-all opacity-0 group-hover:opacity-100 border border-slate-700/50"
            title="Run module"
          >
            <Play size={14} fill="currentColor" />
          </button>
        )}

        <div className="flex items-center ml-2">
          {data.status === 'running' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
          {data.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          {data.status === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
        </div>
      </div>
      
      <div className="p-5">
        {children}
      </div>

      {data.errorMessage && (
        <div className="px-5 pb-5 text-[10px] text-rose-400 font-medium italic leading-relaxed border-t border-slate-800/30 pt-3 mt-1">
          <span className="font-bold uppercase tracking-tighter mr-2">Critical Failure:</span>
          {data.errorMessage}
        </div>
      )}
    </div>
  );
};

export default BaseNode;
