import React from "react";
import { cx } from "../../utils";

type Props = React.PropsWithChildren<{
  className?: string;
}>;

const Container: React.FC<Props> = (props) => {
  const { children, className } = props;

  return (
    <div className="w-full h-12">
      <div
        className={cx(
          "fixed left-0 right-0 top-0 h-inherit bg-gray-1 border-b border-b-gray-a4",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Container;
