import { useTranslation } from "react-i18next";
import useAppStore from "../store/useAppStore";
import SearchAutocomplete from "./SearchAutocomplete";
import useVisibleFilters from "../hooks/useVisibleFilters";
import MobileFilterRenderer from "./MobileFilterRenderer";

function FilterSection({ title, children }) {
  return (
    <fieldset className="mb-3 p-3 bg-surface rounded-md border-none">
      <legend className="text-sm font-semibold mb-2 text-primary">
        {title}
      </legend>
      <div className="flex flex-col gap-1">{children}</div>
    </fieldset>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center cursor-pointer py-1 px-2 rounded-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="me-2 w-4 h-4 cursor-pointer accent-primary"
      />
      <span className={`text-sm ${checked ? "font-medium" : "font-normal"}`}>
        {label}
      </span>
    </label>
  );
}

export default function FilterControls() {
  const { t } = useTranslation(["actions", "messages", "sections", "filters"]);
  useAppStore(); // Subscribe to store for reactivity
  const visibleFilters = useVisibleFilters();

  return (
    <>
      {/* Search filter - always first */}
      <FilterSection title={t("messages:search")}>
        <SearchAutocomplete
          placeholder={t("messages:searchByName")}
          className="w-full"
        />
      </FilterSection>

      {/* Render all filters from config */}
      {visibleFilters.map((config) => (
        <MobileFilterRenderer
          key={config.id}
          config={config}
          FilterSection={FilterSection}
          Checkbox={Checkbox}
        />
      ))}
    </>
  );
}
