
import React, { useMemo, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  BackgroundVariant,
  Panel,
  Connection
} from 'reactflow';
import { Play, RotateCcw, Zap } from 'lucide-react';
import { useWorkflowStore } from '../store/useWorkflowStore';
import { NodeType } from '../types';
import { runGeminiLLM } from '../services/geminiService';

import TextNode from './nodes/TextNode';
import UploadImageNode from './nodes/UploadImageNode';
import UploadVideoNode from './nodes/UploadVideoNode';
import RunLlmNode from './nodes/RunLlmNode';
import CropImageNode from './nodes/CropImageNode';
import ExtractFrameNode from './nodes/ExtractFrameNode';

const nodeTypes = {
  [NodeType.TEXT]: TextNode,
  [NodeType.UPLOAD_IMAGE]: UploadImageNode,
  [NodeType.UPLOAD_VIDEO]: UploadVideoNode,
  [NodeType.RUN_LLM]: RunLlmNode,
  [NodeType.CROP_IMAGE]: CropImageNode,
  [NodeType.EXTRACT_FRAME]: ExtractFrameNode,
};

const WorkflowCanvas: React.FC = () => {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    isRunning, 
    setIsRunning,
    updateNodeData,
    addHistory
  } = useWorkflowStore();

  const isValidConnection = useCallback((connection: Connection) => {
    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);
    
    if (!sourceNode || !targetNode) return false;

    // Rule: Image nodes can only go to image inputs, text to text
    const isSourceImage = [NodeType.UPLOAD_IMAGE, NodeType.CROP_IMAGE, NodeType.EXTRACT_FRAME].includes(sourceNode.type as NodeType);
    const isSourceText = [NodeType.TEXT, NodeType.RUN_LLM].includes(sourceNode.type as NodeType);
    const isSourceVideo = sourceNode.type === NodeType.UPLOAD_VIDEO;

    if (targetNode.type === NodeType.RUN_LLM) {
      if (connection.targetHandle === 'image') return isSourceImage;
      if (connection.targetHandle === 'text') return isSourceText;
    }

    if (targetNode.type === NodeType.CROP_IMAGE) return isSourceImage;
    if (targetNode.type === NodeType.EXTRACT_FRAME) return isSourceVideo;

    return true;
  }, [nodes]);

  const runNode = useCallback(async (nodeId: string, visited: Set<string> = new Set()): Promise<any> => {
    if (visited.has(nodeId)) throw new Error("Circular dependency detected");
    visited.add(nodeId);

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return null;

    // Update state to running
    updateNodeData(nodeId, { status: 'running', errorMessage: undefined });

    // 1. Resolve Dependencies (Parallel)
    const incomingEdges = edges.filter(e => e.target === nodeId);
    const resolvedInputs: Record<string, any[]> = { text: [], image: [], generic: [] };

    await Promise.all(incomingEdges.map(async (edge) => {
      const result = await runNode(edge.source, new Set(visited));
      if (edge.targetHandle === 'image') resolvedInputs.image.push(result);
      else if (edge.targetHandle === 'text') resolvedInputs.text.push(result);
      else resolvedInputs.generic.push(result);
    }));

    // 2. Execute (Simulated Background Task)
    try {
      await new Promise(r => setTimeout(r, 800)); // Simulate Trigger.dev latency
      let output: any = node.data.output;

      switch (node.type) {
        case NodeType.RUN_LLM: {
          const combinedPrompt = [...resolvedInputs.text, node.data.value].filter(Boolean).join('\n');
          output = await runGeminiLLM(combinedPrompt, resolvedInputs.image);
          break;
        }
        case NodeType.CROP_IMAGE: {
          output = resolvedInputs.generic[0] || node.data.output;
          break;
        }
        case NodeType.EXTRACT_FRAME: {
          output = 'https://picsum.photos/seed/weavy/800/450'; // Simulated frame extraction
          break;
        }
        case NodeType.TEXT: {
          output = resolvedInputs.generic[0] || node.data.value;
          break;
        }
        default:
          output = node.data.output;
      }

      updateNodeData(nodeId, { status: 'success', output });
      return output;
    } catch (err: any) {
      updateNodeData(nodeId, { status: 'error', errorMessage: err.message });
      throw err;
    }
  }, [nodes, edges, updateNodeData]);

  const handleRunWorkflow = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    const startTime = Date.now();
    
    try {
      // Find terminal nodes (nodes that don't output to anything)
      const terminalNodes = nodes.filter(n => !edges.some(e => e.source === n.id));
      await Promise.all(terminalNodes.map(n => runNode(n.id)));
      
      addHistory({
        id: `run-${Date.now()}`,
        timestamp: new Date(),
        status: 'success',
        duration: Date.now() - startTime,
        scope: 'full',
        results: {} // Simplified for demo
      });
    } catch (error) {
       addHistory({
        id: `run-${Date.now()}`,
        timestamp: new Date(),
        status: 'failed',
        duration: Date.now() - startTime,
        scope: 'full',
        results: {}
      });
    } finally {
      setIsRunning(false);
    }
  }, [nodes, edges, isRunning, setIsRunning, runNode, addHistory]);

  return (
    <div className="flex-1 h-full bg-slate-900 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        isValidConnection={isValidConnection}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} color="#1e293b" gap={24} size={1} />
        <Controls className="!bg-slate-950 !border-slate-800 !shadow-2xl" />
        <MiniMap 
          className="!bg-slate-950/90 !border-slate-800 !rounded-2xl" 
          nodeColor="#1e293b"
          maskColor="rgba(15, 23, 42, 0.7)"
        />
        
        <Panel position="top-right" className="flex gap-3 p-4 bg-slate-950/40 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl">
          <button 
            onClick={() => nodes.forEach(n => updateNodeData(n.id, { status: 'idle', errorMessage: undefined }))}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-slate-800 transition-all active:scale-95"
          >
            <RotateCcw size={12} />
            Reset Canvas
          </button>
          <button 
            onClick={handleRunWorkflow}
            disabled={isRunning || nodes.length === 0}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl transition-all
              ${isRunning || nodes.length === 0 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105 active:scale-95 shadow-blue-600/30'}
            `}
          >
            {isRunning ? <Zap size={14} className="animate-spin" /> : <Play size={14} fill="white" />}
            {isRunning ? 'Processing' : 'Execute Kit'}
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default WorkflowCanvas;
