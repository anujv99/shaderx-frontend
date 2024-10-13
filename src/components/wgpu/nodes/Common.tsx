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
import { getHandleId } from "../../../utils/helper";

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
  id: string;
  heading?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ id, heading, className, style, children }) => {
  return (
    <Card id={id} className={cx("p-0", className)} style={style}>
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
    containerId: string;
    htmlFor?: string;
  }
> = ({ containerId, htmlFor, type, ...rest }) => {
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

    const parent = document.getElementById(containerId);
    if (!parent) return;

    const elId = `#${getHandleId(htmlFor, type)}`;
    const el = parent.querySelector(elId);
    if (!el) return;

    const parentRect = parent.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    let top = elRect.top - parentRect.top + elRect.height / 2;
    top /= zoomRef.current;

    setPos(top);
  }, [htmlFor, type, containerId]);

  useLayoutEffect(() => {
    if (!htmlFor) return;

    const parent = document.getElementById(containerId);
    const elId = `#${getHandleId(htmlFor, type)}`;
    const el = parent?.querySelector(elId);
    if (!el) return;

    const observer = new ResizeObserver(recalculatePos);
    observer.observe(el);

    return () => observer.disconnect();
  }, [type, containerId, htmlFor]);

  return (
    <Handle
      type={type}
      style={{
        top: pos,
        ...rest.style,
      }}
      {...rest}
    />
  );
};

export { NodeContainer, NodeLabel, NodeHandle };
