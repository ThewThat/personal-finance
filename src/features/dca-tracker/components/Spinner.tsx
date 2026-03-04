import type { FC } from "react";

interface SpinnerProps {
  size?: number;
  className?: string;
}

export const Spinner: FC<SpinnerProps> = ({ size = 16, className = "" }) => (
  <div
    className={`shrink-0 rounded-full border-2 border-dca-cyan/20 border-t-dca-cyan animate-spin ${className}`}
    style={{ width: size, height: size }}
  />
);
