const cx = (
  ...classNames: (string | { [key: string]: boolean } | undefined)[]
): string => {
  const classes: string[] = [];

  classNames.forEach((className) => {
    if (typeof className === "string") {
      classes.push(className);
    } else if (typeof className === "object") {
      Object.keys(className).forEach((key) => {
        if (className[key]) classes.push(key);
      });
    }
  });

  return classes.join(" ");
};

export default cx;
