import { useState } from "react";
import useAppStore from "../store/useAppStore";
import theme from "../theme";
import { getOpenStatus } from "../utils/hours";
import CorrectionFormModal from "./CorrectionFormModal";

export default function ClinicDetailPanel() {
  const { selectedClinic, selectClinic } = useAppStore();
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showCorrectionForm, setShowCorrectionForm] = useState(false);

  if (!selectedClinic) return null;

  const openStatus = getOpenStatus(selectedClinic.hours);

  const services = [];
  if (selectedClinic.has_sti_testing)
    services.push({
      label: "STI Testing",
      bgColor: theme.colors.stiTestingBg,
      textColor: theme.colors.stiTestingText,
    });
  if (selectedClinic.has_hiv_testing)
    services.push({
      label: "HIV Testing",
      bgColor: theme.colors.hivTestingBg,
      textColor: theme.colors.hivTestingText,
    });
  if (selectedClinic.has_prep)
    services.push({
      label: "PrEP",
      bgColor: theme.colors.prepBg,
      textColor: theme.colors.prepText,
    });
  if (selectedClinic.has_pep)
    services.push({
      label: "PEP",
      bgColor: theme.colors.pepBg,
      textColor: theme.colors.pepText,
    });
  if (selectedClinic.has_contraception)
    services.push({
      label: "Contraception",
      bgColor: theme.colors.contraceptionBg,
      textColor: theme.colors.contraceptionText,
    });
  if (selectedClinic.has_abortion)
    services.push({
      label: "Abortion",
      bgColor: theme.colors.abortionBg,
      textColor: theme.colors.abortionText,
    });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "400px",
        height: "100%",
        backgroundColor: theme.colors.background,
        boxShadow: theme.shadows.lg,
        overflowY: "auto",
        zIndex: 10,
      }}
    >
      <div style={{ padding: theme.spacing[6] }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: theme.spacing[4],
          }}
        >
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: theme.fonts.size["2xl"],
                fontWeight: theme.fonts.weight.semibold,
                color: theme.colors.textPrimary,
                margin: 0,
                marginBottom: openStatus ? theme.spacing[2] : 0,
              }}
            >
              {selectedClinic.name}
            </h2>
            {openStatus && (
              <span
                style={{
                  display: "inline-block",
                  padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                  backgroundColor: openStatus.color,
                  color: "white",
                  borderRadius: theme.borderRadius.sm,
                  fontSize: theme.fonts.size.xs,
                  fontWeight: theme.fonts.weight.medium,
                }}
              >
                {openStatus.label}
              </span>
            )}
          </div>
          <button
            onClick={() => selectClinic(null)}
            style={{
              background: "none",
              border: "none",
              fontSize: theme.fonts.size.xl,
              color: theme.colors.textSecondary,
              cursor: "pointer",
              padding: 0,
              marginLeft: theme.spacing[2],
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Services */}
        {services.length > 0 && (
          <Section title="Services">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: theme.spacing[2],
              }}
            >
              {services.map(({ label, bgColor, textColor }) => (
                <span
                  key={label}
                  style={{
                    padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                    backgroundColor: bgColor,
                    color: textColor,
                    borderRadius: theme.borderRadius.sm,
                    fontSize: theme.fonts.size.sm,
                    fontWeight: theme.fonts.weight.medium,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Address */}
        <Section title="">
          <div
            style={{
              display: "flex",
              alignItems: "start",
              gap: theme.spacing[2],
              marginBottom: theme.spacing[3],
            }}
          >
            <p
              style={{
                margin: 0,
                flex: 1,
                color: theme.colors.textPrimary,
                fontSize: theme.fonts.size.base,
                lineHeight: "1.5",
              }}
            >
              {selectedClinic.address}
              {selectedClinic.borough && (
                <>
                  <br />
                  {selectedClinic.borough === "Manhattan"
                    ? "New York"
                    : selectedClinic.borough}
                  , NY
                </>
              )}
            </p>
            <button
              onClick={() => {
                const cityName =
                  selectedClinic.borough === "Manhattan"
                    ? "New York"
                    : selectedClinic.borough;
                const fullAddress = `${selectedClinic.address}${selectedClinic.borough ? `, ${cityName}, NY` : ""}`;
                navigator.clipboard.writeText(fullAddress);
                setCopiedAddress(true);
                setTimeout(() => setCopiedAddress(false), 2000);
              }}
              title={copiedAddress ? "Copied!" : "Copy address"}
              aria-label="Copy address to clipboard"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: theme.spacing[1],
                color: copiedAddress ? theme.colors.prep : theme.colors.primary,
                fontSize: theme.fonts.size.base,
                fontWeight: theme.fonts.weight.medium,
                transition: `color ${theme.transitions.fast}`,
              }}
            >
              {copiedAddress ? "✓ Copied" : "📋"}
            </button>
          </div>
          <a
            href={`geo:${selectedClinic.latitude},${selectedClinic.longitude}?q=${selectedClinic.latitude},${selectedClinic.longitude}`}
            style={{
              display: "inline-block",
              padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
              backgroundColor: theme.colors.primary,
              color: "white",
              textAlign: "center",
              textDecoration: "none",
              borderRadius: theme.borderRadius.sm,
              fontSize: theme.fonts.size.sm,
              fontWeight: theme.fonts.weight.medium,
            }}
          >
            Open in Maps
          </a>
          {selectedClinic.transit && (
            <div
              style={{
                marginTop: theme.spacing[3],
                padding: theme.spacing[2],
                backgroundColor: theme.colors.surface,
                borderRadius: theme.borderRadius.sm,
                display: "flex",
                alignItems: "center",
                gap: theme.spacing[2],
              }}
            >
              <span style={{ fontSize: theme.fonts.size.lg }}>🚇</span>
              <p
                style={{
                  margin: 0,
                  color: theme.colors.textSecondary,
                  fontSize: theme.fonts.size.sm,
                }}
              >
                {selectedClinic.transit}
              </p>
            </div>
          )}
        </Section>

        {/* Hours */}
        {selectedClinic.hours && (
          <Section title="Hours">
            <p
              style={{
                margin: 0,
                color: theme.colors.textPrimary,
                fontSize: theme.fonts.size.base,
              }}
            >
              {selectedClinic.hours}
            </p>
          </Section>
        )}

        {/* Insurance */}
        <Section title="Insurance & Cost">
          {!selectedClinic.accepts_medicaid &&
          !selectedClinic.accepts_medicare &&
          !selectedClinic.no_insurance_ok &&
          !selectedClinic.sliding_scale ? (
            <p
              style={{
                margin: 0,
                color: theme.colors.textSecondary,
                fontSize: theme.fonts.size.sm,
                fontStyle: "italic",
              }}
            >
              Unknown - contact clinic to verify
            </p>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing[2],
              }}
            >
              {selectedClinic.accepts_medicaid && (
                <InfoItem text="Accepts Medicaid" />
              )}
              {selectedClinic.accepts_medicare && (
                <InfoItem text="Accepts Medicare" />
              )}
              {selectedClinic.no_insurance_ok && (
                <InfoItem text="No insurance required" highlight />
              )}
              {selectedClinic.sliding_scale && (
                <InfoItem text="Sliding scale available" />
              )}
            </div>
          )}
        </Section>

        {/* Access */}
        {selectedClinic.walk_in && (
          <Section title="Walk-ins">
            <InfoItem text="Walk-ins accepted" />
          </Section>
        )}

        {/* Contact Info */}
        {(selectedClinic.phone || selectedClinic.website) && (
          <Section title="Contact">
            {selectedClinic.phone && !selectedClinic.phone.includes("@") && (
              <div style={{ marginBottom: theme.spacing[2] }}>
                <p
                  style={{
                    margin: `0 0 ${theme.spacing[1]} 0`,
                    fontSize: theme.fonts.size.xs,
                    color: theme.colors.textSecondary,
                    fontWeight: theme.fonts.weight.medium,
                  }}
                >
                  Phone
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: theme.fonts.size.base,
                    color: theme.colors.textPrimary,
                    fontWeight: theme.fonts.weight.medium,
                  }}
                >
                  {selectedClinic.phone}
                </p>
              </div>
            )}
            {selectedClinic.website && (
              <div>
                <p
                  style={{
                    margin: `0 0 ${theme.spacing[1]} 0`,
                    fontSize: theme.fonts.size.xs,
                    color: theme.colors.textSecondary,
                    fontWeight: theme.fonts.weight.medium,
                  }}
                >
                  Website
                </p>
                <a
                  href={
                    selectedClinic.website.startsWith("http")
                      ? selectedClinic.website
                      : `https://${selectedClinic.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: theme.colors.primary,
                    fontSize: theme.fonts.size.sm,
                    wordBreak: "break-all",
                    textDecoration: "underline",
                  }}
                >
                  {selectedClinic.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </Section>
        )}

        {/* Report Correction */}
        <div
          style={{
            marginTop: theme.spacing[4],
            paddingTop: theme.spacing[4],
            borderTop: `1px solid ${theme.colors.border}`,
          }}
        >
          <button
            onClick={() => setShowCorrectionForm(true)}
            style={{
              background: "none",
              border: "none",
              color: theme.colors.textSecondary,
              fontSize: theme.fonts.size.sm,
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline",
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = theme.focus.outline;
              e.currentTarget.style.outlineOffset = theme.focus.outlineOffset;
            }}
            onBlur={(e) => {
              e.currentTarget.style.outline = "none";
            }}
          >
            Report a correction
          </button>
        </div>
      </div>

      {/* Correction Form Modal */}
      {showCorrectionForm && (
        <CorrectionFormModal
          clinicName={selectedClinic.name}
          onClose={() => setShowCorrectionForm(false)}
        />
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: theme.spacing[6] }}>
      <h3
        style={{
          fontSize: theme.fonts.size.base,
          fontWeight: theme.fonts.weight.semibold,
          color: theme.colors.textPrimary,
          marginBottom: theme.spacing[3],
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoItem({ text, highlight }) {
  return (
    <div
      style={{
        padding: theme.spacing[2],
        backgroundColor: highlight ? theme.colors.surface : "transparent",
        borderRadius: theme.borderRadius.sm,
        fontSize: theme.fonts.size.sm,
        color: theme.colors.textPrimary,
      }}
    >
      ✓ {text}
    </div>
  );
}
