import { useRef } from "react";
import useClickOutside from "../../hooks/useClickOutside";

export default function FilterDropdown({
  name,
  title,
  options,
  category,
  isChildFilter,
  filters,
  openDropdown,
  setOpenDropdown,
  handleCheckbox,
}) {
  const isOpen = openDropdown === name;
  const activeCount = filters[category].size;
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setOpenDropdown(null), isOpen);

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block transition-transform duration-200"
    >
      <button
        onClick={() => setOpenDropdown(isOpen ? null : name)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`${title} filter${activeCount > 0 ? `, ${activeCount} selected` : ""}`}
        className={`filter-pill py-2 px-4 rounded-md text-sm font-medium cursor-pointer flex items-center gap-2 focus-ring ${
          activeCount > 0
            ? "bg-primary text-white border-2 border-primary"
            : isChildFilter
              ? "bg-primary/5 text-text-primary border-2 border-primary/20"
              : "bg-white text-text-primary border-2 border-border"
        }`}
      >
        {title}
        {activeCount > 0 && (
          <span
            className="bg-white text-primary rounded-full px-2 text-xs font-bold min-w-[20px] text-center"
            aria-hidden="true"
          >
            {activeCount}
          </span>
        )}
        <span aria-hidden="true">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute top-[calc(100%+4px)] start-0 bg-white border border-border rounded-md shadow-lg p-2 min-w-[220px] z-[1000]"
        >
          {options.map((option) => (
            <label
              key={option.value}
              role="menuitemcheckbox"
              aria-checked={filters[category].has(option.value)}
              className={`flex items-center p-2 cursor-pointer rounded-sm transition-colors ${
                filters[category].has(option.value)
                  ? "bg-primary-light/15"
                  : "hover:bg-surface"
              }`}
            >
              <input
                type="checkbox"
                checked={filters[category].has(option.value)}
                onChange={() => handleCheckbox(category, option.value)}
                className="me-2 w-[18px] h-[18px] cursor-pointer accent-primary"
              />
              <span
                className={`text-sm select-none flex-1 ${
                  filters[category].has(option.value)
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
