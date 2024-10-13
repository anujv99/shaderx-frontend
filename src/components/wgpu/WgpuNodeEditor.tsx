import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  addEdge,
  Background,
  Connection,
  Controls,
  NodeProps,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { DM_Mono as CustomFont } from "next/font/google";

const font = CustomFont({
  display: "swap",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

import { IShaderData } from "../../utils/types";
import WgpuCanvas, { WgpuCanvasRef } from "./WgpuCanvas";
import { NodeCompiler } from "./compiler";
import { NodeMenu } from "../menu";
import { newShaderNodes } from "../../utils/data";
import { Nodes } from "./nodes";

type WgpuNodeEditorProps = {
  shader: IShaderData;
};

let nodeId = 1;

const getId = () => {
  return `${nodeId++}`;
};

const nodeTypes = Object.keys(Nodes).reduce(
  (acc, key) => {
    acc[key] = Nodes[key].comp;
    return acc;
  },
  {} as { [key: string]: React.FC<NodeProps> },
);

const compiler = new NodeCompiler();

const WgpuNodeEditor: React.FC<WgpuNodeEditorProps> = (props) => {
  const { shader } = props;

  const wgpuCanvasRef = useRef<WgpuCanvasRef>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(newShaderNodes.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(newShaderNodes.edges);
  const { screenToFlowPosition } = useReactFlow();

  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    (async () => {
      const compiled = compiler.compile(nodes, edges);
      console.log(compiled);
      if (compiled) {
        const res = await wgpuCanvasRef.current?.updateShader(compiled);
        if (res?.isEmpty()) return;

        res?.forEach((err) => console.error(err.message));
      }
    })();
  }, [nodes, edges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((edges) => addEdge(params, edges));
    },
    [setEdges],
  );

  const onContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setMenu({ x: e.clientX, y: e.clientY });
    },
    [setMenu],
  );

  const onCloseMenu = useCallback(() => {
    setMenu(null);
  }, [setMenu]);

  const onNodeSelect = useCallback(
    (node: string) => {
      if (!menu) return;

      setNodes((nodes) => [
        ...nodes,
        {
          id: getId(),
          position: screenToFlowPosition(menu),
          data: {},
          type: node,
        },
      ]);
      onCloseMenu();
    },
    [menu, screenToFlowPosition, setNodes, onCloseMenu],
  );

  const onNodeCopy = useCallback(() => {
    const data = { nodes, edges };
    navigator.clipboard.writeText(JSON.stringify(data));
    onCloseMenu();
  }, [nodes, edges, onCloseMenu]);

  const onNodePaste = useCallback(() => {
    navigator.clipboard.readText().then((data) => {
      try {
        const { nodes, edges } = JSON.parse(data);
        setNodes(nodes);
        setEdges(edges);
      } catch (e) {
        console.error(e);
      }
    });
    onCloseMenu();
  }, [setNodes, setEdges, onCloseMenu]);

  return (
    <div className="w-full grid grid-cols-2 gap-4 relative flex-1">
      <WgpuCanvas ref={wgpuCanvasRef} initialData={shader} />
      <ReactFlow
        className={font.className}
        colorMode="dark"
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        proOptions={{
          hideAttribution: true,
        }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onContextMenu={onContextMenu}
      >
        <Background />
        <Controls />
        {menu && (
          <NodeMenu
            nodes={nodeTypes}
            position={menu}
            close={onCloseMenu}
            onNodeSelect={onNodeSelect}
            onNodeCopy={onNodeCopy}
            onNodePaste={onNodePaste}
          />
        )}
      </ReactFlow>
    </div>
  );
};

export default (props: WgpuNodeEditorProps) => (
  <ReactFlowProvider>
    <WgpuNodeEditor {...props} />
  </ReactFlowProvider>
);
