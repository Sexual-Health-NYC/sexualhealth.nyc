import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import theme from "../theme";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  // Update html lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      aria-label="Select language"
      style={{
        padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
        backgroundColor: theme.colors.surface,
        color: theme.colors.textPrimary,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.sm,
        fontSize: theme.fonts.size.sm,
        fontWeight: theme.fonts.weight.medium,
        cursor: "pointer",
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = theme.focus.outline;
        e.currentTarget.style.outlineOffset = theme.focus.outlineOffset;
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = "none";
      }}
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="zh">中文</option>
    </select>
  );
}
