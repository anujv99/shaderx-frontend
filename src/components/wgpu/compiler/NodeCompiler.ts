import { Edge, Node } from "@xyflow/react";
import assert from "assert";
import { IVec4, MathOp, TrignoOp } from "../../../utils/types";
import { vertexShaderCode } from "../../../utils/data";

type ProcessNodeResult = {
  code: string;
  vars: string[];
};

class NodeCompiler {
  private lastVarId = 0;

  private processedNodes: Map<string, ProcessNodeResult> = new Map();

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

    const { code } = this.processNode(fragColor, nodes, edges);

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
    nodes: Node[],
    edges: Edge[],
  ): ProcessNodeResult {
    const previousNodes = this.getPreviousNodes(node, nodes, edges);

    let previousCode = "";
    let previousVars: string[] = [];

    if (previousNodes.length > 0) {
      previousNodes.forEach((n) => {
        const { code, vars } = this.processNode(n, nodes, edges);
        previousCode = `
          ${previousCode}
          ${code}
        `;
        previousVars.push(...vars);
      });
    }

    previousVars = Array.from(new Set(previousVars));
    const nodeCode = this.convertNodeToCode(node, previousVars);

    return {
      code: `
        ${previousCode}
        ${nodeCode?.code}
      `,
      vars: nodeCode?.vars || [],
    };
  }

  private getPreviousNodes(node: Node, nodes: Node[], edges: Edge[]): Node[] {
    const previousEdges = edges.filter((e) => e.target === node.id);
    return previousEdges
      .map((e) => nodes.find((n) => n.id === e.source))
      .filter(Boolean) as Node[];
  }

  private generateVarName() {
    return `var${this.lastVarId++}`;
  }

  private generateVarNames(count: number) {
    return new Array(count).fill(null).map(() => this.generateVarName());
  }

  private convertNodeToCode(
    node: Node,
    inputVars: string[],
  ): ProcessNodeResult | undefined {
    let data: ProcessNodeResult | undefined;

    const previousData = this.processedNodes.get(node.id);
    if (previousData) {
      return {
        code: "",
        vars: previousData.vars,
      };
    }

    switch (node.type) {
      case "color":
        data = this.pColorNode(node);
        break;
      case "fragColor":
        data = this.pFragColorNode(node, inputVars);
        break;
      case "fragPos":
        data = this.pFragPosNode(node);
        break;
      case "math":
        data = this.pMathNode(node, inputVars);
        break;
      case "time":
        data = this.pTimeNode(node);
        break;
      case "trigno":
        data = this.pTrignoNode(node, inputVars);
        break;
      case "split":
        data = this.pSplitNode(node, inputVars);
        break;
      case "combine":
        data = this.pCombineNode(node, inputVars);
        break;
      case "number":
        data = this.pNumberNode(node);
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

  private pColorNode(node: Node): ProcessNodeResult {
    const vars = this.generateVarName();
    const col = node.data.color as IVec4;

    return {
      code: `let ${vars} = vec4<f32>(${col.x}, ${col.y}, ${col.z}, ${col.w});`,
      vars: [vars],
    };
  }

  private pFragColorNode(_node: Node, inputVars: string[]): ProcessNodeResult {
    assert(inputVars.length === 1);

    return {
      code: `return vec4<f32>(${inputVars[0]});`,
      vars: inputVars,
    };
  }

  private pFragPosNode(_node: Node): ProcessNodeResult {
    const vars = this.generateVarName();
    return {
      code: `let ${vars} = vec2<f32>(in.vert_position.xy);`,
      vars: [vars],
    };
  }

  private pMathNode(node: Node, inputVars: string[]): ProcessNodeResult {
    assert(inputVars.length === 2);

    const vars = this.generateVarName();
    const op = (node.data.op || MathOp.add) as MathOp;

    return {
      code: `let ${vars} = ${inputVars[0]} ${op} ${inputVars[1]};`,
      vars: [vars],
    };
  }

  private pTimeNode(_: Node): ProcessNodeResult {
    return {
      code: ``,
      vars: [`buffer.time`],
    };
  }

  private pTrignoNode(node: Node, inputVars: string[]): ProcessNodeResult {
    assert(inputVars.length === 1);

    const vars = this.generateVarName();
    const op = (node.data.op || TrignoOp.sin) as TrignoOp;

    return {
      code: `let ${vars} = ${op}(${inputVars[0]});`,
      vars: [vars],
    };
  }

  private pSplitNode(_node: Node, inputVars: string[]): ProcessNodeResult {
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

  private pCombineNode(_node: Node, inputVars: string[]): ProcessNodeResult {
    assert(inputVars.length === 4);

    const vars = this.generateVarName();

    return {
      code: `let ${vars} = vec4<f32>(${inputVars.join(", ")});`,
      vars: [vars],
    };
  }

  private pNumberNode(node: Node): ProcessNodeResult {
    const vars = this.generateVarName();
    let number = node.data.number as number;
    if (typeof number === "undefined") number = 0;

    return {
      code: `let ${vars} = f32(${number});`,
      vars: [vars],
    };
  }
}

export default NodeCompiler;
