import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="bg-opacity-50 absolute inset-0 bg-black transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={twMerge(
          "relative z-10 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
  className?: string;
}

export function ModalHeader({ title, onClose, className }: ModalHeaderProps) {
  return (
    <div
      className={twMerge(
        "flex items-center justify-between border-b border-gray-200 px-6 py-4",
        className,
      )}
    >
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <button
        onClick={onClose}
        className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

export function ModalBody({ children, className }: ModalBodyProps) {
  return (
    <div
      className={twMerge(
        "max-h-[calc(90vh-8rem)] overflow-y-auto px-6 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
