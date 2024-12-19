import { FormHTMLAttributes } from "react";

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export const Form = ({ children, ...props }: Props) => {
  return (
    <form className="flex flex-col items-center gap-2" {...props}>
      {children}
    </form>
  );
};
