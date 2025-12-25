import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useEscapeKey from "../hooks/useEscapeKey";
import { GlobeIcon } from "./Icons";
import LanguageSwitcher from "./LanguageSwitcher";

function FooterModal({ isOpen, onClose, title, children }) {
  const { t } = useTranslation(["actions"]);

  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-[500px] w-full max-h-[80vh] overflow-auto shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="m-0 text-lg font-semibold text-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-xl text-text-secondary cursor-pointer p-0 leading-none"
            aria-label={t("actions:close")}
          >
            ×
          </button>
        </div>
        <div className="p-4 text-sm text-text-primary leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

function LanguageModal({ isOpen, onClose }) {
  const { t } = useTranslation(["footer", "actions"]);

  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3 gap-3">
          <div className="text-sm text-text-secondary">
            {t("footer:selectLanguage")}
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-xl text-text-secondary cursor-pointer p-0 leading-none"
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

export default function Footer({ isMobile, isMapMode }) {
  const { t, i18n } = useTranslation(["footer"]);
  const [activeModal, setActiveModal] = useState(null);

  // Reset modal state when language changes to prevent stuck modals
  useEffect(() => {
    setActiveModal(null);
  }, [i18n.language]);

  // On mobile in map mode, position fixed at bottom so it's always accessible
  const isFixed = isMobile && isMapMode;

  const footerButtonClass =
    "bg-transparent border-none text-text-secondary cursor-pointer p-0 text-xs";

  return (
    <>
      <footer
        className={`py-2 px-4 border-t border-border bg-surface flex justify-center items-center gap-4 flex-wrap text-xs z-30 ${
          isFixed ? "fixed bottom-0 left-0 right-0" : "relative"
        }`}
      >
        <button
          onClick={() => setActiveModal("about")}
          className={footerButtonClass}
        >
          {t("footer:about")}
        </button>
        <button
          onClick={() => setActiveModal("privacy")}
          className={footerButtonClass}
        >
          {t("footer:privacy")}
        </button>
        <button
          onClick={() => setActiveModal("language")}
          className={`${footerButtonClass} flex items-center gap-1`}
          aria-label={t("footer:changeLanguage")}
        >
          <GlobeIcon className="w-3.5 h-3.5" />
        </button>
      </footer>

      <FooterModal
        isOpen={activeModal === "about"}
        onClose={() => setActiveModal(null)}
        title={t("footer:about")}
      >
        <p className="m-0 mb-3">{t("footer:aboutText1")}</p>
        <p className="m-0 mb-3">{t("footer:aboutText2")}</p>
        <p className="m-0 italic">{t("footer:aboutDisclaimer")}</p>
        <div className="mt-4 pt-2 border-t border-border text-[10px] text-text-secondary font-mono">
          v.{__COMMIT_HASH__}
        </div>
      </FooterModal>

      <FooterModal
        isOpen={activeModal === "privacy"}
        onClose={() => setActiveModal(null)}
        title={t("footer:privacy")}
      >
        <p className="m-0 mb-3 font-medium">{t("footer:privacyIntro")}</p>
        <ul className="m-0 mb-3 ps-4">
          <li className="mb-2">{t("footer:privacyNoAccounts")}</li>
          <li className="mb-2">{t("footer:privacyAnalytics")}</li>
          <li className="mb-2">{t("footer:privacyLanguage")}</li>
          <li className="mb-2">{t("footer:privacyMaps")}</li>
          <li>{t("footer:privacyCorrections")}</li>
        </ul>
        <p className="m-0 text-text-secondary">
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
