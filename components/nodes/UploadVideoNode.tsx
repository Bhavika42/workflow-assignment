
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Video, Upload } from 'lucide-react';
import BaseNode from './BaseNode';
import { NodeData } from '../../types';
import { useWorkflowStore } from '../../store/useWorkflowStore';

const UploadVideoNode: React.FC<NodeProps<NodeData>> = (props) => {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      updateNodeData(props.id, { 
        output: videoUrl, 
        value: file.name,
        status: 'success'
      });
    }
  };

  return (
    <BaseNode {...props} icon={<Video size={16} />}>
      <div className="space-y-3">
        {props.data.output ? (
          <div className="relative group rounded-lg overflow-hidden aspect-video border border-slate-800">
            <video 
              src={props.data.output} 
              className="w-full h-full object-cover" 
              controls
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <label className="cursor-pointer p-1.5 bg-blue-600 rounded-lg text-white shadow-lg">
                <Upload size={14} />
                <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
              </label>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-slate-800 rounded-lg cursor-pointer hover:bg-slate-800/30 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-slate-500" />
              <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Upload Video</p>
            </div>
            <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
          </label>
        )}
      </div>
      <Handle type="source" position={Position.Right} />
    </BaseNode>
  );
};

export default UploadVideoNode;
