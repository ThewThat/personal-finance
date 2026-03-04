import type { FC, ReactNode } from "react";
import type { ButtonVariant } from "../types";

interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-dca-cyan text-black border-none hover:brightness-110",
  danger:
    "bg-dca-red text-white border-none hover:brightness-110",
  success:
    "bg-dca-green text-white border-none hover:brightness-110",
  ghost:
    "bg-dca-card text-white border border-dca-border hover:border-dca-muted",
};

export const Button: FC<ButtonProps> = ({
  onClick,
  variant = "primary",
  children,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        rounded-md px-3.5 py-1.5 cursor-pointer text-xs font-mono font-bold
        tracking-wider flex items-center gap-1.5 transition-all
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};
