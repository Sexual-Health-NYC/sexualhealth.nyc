import { useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "../theme";

export default function CorrectionFormModal({
  clinicName,
  onClose,
  isExpanded,
}) {
  const { t } = useTranslation(["forms"]);
  const [correction, setCorrection] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!correction.trim()) {
      setStatus("error");
      setMessage(t("forms:correctionRequired"));
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/submit-correction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicName,
          correction: correction.trim(),
          email: email.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || t("forms:correctionSuccess"));
        setTimeout(() => {
          setCorrection("");
          setEmail("");
          setStatus("idle");
          setMessage("");
          onClose();
        }, 3000);
      } else {
        setStatus("error");
        setMessage(data.error || t("forms:correctionError"));
      }
    } catch {
      setStatus("error");
      setMessage(t("forms:correctionError"));
    }
  };

  if (!isExpanded) return null;

  return (
    <div
      style={{
        marginTop: theme.spacing[3],
        padding: theme.spacing[4],
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <p
        style={{
          fontSize: theme.fonts.size.sm,
          color: theme.colors.textSecondary,
          marginTop: 0,
          marginBottom: theme.spacing[3],
        }}
      >
        {t("forms:correctionFormDescription")} <strong>{clinicName}</strong>.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: theme.spacing[3] }}>
          <label
            htmlFor="correction"
            style={{
              display: "block",
              fontSize: theme.fonts.size.sm,
              fontWeight: theme.fonts.weight.medium,
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing[2],
            }}
          >
            {t("forms:whatNeedsCorrection")}{" "}
            <span aria-label={t("forms:required")}>*</span>
          </label>
          <textarea
            id="correction"
            required
            value={correction}
            onChange={(e) => setCorrection(e.target.value)}
            placeholder={t("forms:correctionPlaceholder")}
            rows={4}
            style={{
              width: "100%",
              padding: theme.spacing[3],
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.fonts.size.base,
              fontFamily: theme.fonts.family,
              resize: "vertical",
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = theme.focus.outline;
              e.currentTarget.style.outlineOffset = theme.focus.outlineOffset;
              e.currentTarget.style.borderColor = theme.colors.primary;
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
              e.currentTarget.style.borderColor = theme.colors.border;
            }}
          />
        </div>

        <div style={{ marginBottom: theme.spacing[3] }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              fontSize: theme.fonts.size.sm,
              fontWeight: theme.fonts.weight.medium,
              color: theme.colors.textPrimary,
              marginBottom: theme.spacing[2],
            }}
          >
            {t("forms:yourEmail")}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("forms:emailPlaceholder")}
            style={{
              width: "100%",
              padding: theme.spacing[3],
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.fonts.size.base,
              fontFamily: theme.fonts.family,
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = theme.focus.outline;
              e.currentTarget.style.outlineOffset = theme.focus.outlineOffset;
              e.currentTarget.style.borderColor = theme.colors.primary;
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
              e.currentTarget.style.borderColor = theme.colors.border;
            }}
          />
          <p
            style={{
              fontSize: theme.fonts.size.xs,
              color: theme.colors.textSecondary,
              marginTop: theme.spacing[1],
              marginBottom: 0,
            }}
          >
            {t("forms:emailDisclaimer")}
          </p>
        </div>

        {message && (
          <div
            role={status === "error" ? "alert" : "status"}
            style={{
              padding: theme.spacing[3],
              borderRadius: theme.borderRadius.md,
              marginBottom: theme.spacing[3],
              backgroundColor:
                status === "success"
                  ? "#d1fae5"
                  : status === "error"
                    ? "#fee2e2"
                    : theme.colors.surface,
              color:
                status === "success"
                  ? "#065f46"
                  : status === "error"
                    ? "#991b1b"
                    : theme.colors.textPrimary,
              fontSize: theme.fonts.size.sm,
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: theme.spacing[2],
            justifyContent: "flex-end",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={status === "submitting"}
            style={{
              padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
              backgroundColor: "white",
              color: theme.colors.textSecondary,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.fonts.size.sm,
              fontWeight: theme.fonts.weight.medium,
              cursor: status === "submitting" ? "not-allowed" : "pointer",
              opacity: status === "submitting" ? 0.5 : 1,
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = theme.focus.outline;
              e.currentTarget.style.outlineOffset = theme.focus.outlineOffset;
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
            }}
          >
            {t("forms:cancel")}
          </button>
          <button
            type="submit"
            disabled={status === "submitting" || status === "success"}
            style={{
              padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
              backgroundColor: theme.colors.primary,
              color: "white",
              border: "none",
              borderRadius: theme.borderRadius.md,
              fontSize: theme.fonts.size.sm,
              fontWeight: theme.fonts.weight.medium,
              cursor:
                status === "submitting" || status === "success"
                  ? "not-allowed"
                  : "pointer",
              opacity:
                status === "submitting" || status === "success" ? 0.5 : 1,
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = theme.focus.outline;
              e.currentTarget.style.outlineOffset = theme.focus.outlineOffset;
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
            }}
          >
            {status === "submitting"
              ? t("forms:submitting")
              : status === "success"
                ? t("forms:submitted")
                : t("forms:submitCorrection")}
          </button>
        </div>
      </form>
    </div>
  );
}
