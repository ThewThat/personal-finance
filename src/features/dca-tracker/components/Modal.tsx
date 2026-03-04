import type { FC, ReactNode } from "react";
import { Icon } from "./Icon";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: FC<ModalProps> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-1000">
    <div className="bg-dca-panel border border-dca-border rounded-xl p-6 w-[500px] max-w-[93vw] max-h-[85vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-dca-text font-mono text-sm font-normal tracking-wider m-0">
          {title}
        </h3>
        <button
          onClick={onClose}
          className="bg-transparent border-none text-dca-muted cursor-pointer hover:text-dca-text transition-colors"
        >
          <Icon name="x" />
        </button>
      </div>
      {children}
    </div>
  </div>
);
