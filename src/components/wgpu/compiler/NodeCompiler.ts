import { Edge, Node } from "@xyflow/react";
import assert from "assert";
import {
  IIProcessNodeResult,
  IProcessNodeProps,
  IProcessNodeResult,
  IVec4,
  MathOp,
  TrignoOp,
} from "../../../utils/types";
import { vertexShaderCode } from "../../../utils/data";
import { getNodeSpec } from "../nodes";

class NodeCompiler {
  private lastVarId = 0;

  private processedNodes: Map<string, IIProcessNodeResult> = new Map();

  constructor() {}

  compile(nodes: Node[], edges: Edge[]) {
    this.lastVarId = 0;
    this.processedNodes.clear();

    // remove unused nodes
    const usedNodes = this.removeUnusedNodes(nodes, edges);
    if (usedNodes.length === 0) return null;

    // find the fragColor node
    const fragColor = this.getFragColorNode(nodes);
    if (!fragColor) return null;
    const fragColorEdge = this.getFragColorEdge(fragColor, edges);
    if (!fragColorEdge) return null;

    const { code } = this.processNode(fragColor, fragColorEdge, nodes, edges);

    return `
      ${vertexShaderCode}

      @fragment
      fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
        ${code}
      }
    `;
  }

  private getFragColorNode(nodes: Node[]) {
    return nodes.find((n) => n.type === "fragColor");
  }

  private getFragColorEdge(node: Node, edges: Edge[]) {
    return edges.find((e) => e.target === node.id);
  }

  private removeUnusedNodes(nodes: Node[], edges: Edge[]): Node[] {
    const usedNodes = new Set<string>();

    edges.forEach((edge) => {
      usedNodes.add(edge.source);
      usedNodes.add(edge.target);
    });

    return nodes.filter((n) => usedNodes.has(n.id));
  }

  private processNode(
    node: Node,
    edge: Edge,
    nodes: Node[],
    edges: Edge[],
  ): IProcessNodeResult {
    const previousNodes = this.getPreviousNodes(node, nodes, edges);

    let previousCode = "";
    let previousVars: string[] = [];

    if (previousNodes.length > 0) {
      previousNodes.forEach((n) => {
        const { code, vars } = this.processNode(n[0], n[1], nodes, edges);
        previousCode = `
          ${previousCode}
          ${code}
        `;
        previousVars.push(...vars);
      });
    }

    previousVars = Array.from(new Set(previousVars));
    const nodeCode = this.convertNodeToCode(node, edge, previousVars);

    return {
      code: `
        ${previousCode}
        ${nodeCode?.code}
      `,
      vars: nodeCode?.vars || [],
    };
  }

  private getPreviousNodes(
    node: Node,
    nodes: Node[],
    edges: Edge[],
  ): [Node, Edge][] {
    const previousEdges = edges.filter((e) => e.target === node.id);
    return previousEdges
      .map((e) => {
        const sourceNode = nodes.find((n) => n.id === e.source);
        if (!sourceNode) return undefined;
        return [sourceNode, e];
      })
      .filter(Boolean) as [Node, Edge][];
  }

  private generateVarName() {
    return `var${this.lastVarId++}`;
  }

  private generateVarNames(count: number) {
    return new Array(count).fill(null).map(() => this.generateVarName());
  }

  private convertNodeToCode(
    node: Node,
    edge: Edge,
    inputVars: string[],
  ): IProcessNodeResult | undefined {
    let data: IProcessNodeResult | undefined;

    const previousData = this.processedNodes.get(node.id);
    if (previousData) {
      return {
        code: "",
        vars: previousData.vars,
      };
    }

    const spec = getNodeSpec(node.type);
    assert(spec);

    const props: IProcessNodeProps = {
      node,
      edge,
      spec,
      inputVars,
      generateVarName: this.generateVarNames.bind(this),
    };

    switch (node.type) {
      case "color":
      case "fragColor":
      case "fragPos":
      case "math":
      case "time":
      case "trigno":
      case "number":
        data = spec.getCode(props);
        break;
      case "split":
        data = this.pSplitNode(node, inputVars);
        break;
      case "combine":
        data = this.pCombineNode(node, inputVars);
        break;
      default:
        break;
    }

    if (data) {
      this.processedNodes.set(node.id, data);
      return data;
    }

    return undefined;
  }

  private pSplitNode(_node: Node, inputVars: string[]): IProcessNodeResult {
    assert(inputVars.length === 1);
    const vars = this.generateVarNames(4);

    // TODO: fix this
    return {
      code: `
        let ${vars[0]} = ${inputVars[0]}.x;
        let ${vars[1]} = ${inputVars[0]}.y;
        let ${vars[2]} = 0.0f;
        let ${vars[3]} = 1.0f;
      `,
      vars,
    };
  }

  private pCombineNode(_node: Node, inputVars: string[]): IProcessNodeResult {
    assert(inputVars.length === 4);

    const vars = this.generateVarName();

    return {
      code: `let ${vars} = vec4<f32>(${inputVars.join(", ")});`,
      vars: [vars],
    };
  }
}

export default NodeCompiler;
