import { Card, Flex, Separator, Text } from "@radix-ui/themes";
import {
  Handle,
  HandleProps,
  useNodeId,
  useStore,
  useUpdateNodeInternals,
} from "@xyflow/react";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cx } from "../../../utils";

const NodeLabel: React.FC<{
  className?: string;
  id?: string;
  children: React.ReactNode;
}> = ({ className, id, children }) => {
  return (
    <Text id={id} size="1" className={className}>
      {children}
    </Text>
  );
};

const NodeContainer: React.FC<{
  heading?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ heading, className, style, children }) => {
  return (
    <Card className={cx("p-0", className)} style={style}>
      {heading && (
        <>
          <Text className="px-2 py-1" size="1">
            {heading}
          </Text>
          <Separator className="w-full" />
        </>
      )}
      <Flex className="flex-col gap-1 p-2">{children}</Flex>
    </Card>
  );
};

const NodeHandle: React.FC<
  HandleProps & {
    htmlFor?: string;
  }
> = ({ htmlFor, ...rest }) => {
  const [pos, setPos] = useState<number | undefined>(undefined);

  const nodeId = useNodeId();
  const update = useUpdateNodeInternals();

  const zoom = useStore((s) => s.transform[2]);
  const zoomRef = useRef(zoom);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    if (nodeId) update(nodeId);
  }, [pos, nodeId]);

  const recalculatePos = useCallback(() => {
    if (!htmlFor) return;

    const el = document.getElementById(htmlFor);
    if (!el) return;

    const parent = el.closest(".react-flow__node");
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    let top = elRect.top - parentRect.top + elRect.height / 2;
    top /= zoomRef.current;

    setPos(top);
  }, [htmlFor]);

  useLayoutEffect(() => {
    const el = htmlFor && document.getElementById(htmlFor);
    if (!el) return;

    const observer = new ResizeObserver(recalculatePos);
    observer.observe(el);

    return () => observer.disconnect();
  }, [htmlFor]);

  return (
    <Handle
      style={{
        top: pos,
        ...rest.style,
      }}
      {...rest}
    />
  );
};

export { NodeContainer, NodeLabel, NodeHandle };
