import { HandleType } from "@xyflow/react";

const nothing = async () => {};

const preventDefault = (e: { preventDefault: () => void }) => {
  e.preventDefault();
};

const stopPropagation = (e: { stopPropagation: () => void }) => {
  e.stopPropagation();
};

const getHandleId = (key: string, type: HandleType) => {
  return `${type}_handle_${key.replaceAll("$", "")}`;
};

export { nothing, preventDefault, stopPropagation, getHandleId };
