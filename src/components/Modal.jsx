import * as Dialog from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";
import CloseButton from "./CloseButton";

/**
 * Reusable modal component built on Radix UI Dialog.
 * Provides accessible dialog with proper focus management and keyboard handling.
 */
export default function Modal({ isOpen, onClose, title, children, className }) {
  const { t } = useTranslation(["actions"]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[1000] data-[state=open]:animate-fade-in" />
        <Dialog.Content
          className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg max-w-[500px] w-[calc(100%-2rem)] max-h-[80vh] overflow-auto shadow-lg z-[1001] data-[state=open]:animate-fade-in ${className || ""}`}
        >
          {title && (
            <div className="flex justify-between items-center p-4 border-b border-border">
              <Dialog.Title className="m-0 text-lg font-semibold text-text-primary">
                {title}
              </Dialog.Title>
              <Dialog.Close asChild>
                <CloseButton onClick={onClose} label={t("actions:close")} />
              </Dialog.Close>
            </div>
          )}
          <Dialog.Description asChild>
            <div
              className={
                title ? "p-4 text-sm text-text-primary leading-relaxed" : ""
              }
            >
              {children}
            </div>
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
