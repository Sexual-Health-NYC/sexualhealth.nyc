import { useRef } from "react";
import { useTranslation } from "react-i18next";
import useClickOutside from "../../hooks/useClickOutside";

export default function GestationalDropdown({
  filters,
  gestationalOptions,
  openDropdown,
  setOpenDropdown,
  setGestationalWeeks,
}) {
  const { t } = useTranslation(["gestational"]);
  const isOpen = openDropdown === "gestational";
  const hasFilter = filters.gestationalWeeks !== null;
  const dropdownRef = useRef(null);

  const currentLabel =
    gestationalOptions.find((o) => o.value === filters.gestationalWeeks)
      ?.label || t("gestational:weeksPregnant");

  useClickOutside(dropdownRef, () => setOpenDropdown(null), isOpen);

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block transition-transform duration-200"
    >
      <button
        onClick={() => setOpenDropdown(isOpen ? null : "gestational")}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`Gestational age filter${hasFilter ? `, ${currentLabel}` : ""}`}
        className={`filter-pill py-2 px-4 rounded-md text-sm font-medium cursor-pointer flex items-center gap-2 focus-ring ${
          hasFilter
            ? "bg-primary text-white border-2 border-primary"
            : "bg-primary/5 text-text-primary border-2 border-primary/20"
        }`}
      >
        {hasFilter ? currentLabel : t("gestational:weeksPregnant")}
        <span aria-hidden="true">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute top-[calc(100%+4px)] start-0 bg-white border border-border rounded-md shadow-lg p-2 min-w-[200px] z-[1000]"
        >
          {gestationalOptions.map((option) => (
            <label
              key={option.value ?? "any"}
              role="menuitemradio"
              aria-checked={filters.gestationalWeeks === option.value}
              className={`flex items-center p-2 cursor-pointer rounded-sm transition-colors ${
                filters.gestationalWeeks === option.value
                  ? "bg-accent/15"
                  : "hover:bg-surface"
              }`}
            >
              <input
                type="radio"
                name="gestational"
                checked={filters.gestationalWeeks === option.value}
                onChange={() => {
                  setGestationalWeeks(option.value);
                  setOpenDropdown(null);
                }}
                className="me-2 w-[18px] h-[18px] cursor-pointer accent-accent"
              />
              <span
                className={`text-sm select-none flex-1 ${
                  filters.gestationalWeeks === option.value
                    ? "font-medium"
                    : "font-normal"
                }`}
              >
                {option.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
