import { ComponentProps } from "react";
import { useFormContext } from "react-hook-form";
interface InputProps extends ComponentProps<"input"> {
  name: string;
  type: string;
}
export const Input = ({ name, type, ...props }: InputProps) => {
  // nessa context eu tenho acesso a tudo referente ao formulário provider do componente!
  const { register } = useFormContext();
  return (
    <input
      type={type}
      className="py-2 bg-zinc-950 shadow-lg text-white rounded-lg"
      {...register(name)}
      {...props}
    />
  );
};
