import { ComponentProps } from "react";

interface LabelProps extends ComponentProps<"label"> {}

export const Label = (props: LabelProps) => {
  return (
    <label
      className="text-white flex items-center justify-between"
      {...props}
    />
  );
};
