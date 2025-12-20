import useAppStore from "../store/useAppStore";
import theme from "../theme";
import { getOpenStatus } from "../utils/hours";

export default function ClinicListView({ clinics }) {
  const { selectClinic } = useAppStore();

  if (clinics.length === 0) {
    return (
      <div
        style={{
          padding: theme.spacing[8],
          textAlign: "center",
          color: theme.colors.textSecondary,
          fontSize: theme.fonts.size.lg,
        }}
      >
        <p style={{ margin: 0 }}>No clinics match your filters.</p>
        <p style={{ margin: theme.spacing[2], fontSize: theme.fonts.size.sm }}>
          Try adjusting your filter selections.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: theme.spacing[4],
        paddingTop: "60px", // Space for Map/List toggle buttons
        backgroundColor: theme.colors.surface,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: theme.spacing[4],
        }}
      >
        {clinics.map((clinic) => (
          <ClinicCard
            key={clinic.id}
            clinic={clinic}
            onClick={() => selectClinic(clinic)}
          />
        ))}
      </div>
    </div>
  );
}

function ClinicCard({ clinic, onClick }) {
  const openStatus = getOpenStatus(clinic.hours);

  const services = [];
  if (clinic.has_sti_testing) services.push("STI Testing");
  if (clinic.has_hiv_testing) services.push("HIV Testing");
  if (clinic.has_prep) services.push("PrEP");
  if (clinic.has_pep) services.push("PEP");
  if (clinic.has_contraception) services.push("Contraception");
  if (clinic.has_abortion) services.push("Abortion");

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View details for ${clinic.name}`}
      style={{
        backgroundColor: "white",
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing[6],
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(123, 44, 191, 0.08)",
        transition: `all ${theme.transitions.base}`,
        border: `2px solid ${theme.colors.border}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(123, 44, 191, 0.15)";
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = theme.colors.primaryLight;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(123, 44, 191, 0.08)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = theme.colors.border;
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: theme.spacing[3] }}>
        <h3
          style={{
            fontSize: theme.fonts.size.lg,
            fontWeight: theme.fonts.weight.semibold,
            color: theme.colors.textPrimary,
            margin: 0,
            marginBottom: theme.spacing[2],
          }}
        >
          {clinic.name}
        </h3>
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

      {/* Services */}
      {services.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: theme.spacing[1],
            marginBottom: theme.spacing[3],
          }}
        >
          {services.map((service) => (
            <span
              key={service}
              style={{
                padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
                backgroundColor: `${theme.colors.primaryLight}10`,
                color: theme.colors.primary,
                borderRadius: theme.borderRadius.full,
                fontSize: theme.fonts.size.xs,
                border: `1px solid ${theme.colors.primaryLight}40`,
                fontWeight: theme.fonts.weight.medium,
              }}
            >
              {service}
            </span>
          ))}
        </div>
      )}

      {/* Location */}
      <p
        style={{
          margin: 0,
          color: theme.colors.textSecondary,
          fontSize: theme.fonts.size.sm,
          marginBottom: theme.spacing[1],
        }}
      >
        {clinic.borough}
      </p>

      {/* Key info */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: theme.spacing[2],
          fontSize: theme.fonts.size.xs,
          color: theme.colors.textSecondary,
        }}
      >
        {clinic.walk_in && <span>✓ Walk-ins</span>}
        {clinic.no_insurance_ok && <span>✓ No insurance required</span>}
      </div>
    </div>
  );
}
