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
        }}
      >
        <p>No clinics match your filters.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: theme.spacing[4],
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
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing[4],
        cursor: "pointer",
        boxShadow: theme.shadows.sm,
        transition: `all ${theme.transitions.base}`,
        border: `1px solid ${theme.colors.border}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = theme.shadows.md;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = theme.shadows.sm;
        e.currentTarget.style.transform = "translateY(0)";
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
          {services.slice(0, 3).map((service) => (
            <span
              key={service}
              style={{
                padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                backgroundColor: theme.colors.surface,
                color: theme.colors.textPrimary,
                borderRadius: theme.borderRadius.sm,
                fontSize: theme.fonts.size.xs,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              {service}
            </span>
          ))}
          {services.length > 3 && (
            <span
              style={{
                padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                color: theme.colors.textSecondary,
                fontSize: theme.fonts.size.xs,
              }}
            >
              +{services.length - 3} more
            </span>
          )}
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
