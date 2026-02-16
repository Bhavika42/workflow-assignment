# ⚡ Weavy Visual Workflow Builder

A pixel-perfect, high-fidelity visual workflow builder inspired by **Weavy.ai**, specifically designed for orchestrating Multimodal LLM pipelines. Build complex AI workflows using a draggable node-based interface, execute them in parallel, and monitor performance in real-time.

![Application Hero Image](https://raw.githubusercontent.com/google/generative-ai-docs/main/site/en/gemini-api/docs/quickstart_header.png)

## 🚀 Overview

This application allows users to visually design and execute AI-driven workflows. By connecting various processing modules—from simple text inputs to video frame extractors—users can create powerful automated pipelines powered by **Google Gemini**.

### Key Features
- **🎨 Pixel-Perfect UI**: High-fidelity dark mode interface matching the Weavy.ai aesthetic.
- **🧩 Multimodal Nodes**: Support for 6 distinct node types including Text, Image, Video, and LLM processing.
- **🔗 Type-Safe Connections**: Intelligent validation prevents invalid connections (e.g., stopping you from plugging a video into a text prompt).
- **⚙️ Parallel DAG Engine**: A custom execution runner that processes independent branches in parallel using a Directed Acyclic Graph.
- **🧠 Multimodal LLM**: Harnesses Gemini-3-Flash-Preview for simultaneous text and image reasoning.
- **📜 Execution History**: Comprehensive sidebar for monitoring previous runs, durations, and output data.

---

## 🧩 Node Modules

The builder features 6 specialized modules:

| Node | Description | Input | Output |
| :--- | :--- | :--- | :--- |
| **Text Node** | Static text or manual prompt entry. | Manual / Link | String |
| **Upload Image** | Client-side image uploader with preview. | File | Base64 Image |
| **Upload Video** | Video asset uploader with playback. | File | Video URL |
| **Run Any LLM** | Multimodal Gemini AI processing unit. | Text + Images | String |
| **Crop Image** | Smart image cropping (center-focus simulation). | Image | Cropped Image |
| **Extract Frame** | Grabs a specific hero frame from a video. | Video | Image Frame |

---

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Workflow Engine**: [React Flow](https://reactflow.dev/)
- **AI Integration**: [Google Generative AI SDK (Gemini)](https://ai.google.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Tailwind CSS

---

## 🏗 Workflow Architecture

The application implements a custom **Recursive Parallel Runner**. 

1. **Topological Sort**: The engine identifies "terminal nodes" (nodes with no outputs).
2. **Dependency Resolution**: For every node, it recursively resolves all upstream dependencies.
3. **Parallelism**: Branches that don't share dependencies are executed simultaneously.
4. **Validation**: The UI uses `isValidConnection` to enforce strict data-flow rules between handles.

---

## 📋 Sample Workflow: Product Marketing Kit

The app comes pre-loaded with a professional marketing pipeline:

1. **Branch A**: A product photo is passed through a **Crop Node** to focus on the item.
2. **Branch B**: A promotional video is processed to **Extract a Hero Frame**.
3. **Context**: Two **Text Nodes** provide the Brand Persona and Product Details.
4. **Convergence**: All 4 inputs (Cropped Image, Video Frame, Persona, and Details) feed into a single **LLM Node** which generates a cohesive social media campaign.

---

## 🚦 Getting Started

### Prerequisites
- A Google Gemini API Key.
- Node.js environment (for deployment).

### Environment Variables
```env
API_KEY=your_gemini_api_key_here
```

### Usage
1. Drag nodes from the **Left Sidebar** onto the canvas.
2. Connect handles using the mouse (observe the animated blue lines).
3. Click **"Run Pipeline"** in the top right to watch the execution ripple through the graph.
4. Review results in the **Right Sidebar** history tab.

---

## ⚖️ License
MIT © 2024 Weavy Visuals. Created with 💙 for the AI Developer Community.