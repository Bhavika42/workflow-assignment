
import React, { useEffect } from 'react';
import { Node } from 'reactflow';
import SidebarLeft from './components/SidebarLeft';
import SidebarRight from './components/SidebarRight';
import WorkflowCanvas from './components/WorkflowCanvas';
import { useWorkflowStore } from './store/useWorkflowStore';
import { NodeType, NodeData } from './types';

const App: React.FC = () => {
  const { setNodes, setEdges } = useWorkflowStore();

  // Load sample workflow on mount: "Product Marketing Kit Generator"
  useEffect(() => {
    // Explicitly type initialNodes as Node<NodeData>[] to ensure the status union type is preserved
    const initialNodes: Node<NodeData>[] = [
      // Branch A: Image Processing
      { 
        id: 'img-1', type: NodeType.UPLOAD_IMAGE, position: { x: 50, y: 50 }, 
        data: { label: 'Product Photo', status: 'idle', output: 'https://picsum.photos/seed/product/400/300' } 
      },
      { 
        id: 'crop-1', type: NodeType.CROP_IMAGE, position: { x: 400, y: 50 }, 
        data: { label: 'Center Crop', status: 'idle' } 
      },
      // Text Inputs
      { 
        id: 'txt-1', type: NodeType.TEXT, position: { x: 50, y: 400 }, 
        data: { label: 'Copywriter Persona', value: 'You are a professional copywriter for luxury tech brands. Write catchy marketing posts.', status: 'idle' } 
      },
      { 
        id: 'txt-2', type: NodeType.TEXT, position: { x: 400, y: 450 }, 
        data: { label: 'Product Details', value: 'Product: Ultra-slim Noise Cancelling Headphones. Features: 40hr battery, Carbon Fiber build.', status: 'idle' } 
      },
      // Branch B: Video
      { 
        id: 'vid-1', type: NodeType.UPLOAD_VIDEO, position: { x: 50, y: 650 }, 
        data: { label: 'Promo Video', status: 'idle' } 
      },
      { 
        id: 'frame-1', type: NodeType.EXTRACT_FRAME, position: { x: 400, y: 650 }, 
        data: { label: 'Hero Frame', status: 'idle' } 
      },
      // Convergence
      { 
        id: 'llm-1', type: NodeType.RUN_LLM, position: { x: 800, y: 350 }, 
        data: { label: 'Generate Ad Content', status: 'idle' } 
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
  }, [setNodes, setEdges]);

  return (
    <div className="flex h-screen w-screen overflow-hidden text-slate-200">
      <SidebarLeft />
      <main className="flex-1 flex flex-col relative">
        {/* Top Header/Nav */}
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project /</span>
              <span className="text-sm font-bold text-slate-100">Product Launch Kit</span>
            </div>
            <span className="bg-blue-600/10 text-blue-400 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-blue-500/20">Draft</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <img src="https://picsum.photos/32/32?u=1" className="w-8 h-8 rounded-full border-2 border-slate-950" />
              <img src="https://picsum.photos/32/32?u=2" className="w-8 h-8 rounded-full border-2 border-slate-950" />
              <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold">+3</div>
            </div>
            <div className="h-8 w-[1px] bg-slate-800 mx-2" />
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-600/10">
              Share
            </button>
          </div>
        </header>
        
        <WorkflowCanvas />
      </main>
      <SidebarRight />
    </div>
  );
};

export default App;
