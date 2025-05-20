"use client";
import React, { useRef, useEffect } from "react";

interface ModalHeaderProps {
  hasHeader?: boolean;
  modalTitle?: string;
  style?: string;
  textStyle?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children?: React.ReactNode;
  isFullscreen?: boolean;
  modalHeader?: ModalHeaderProps;
  showCloseButton?: boolean; // ✅ Add this line
}


export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  isFullscreen = false,
  modalHeader = {},
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const contentClasses = isFullscreen
    ? "w-full h-full"
    : "md:max-w-[700px] w-full !duration-300 !ease-linear md:top-1/2 bottom-0 md:bottom-[unset] translate-y-0 !rounded-t-2xl md:!rounded-2xl gap-y-0 p-0 bg-white dark:bg-gray-900";

  return (
    <div className="fixed inset-0 z-9999999 flex items-end md:items-center justify-center overflow-y-auto">
      {!isFullscreen && (
        <div
          className="fixed inset-0 bg-gray-400/50 backdrop-blur-xs"
          onClick={onClose}
        ></div>
      )}
      <div
        ref={modalRef}
        className={`${contentClasses} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {modalHeader.hasHeader && (
          <div
            className={`flex items-center flex-row justify-between px-4 py-3.5 ${modalHeader.style ?? ""}`}
          >
            <h2
              className={`font-semibold text-xl ${modalHeader.textStyle ?? ""}`}
            >
              {modalHeader.modalTitle ?? ""}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="ms-auto text-slate-500"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};
