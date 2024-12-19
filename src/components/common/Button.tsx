import { ButtonHTMLAttributes } from "react";
import { globalColors } from "../../data/data";
import { Color } from "../../interfaces/context/Config.interface";
import useStore from "../../store/useStore";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  newColor?: "bg-red-700";
  noMarginTop?: boolean;
}

export const Button = ({
  children,
  className = "",
  newColor,
  noMarginTop,
  ...props
}: ButtonProps) => {
  const color = useStore((store) => store.config.color);

  return (
    <button
      className={`${className} ${!noMarginTop && "mt-4"} dark-text-title flex items-center gap-2 rounded-lg px-4 py-2 transition-colors duration-300 ${newColor ? newColor : globalColors.bg[color as Color].base} ${newColor ? newColor : globalColors.bg[color as Color].darkHover}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const ButtonBorder = ({
  children,
  className = "",
  newColor,
  noMarginTop,
  ...props
}: ButtonProps) => {
  const color = useStore((store) => store.config.color);

  return (
    <button
      className={`${className} ${!noMarginTop && "mt-4"} dark-text-title flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors duration-300 ${newColor ? newColor : globalColors.border[color as Color].base}`}
      {...props}
    >
      {children}
    </button>
  );
};
