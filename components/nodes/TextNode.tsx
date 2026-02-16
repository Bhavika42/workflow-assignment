
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Type, Link } from 'lucide-react';
import BaseNode from './BaseNode';
import { NodeData } from '../../types';
import { useWorkflowStore } from '../../store/useWorkflowStore';

const TextNode: React.FC<NodeProps<NodeData>> = (props) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);
  const isConnected = useWorkflowStore((state) => state.isHandleConnected(props.id, 'input', 'target'));

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(props.id, { value: e.target.value, output: e.target.value });
  };

  return (
    <BaseNode {...props} icon={<Type size={16} />}>
      <Handle type="target" position={Position.Left} id="input" />
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Input String</label>
          {isConnected && <Link size={10} className="text-blue-500" />}
        </div>
        <textarea
          value={props.data.value || ''}
          onChange={handleChange}
          disabled={props.data.status === 'running' || isConnected}
          className={`w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none transition-all ${isConnected ? 'opacity-50 cursor-not-allowed italic' : ''}`}
          placeholder={isConnected ? "Driven by upstream connection..." : "Enter text or prompt..."}
        />
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </BaseNode>
  );
};

export default TextNode;
