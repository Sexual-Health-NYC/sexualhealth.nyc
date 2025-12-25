import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function LanguageSwitcher({ onLanguageChange }) {
  const { i18n } = useTranslation();

  // Update html lang attribute and direction when language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.dir(i18n.language);
  }, [i18n, i18n.language]);

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
      className="py-2 px-3 bg-surface text-text-primary border border-border rounded-sm text-sm font-medium cursor-pointer focus-ring"
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
