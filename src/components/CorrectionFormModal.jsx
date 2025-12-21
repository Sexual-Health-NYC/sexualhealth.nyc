import { useState } from "react";
import { useTranslation } from "react-i18next";
import theme from "../theme";

export default function CorrectionFormModal({ clinicName, onClose }) {
  const { t } = useTranslation(["forms"]);
  const [correction, setCorrection] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error
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
          onClose();
        }, 3000);
      } else {
        setStatus("error");
        setMessage(data.error || t("forms:correctionError"));
      }
    } catch (error) {
      setStatus("error");
      setMessage(t("forms:correctionError"));
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
        }}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="correction-form-title"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          borderRadius: theme.borderRadius.lg,
          boxShadow: theme.shadows.lg,
          padding: theme.spacing[6],
          maxWidth: "500px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          zIndex: 1001,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: theme.spacing[4],
          }}
        >
          <h2
            id="correction-form-title"
            style={{
              fontSize: theme.fonts.size.xl,
              fontWeight: theme.fonts.weight.bold,
              color: theme.colors.textPrimary,
              margin: 0,
            }}
          >
            {t("forms:reportCorrection")}
          </h2>
          <button
            onClick={onClose}
            aria-label={t("forms:closeCorrectionForm")}
            style={{
              background: "none",
              border: "none",
              fontSize: theme.fonts.size["2xl"],
              cursor: "pointer",
              padding: 0,
              color: theme.colors.textSecondary,
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = theme.focus.outline;
              e.currentTarget.style.outlineOffset = theme.focus.outlineOffset;
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
            }}
          >
            ×
          </button>
        </div>

        <p
          style={{
            fontSize: theme.fonts.size.sm,
            color: theme.colors.textSecondary,
            marginTop: 0,
            marginBottom: theme.spacing[4],
          }}
        >
          {t("forms:correctionFormDescription")} <strong>{clinicName}</strong>.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: theme.spacing[4] }}>
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

          <div style={{ marginBottom: theme.spacing[4] }}>
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

          {/* Status message */}
          {message && (
            <div
              role={status === "error" ? "alert" : "status"}
              style={{
                padding: theme.spacing[3],
                borderRadius: theme.borderRadius.md,
                marginBottom: theme.spacing[4],
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

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: theme.spacing[3],
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={status === "submitting"}
              style={{
                padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
                backgroundColor: "white",
                color: theme.colors.textSecondary,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.fonts.size.base,
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
                padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
                backgroundColor: theme.colors.primary,
                color: "white",
                border: "none",
                borderRadius: theme.borderRadius.md,
                fontSize: theme.fonts.size.base,
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
    </>
  );
}
