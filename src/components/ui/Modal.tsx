import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-md bg-white rounded-[24px] shadow-[var(--shadow-lift)] p-7 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between mb-4">
          <h2 id="modal-title" className="text-xl font-bold">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center min-w-11 min-h-11 -mr-2 -mt-2 text-navy/50 hover:text-navy text-xl leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
