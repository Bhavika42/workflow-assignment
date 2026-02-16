
export enum NodeType {
  TEXT = 'textNode',
  UPLOAD_IMAGE = 'uploadImageNode',
  UPLOAD_VIDEO = 'uploadVideoNode',
  RUN_LLM = 'runLlmNode',
  CROP_IMAGE = 'cropImageNode',
  EXTRACT_FRAME = 'extractFrameNode',
}

export interface NodeData {
  label: string;
  value?: string;
  inputs?: Record<string, any>;
  output?: any;
  status?: 'idle' | 'running' | 'success' | 'error';
  errorMessage?: string;
  config?: Record<string, any>;
}

export interface ExecutionRun {
  id: string;
  timestamp: Date;
  status: 'success' | 'failed' | 'running';
  duration: number;
  scope: 'full' | 'partial' | 'single';
  results: Record<string, any>;
}

export interface WorkflowState {
  nodes: any[];
  edges: any[];
  history: ExecutionRun[];
  isRunning: boolean;
  selectedRunId?: string;
}
