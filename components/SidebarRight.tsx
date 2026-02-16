
import React from 'react';
import { 
  History, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Play,
  Calendar,
  Layers
} from 'lucide-react';
import { useWorkflowStore } from '../store/useWorkflowStore';

const SidebarRight: React.FC = () => {
  const { history, selectedRunId, setSelectedRunId } = useWorkflowStore();

  return (
    <div className="w-80 bg-slate-950 border-l border-slate-800 flex flex-col h-full z-10">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <History className="text-slate-400" size={18} />
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Run History</h2>
        </div>
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Execution monitoring</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
            <div className="p-4 bg-slate-900 rounded-full">
              <Clock size={32} strokeWidth={1.5} />
            </div>
            <p className="text-xs uppercase font-bold tracking-widest">No runs recorded yet</p>
          </div>
        ) : (
          history.map((run) => (
            <div 
              key={run.id}
              onClick={() => setSelectedRunId(selectedRunId === run.id ? undefined : run.id)}
              className={`
                p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02]
                ${selectedRunId === run.id ? 'bg-slate-900 border-blue-500' : 'bg-slate-900/50 border-slate-800/50 hover:border-slate-700'}
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`
                  px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter
                  ${run.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}
                `}>
                  {run.status}
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <Clock size={10} />
                  <span className="text-[10px] font-mono">{(run.duration / 1000).toFixed(1)}s</span>
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-200 mb-1 flex items-center gap-2">
                <Layers size={12} className="text-blue-400" />
                {run.scope.toUpperCase()} WORKFLOW
              </h4>
              
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <Calendar size={10} />
                {run.timestamp.toLocaleTimeString()}
              </div>

              {selectedRunId === run.id && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Run Details</p>
                  <div className="space-y-2">
                    {Object.entries(run.results).map(([nodeId, result]) => (
                      <div key={nodeId} className="bg-slate-950 p-2 rounded border border-slate-800">
                        <p className="text-[8px] text-blue-500 font-bold mb-1 truncate">{nodeId}</p>
                        <p className="text-[10px] text-slate-300 line-clamp-2">
                          {typeof result === 'string' && result.startsWith('data:') ? '[Media Asset]' : String(result)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-slate-900/50 border-t border-slate-800">
        <button 
          className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
        >
          <Play size={14} fill="currentColor" />
          Re-run All
        </button>
      </div>
    </div>
  );
};

export default SidebarRight;
