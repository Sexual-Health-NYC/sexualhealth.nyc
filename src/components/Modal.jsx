import { useTranslation } from "react-i18next";
import useEscapeKey from "../hooks/useEscapeKey";
import CloseButton from "./CloseButton";

/**
 * Reusable modal component with backdrop, title, and close button.
 * Handles escape key to close and click-outside dismissal.
 */
export default function Modal({ isOpen, onClose, title, children, className }) {
  const { t } = useTranslation(["actions"]);

  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg max-w-[500px] w-full max-h-[80vh] overflow-auto shadow-lg ${className || ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex justify-between items-center p-4 border-b border-border">
            <h2 className="m-0 text-lg font-semibold text-text-primary">
              {title}
            </h2>
            <CloseButton onClick={onClose} label={t("actions:close")} />
          </div>
        )}
        <div
          className={
            title ? "p-4 text-sm text-text-primary leading-relaxed" : ""
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
