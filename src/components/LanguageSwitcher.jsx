import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import theme from "../theme";

export default function LanguageSwitcher({ onLanguageChange }) {
  const { i18n } = useTranslation();

  // Update html lang attribute and direction when language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir(i18n.language);
  }, [i18n.language]);

  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value);
    if (onLanguageChange) {
      onLanguageChange(e.target.value);
    }
  };

  return (
    <select
      value={i18n.language}
      onChange={handleChange}
      aria-label="Select language"
      style={{
        width: "100%",
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
      <option value="ru">Русский</option>
      <option value="bn">বাংলা</option>
      <option value="ht">Kreyòl Ayisyen</option>
      <option value="fr">Français</option>
      <option value="ar">العربية</option>
      <option value="ko">한국어</option>
      <option value="it">Italiano</option>
      <option value="tl">Tagalog</option>
      <option value="pl">Polski</option>
      <option value="ur">اردو</option>
      <option value="el">Ελληνικά</option>
      <option value="he">עברית</option>
      <option value="hi">हिन्दी</option>
      <option value="ja">日本語</option>
      <option value="yi">ייִדיש</option>
      <option value="pt">Português</option>
      <option value="vi">Tiếng Việt</option>
    </select>
  );
}
