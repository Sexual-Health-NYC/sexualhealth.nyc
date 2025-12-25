import { useState } from "react";
import { useTranslation } from "react-i18next";

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
    <div className="mt-3 p-4 bg-surface rounded-md border border-border">
      <p className="text-sm text-text-secondary mt-0 mb-3">
        {t("forms:correctionFormDescription")} <strong>{clinicName}</strong>.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label
            htmlFor="correction"
            className="block text-sm font-medium text-text-primary mb-2"
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
            className="w-full p-3 border border-border rounded-md text-base resize-y focus-ring focus:border-primary"
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-text-primary mb-2"
          >
            {t("forms:yourEmail")}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("forms:emailPlaceholder")}
            className="w-full p-3 border border-border rounded-md text-base focus-ring focus:border-primary"
          />
          <p className="text-xs text-text-secondary mt-1 mb-0">
            {t("forms:emailDisclaimer")}
          </p>
        </div>

        {message && (
          <div
            role={status === "error" ? "alert" : "status"}
            className={`p-3 rounded-md mb-3 text-sm ${
              status === "success"
                ? "bg-green-100 text-green-800"
                : status === "error"
                  ? "bg-red-100 text-red-800"
                  : "bg-surface text-text-primary"
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={status === "submitting"}
            className="py-2 px-3 bg-white text-text-secondary border border-border rounded-md text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
          >
            {t("forms:cancel")}
          </button>
          <button
            type="submit"
            disabled={status === "submitting" || status === "success"}
            className="py-2 px-3 bg-primary text-white border-none rounded-md text-sm font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
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
