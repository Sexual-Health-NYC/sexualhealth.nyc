import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import theme from "../theme";
import { GlobeIcon } from "./Icons";
import LanguageSwitcher from "./LanguageSwitcher";

function FooterModal({ isOpen, onClose, title, children }) {
  const { t } = useTranslation(["actions"]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: theme.spacing[4],
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: theme.colors.background,
          borderRadius: theme.borderRadius.lg,
          maxWidth: "500px",
          width: "100%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: theme.shadows.lg,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: theme.spacing[4],
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: theme.fonts.size.lg,
              fontWeight: theme.fonts.weight.semibold,
              color: theme.colors.textPrimary,
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: theme.fonts.size.xl,
              color: theme.colors.textSecondary,
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
            }}
            aria-label={t("actions:close")}
          >
            ×
          </button>
        </div>
        <div
          style={{
            padding: theme.spacing[4],
            fontSize: theme.fonts.size.sm,
            color: theme.colors.textPrimary,
            lineHeight: 1.6,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function LanguageModal({ isOpen, onClose }) {
  const { t } = useTranslation(["footer", "actions"]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: theme.spacing[4],
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: theme.colors.background,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing[4],
          boxShadow: theme.shadows.lg,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing[3],
            gap: theme.spacing[3],
          }}
        >
          <div
            style={{
              fontSize: theme.fonts.size.sm,
              color: theme.colors.textSecondary,
            }}
          >
            {t("footer:selectLanguage")}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: theme.fonts.size.xl,
              color: theme.colors.textSecondary,
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
            }}
            aria-label={t("actions:close")}
          >
            ×
          </button>
        </div>
        <LanguageSwitcher onLanguageChange={onClose} />
      </div>
    </div>
  );
}

export default function Footer() {
  const { t } = useTranslation(["footer"]);
  const [activeModal, setActiveModal] = useState(null);

  return (
    <>
      <footer
        style={{
          padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
          borderTop: `1px solid ${theme.colors.border}`,
          backgroundColor: theme.colors.surface,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: theme.spacing[4],
          flexWrap: "wrap",
          fontSize: theme.fonts.size.xs,
          position: "relative",
          zIndex: 30,
        }}
      >
        <button
          onClick={() => setActiveModal("about")}
          style={{
            background: "none",
            border: "none",
            color: theme.colors.textSecondary,
            cursor: "pointer",
            padding: 0,
            fontSize: "inherit",
          }}
        >
          {t("footer:about")}
        </button>
        <button
          onClick={() => setActiveModal("privacy")}
          style={{
            background: "none",
            border: "none",
            color: theme.colors.textSecondary,
            cursor: "pointer",
            padding: 0,
            fontSize: "inherit",
          }}
        >
          {t("footer:privacy")}
        </button>
        <button
          onClick={() => setActiveModal("language")}
          style={{
            background: "none",
            border: "none",
            color: theme.colors.textSecondary,
            cursor: "pointer",
            padding: 0,
            fontSize: "inherit",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
          aria-label={t("footer:changeLanguage")}
        >
          <GlobeIcon style={{ width: "14px", height: "14px" }} />
        </button>
      </footer>

      <FooterModal
        isOpen={activeModal === "about"}
        onClose={() => setActiveModal(null)}
        title={t("footer:about")}
      >
        <p style={{ margin: `0 0 ${theme.spacing[3]} 0` }}>
          {t("footer:aboutText1")}
        </p>
        <p style={{ margin: `0 0 ${theme.spacing[3]} 0` }}>
          {t("footer:aboutText2")}
        </p>
        <p style={{ margin: 0, fontStyle: "italic" }}>
          {t("footer:aboutDisclaimer")}
        </p>
      </FooterModal>

      <FooterModal
        isOpen={activeModal === "privacy"}
        onClose={() => setActiveModal(null)}
        title={t("footer:privacy")}
      >
        <p
          style={{
            margin: `0 0 ${theme.spacing[3]} 0`,
            fontWeight: theme.fonts.weight.medium,
          }}
        >
          {t("footer:privacyIntro")}
        </p>
        <ul
          style={{
            margin: `0 0 ${theme.spacing[3]} 0`,
            paddingInlineStart: theme.spacing[4],
          }}
        >
          <li style={{ marginBottom: theme.spacing[2] }}>
            {t("footer:privacyNoAccounts")}
          </li>
          <li style={{ marginBottom: theme.spacing[2] }}>
            {t("footer:privacyAnalytics")}
          </li>
          <li style={{ marginBottom: theme.spacing[2] }}>
            {t("footer:privacyLanguage")}
          </li>
          <li style={{ marginBottom: theme.spacing[2] }}>
            {t("footer:privacyMaps")}
          </li>
          <li>{t("footer:privacyCorrections")}</li>
        </ul>
        <p style={{ margin: 0, color: theme.colors.textSecondary }}>
          {t("footer:privacyNoCookies")}
        </p>
      </FooterModal>

      <LanguageModal
        isOpen={activeModal === "language"}
        onClose={() => setActiveModal(null)}
      />
    </>
  );
}
