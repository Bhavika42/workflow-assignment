
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Image as ImageIcon, Upload } from 'lucide-react';
import BaseNode from './BaseNode';
import { NodeData } from '../../types';
import { useWorkflowStore } from '../../store/useWorkflowStore';

const UploadImageNode: React.FC<NodeProps<NodeData>> = (props) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        updateNodeData(props.id, { 
          output: base64, 
          value: file.name,
          status: 'success'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <BaseNode {...props} icon={<ImageIcon size={16} />}>
      <div className="space-y-3">
        {props.data.output ? (
          <div className="relative group rounded-lg overflow-hidden aspect-video border border-slate-800">
            <img 
              src={props.data.output} 
              className="w-full h-full object-cover" 
              alt="Uploaded preview" 
            />
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <label className="cursor-pointer p-2 bg-blue-600 rounded-full text-white">
                <Upload size={16} />
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-slate-800 rounded-lg cursor-pointer hover:bg-slate-800/30 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-slate-500" />
              <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Upload Image</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
};

export default UploadImageNode;
