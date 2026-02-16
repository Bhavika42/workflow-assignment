
import React from 'react';
import { 
  Type, 
  Image as ImageIcon, 
  Video, 
  BrainCircuit, 
  Crop, 
  Film,
  Search,
  Zap
} from 'lucide-react';
import { NodeType } from '../types';
import { useWorkflowStore } from '../store/useWorkflowStore';

const nodeButtons = [
  { type: NodeType.TEXT, label: 'Text Input', icon: <Type size={18} />, desc: 'Static text or prompt' },
  { type: NodeType.UPLOAD_IMAGE, label: 'Upload Image', icon: <ImageIcon size={18} />, desc: 'Local image file' },
  { type: NodeType.UPLOAD_VIDEO, label: 'Upload Video', icon: <Video size={18} />, desc: 'Local video file' },
  { type: NodeType.RUN_LLM, label: 'Run LLM', icon: <BrainCircuit size={18} />, desc: 'Gemini AI processing' },
  { type: NodeType.CROP_IMAGE, label: 'Crop Image', icon: <Crop size={18} />, desc: 'Smart image cropping' },
  { type: NodeType.EXTRACT_FRAME, label: 'Extract Frame', icon: <Film size={18} />, desc: 'Get frame from video' },
];

const SidebarLeft: React.FC = () => {
  const addNode = useWorkflowStore((state) => state.addNode);

  return (
    <div className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col h-full z-10">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Zap size={24} fill="white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Weavy</h1>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Workflow Builder</p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input 
            type="text" 
            placeholder="Search nodes..." 
            className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-4">Core Modules</p>
          {nodeButtons.map((btn) => (
            <button
              key={btn.type}
              onClick={() => addNode(btn.type, { x: 100, y: 100 })}
              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-slate-900 transition-all group border border-transparent hover:border-slate-800"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:bg-slate-800 transition-colors">
                {btn.icon}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-200 group-hover:text-white">{btn.label}</p>
                <p className="text-[10px] text-slate-500">{btn.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800 bg-slate-900/20">
        <div className="p-4 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-xl">
          <p className="text-xs font-semibold text-blue-400 mb-1">Quick Tip</p>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            LLM nodes can handle both text and image inputs simultaneously for multimodal tasks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarLeft;
