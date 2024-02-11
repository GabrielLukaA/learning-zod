import { useFormContext } from "react-hook-form";

interface ErrorMessageProps {
  field: string;
}

export const ErrorMessage = ({ field }: ErrorMessageProps) => {
  // Não compreendi a função, mas básicamente ele passa por esse objeto em busca do erro
  function get(obj: Record<any, any>, path: string) {
    const travel = (regexp: RegExp) =>
      String.prototype.split
        .call(path, regexp)
        .filter(Boolean)
        .reduce(
          (res, key) => (res !== null && res !== undefined ? res[key] : res),
          obj
        );

    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);

    return result;
  }

  // Aqui se faz uso do formContext para pegar todos os erros!
  const {
    formState: { errors },
  } = useFormContext();
  const fieldError = get(errors, field);

  if (!fieldError) {
    return null;
  }

  return (
    <span className=" text-red-500 text-sm py-2">
      {fieldError.message?.toString()}
    </span>
  );
};
