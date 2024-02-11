import { ComponentProps } from "react"

interface FieldProps extends ComponentProps<'div'>{

}

export const Field = (props:FieldProps) => {
  return (
    <div className="flex flex-col gap-1" {...props}/>
  )
}