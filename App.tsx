
import React, { useEffect, useState } from 'react';
import { Node } from 'reactflow';
import { Zap, ShieldCheck, LogIn, ArrowRight, Github } from 'lucide-react';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import WorkflowCanvas from './components/WorkflowCanvas';
import { useWorkflowStore } from './store/useWorkflowStore';
import { NodeType, NodeData } from './types';

const AuthScreen: React.FC = () => {
  const login = useWorkflowStore(state => state.login);
  const [loading, setLoading] = useState(false);

  const handleAuth = () => {
    setLoading(true);
    setTimeout(() => {
      login();
      setLoading(false);
    }, 800);
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0f172a] overflow-hidden relative">
      {/* Animated Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full" />
      
      <div className="w-full max-w-md p-10 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-2xl shadow-blue-600/30 mb-6">
            <Zap size={32} fill="white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2 italic">WEAVY<span className="text-blue-500 not-italic">.</span></h1>
          <p className="text-slate-400 text-sm font-medium">Enterprise Workflow Orchestration</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleAuth}
            disabled={loading}
            className="w-full h-14 bg-white text-slate-950 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-100 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" /> : (
              <>
                <LogIn size={20} />
                Sign in with Clerk
              </>
            )}
          </button>
          
          <button 
            disabled
            className="w-full h-14 bg-slate-800 text-slate-400 rounded-2xl font-bold flex items-center justify-center gap-3 cursor-not-allowed opacity-50"
          >
            <Github size={20} />
            Sign in with GitHub
          </button>
        </div>

        <div className="mt-8 flex items-center gap-2 justify-center py-4 bg-slate-950/50 rounded-2xl border border-slate-800/50">
           <ShieldCheck size={16} className="text-emerald-500" />
           <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.1em]">Protected by Enterprise Auth</span>
        </div>
        
        <p className="mt-8 text-center text-[10px] text-slate-600 uppercase font-bold tracking-widest leading-relaxed">
          By signing in you agree to our <br/>
          <span className="text-slate-400 cursor-pointer hover:text-blue-500 underline underline-offset-4">Terms of Service</span> and <span className="text-slate-400 cursor-pointer hover:text-blue-500 underline underline-offset-4">Privacy Policy</span>
        </p>
      </div>

      <div className="absolute bottom-10 flex items-center gap-6 text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
        <span className="hover:text-slate-400 cursor-pointer transition-colors">Documentation</span>
        <span className="w-1 h-1 bg-slate-800 rounded-full" />
        <span className="hover:text-slate-400 cursor-pointer transition-colors">Status</span>
        <span className="w-1 h-1 bg-slate-800 rounded-full" />
        <span className="hover:text-slate-400 cursor-pointer transition-colors">Contact</span>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { setNodes, setEdges, user, logout } = useWorkflowStore();

  useEffect(() => {
    if (!user) return;

    const initialNodes: Node<NodeData>[] = [
      { 
        id: 'img-1', type: NodeType.UPLOAD_IMAGE, position: { x: 50, y: 50 }, 
        data: { label: 'Product Photo', status: 'idle', output: 'https://picsum.photos/seed/product/400/300', service: 'Transloadit' } 
      },
      { 
        id: 'crop-1', type: NodeType.CROP_IMAGE, position: { x: 400, y: 50 }, 
        data: { label: 'Smart Crop', status: 'idle', service: 'Trigger.dev' } 
      },
      { 
        id: 'txt-1', type: NodeType.TEXT, position: { x: 50, y: 400 }, 
        data: { label: 'Copywriter Persona', value: 'Professional luxury brand copywriter.', status: 'idle', service: 'Local' } 
      },
      { 
        id: 'txt-2', type: NodeType.TEXT, position: { x: 400, y: 450 }, 
        data: { label: 'Product Details', value: 'Noise Cancelling Headphones, Carbon Fiber build.', status: 'idle', service: 'Local' } 
      },
      { 
        id: 'vid-1', type: NodeType.UPLOAD_VIDEO, position: { x: 50, y: 650 }, 
        data: { label: 'Promo Video', status: 'idle', service: 'Transloadit' } 
      },
      { 
        id: 'frame-1', type: NodeType.EXTRACT_FRAME, position: { x: 400, y: 650 }, 
        data: { label: 'Hero Frame', status: 'idle', service: 'Trigger.dev' } 
      },
      { 
        id: 'llm-1', type: NodeType.RUN_LLM, position: { x: 800, y: 350 }, 
        data: { label: 'Campaign Engine', status: 'idle', service: 'Gemini API' } 
      },
    ];

    const initialEdges = [
      { id: 'e1', source: 'img-1', target: 'crop-1', animated: true },
      { id: 'e2', source: 'crop-1', target: 'llm-1', targetHandle: 'image', animated: true },
      { id: 'e3', source: 'txt-1', target: 'llm-1', targetHandle: 'text', animated: true },
      { id: 'e4', source: 'txt-2', target: 'llm-1', targetHandle: 'text', animated: true },
      { id: 'e5', source: 'vid-1', target: 'frame-1', animated: true },
      { id: 'e6', source: 'frame-1', target: 'llm-1', targetHandle: 'image', animated: true },
    ];

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges, user]);

  if (!user) return <AuthScreen />;

  return (
    <div className="flex h-screen w-screen overflow-hidden text-slate-200 bg-[#0f172a]">
      <SidebarLeft />
      <main className="flex-1 flex flex-col relative">
        <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Workspace /</span>
              <span className="text-xs font-bold text-slate-100 flex items-center gap-2">
                <Zap size={14} className="text-blue-500" fill="currentColor" />
                Product Marketing Kit
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">Live Cloud Sync</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex -space-x-2 group cursor-pointer">
              {[1, 2, 3].map(i => (
                <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} className="w-8 h-8 rounded-full border-2 border-slate-950 group-hover:translate-x-1 transition-transform" />
              ))}
              <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold">+2</div>
            </div>
            
            <div className="h-6 w-[1px] bg-slate-800" />
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] font-bold text-white leading-none">{user.name}</p>
                <p className="text-[8px] font-medium text-slate-500 mt-1">{user.email}</p>
              </div>
              <img 
                src={user.avatar} 
                onClick={logout}
                className="w-10 h-10 rounded-2xl border-2 border-slate-800 hover:border-blue-500 cursor-pointer transition-all" 
                title="Logout"
              />
            </div>
          </div>
        </header>
        
        <WorkflowCanvas />
      </main>
      <SidebarRight />
    </div>
  );
};

export default App;
