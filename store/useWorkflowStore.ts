
import { create } from 'zustand';
import { 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges, 
  Connection, 
  Edge, 
  Node, 
  OnNodesChange, 
  OnEdgesChange, 
  OnConnect 
} from 'reactflow';
import { NodeType, NodeData, ExecutionRun, User } from '../types';

interface WorkflowStore {
  nodes: Node<NodeData>[];
  edges: Edge[];
  history: ExecutionRun[];
  isRunning: boolean;
  selectedRunId?: string;
  user: User | null;
  
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  
  setNodes: (nodes: Node<NodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  addHistory: (run: ExecutionRun) => void;
  setIsRunning: (running: boolean) => void;
  setSelectedRunId: (id: string | undefined) => void;
  addNode: (type: NodeType, position: { x: number, y: number }) => void;
  isHandleConnected: (nodeId: string, handleId?: string, type?: 'target' | 'source') => boolean;
  login: () => void;
  logout: () => void;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  history: [],
  isRunning: false,
  selectedRunId: undefined,
  user: null,

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge({ ...connection, animated: true }, get().edges),
    });
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      }),
    });
  },

  addHistory: (run) => set((state) => ({ history: [run, ...state.history] })),
  setIsRunning: (running) => set({ isRunning: running }),
  setSelectedRunId: (id) => set({ selectedRunId: id }),

  login: () => set({ 
    user: { 
      id: 'usr_1', 
      name: 'Alex Rivera', 
      email: 'alex@weavy.ai', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' 
    } 
  }),
  logout: () => set({ user: null, history: [] }),

  addNode: (type, position) => {
    const id = `${type}-${Date.now()}`;
    const serviceMap: Record<NodeType, string> = {
      [NodeType.TEXT]: 'Local',
      [NodeType.UPLOAD_IMAGE]: 'Transloadit',
      [NodeType.UPLOAD_VIDEO]: 'Transloadit',
      [NodeType.RUN_LLM]: 'Gemini API',
      [NodeType.CROP_IMAGE]: 'Trigger.dev',
      [NodeType.EXTRACT_FRAME]: 'Trigger.dev',
    };
    const newNode: Node<NodeData> = {
      id,
      type,
      position,
      data: { 
        label: type.replace('Node', '').split(/(?=[A-Z])/).join(' '),
        status: 'idle',
        inputs: {},
        config: {},
        service: serviceMap[type] as any
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  isHandleConnected: (nodeId, handleId, type = 'target') => {
    const { edges } = get();
    return edges.some(edge => 
      type === 'target' 
        ? (edge.target === nodeId && (!handleId || edge.targetHandle === handleId))
        : (edge.source === nodeId && (!handleId || edge.sourceHandle === handleId))
    );
  }
}));
