import { ComponentProps } from "react";

interface ButtonProps extends ComponentProps<'button'>{}


export const Button = (props:ButtonProps) => {
return (
  <button
{...props}
  className="text-sm text-emerald-800"
>
  Add tech
</button>
)
}