import { useTranslation } from "react-i18next";

/**
 * Reusable close button component.
 * Used in modals, panels, and other dismissible UI elements.
 */
export default function CloseButton({
  onClick,
  size = "md",
  className = "",
  label,
}) {
  const { t } = useTranslation(["actions"]);

  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <button
      onClick={onClick}
      className={`bg-transparent border-none text-text-secondary cursor-pointer p-0 leading-none hover:text-text-primary transition-colors ${sizeClasses[size]} ${className}`}
      aria-label={label || t("actions:close")}
    >
      ×
    </button>
  );
}
