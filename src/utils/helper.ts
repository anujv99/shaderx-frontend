const nothing = async () => {};

const preventDefault = (e: { preventDefault: () => void }) => {
  e.preventDefault();
};

const stopPropagation = (e: { stopPropagation: () => void }) => {
  e.stopPropagation();
};

export { nothing, preventDefault, stopPropagation };
