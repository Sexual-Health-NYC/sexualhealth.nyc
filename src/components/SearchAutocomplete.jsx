import { useState, useRef, useEffect } from "react";
import useAppStore from "../store/useAppStore";
import theme from "../theme";

export default function SearchAutocomplete({ t, placeholder, style }) {
  const { filters, setFilter, clinics } = useAppStore();
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Get matching clinic suggestions
  const suggestions = filters.searchQuery.trim()
    ? clinics
        .filter((clinic) =>
          clinic.name
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase().trim()),
        )
        .slice(0, 10)
    : [];

  // Helper function to highlight matching text
  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase().trim();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) return text;

    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);

    return (
      <>
        {before}
        <strong style={{ fontWeight: theme.fonts.weight.bold }}>{match}</strong>
        {after}
      </>
    );
  };

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showAutocomplete &&
        autocompleteRef.current &&
        searchInputRef.current &&
        !autocompleteRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowAutocomplete(false);
        setSelectedSuggestionIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAutocomplete]);

  return (
    <div style={{ position: "relative", ...style?.container }}>
      <input
        ref={searchInputRef}
        type="search"
        placeholder={placeholder}
        value={filters.searchQuery}
        onChange={(e) => {
          setFilter("searchQuery", e.target.value);
          setShowAutocomplete(true);
          setSelectedSuggestionIndex(-1);
        }}
        onKeyDown={(e) => {
          if (!showAutocomplete || suggestions.length === 0) return;

          if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedSuggestionIndex((prev) =>
              prev < suggestions.length - 1 ? prev + 1 : prev,
            );
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
          } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
            e.preventDefault();
            setFilter("searchQuery", suggestions[selectedSuggestionIndex].name);
            setShowAutocomplete(false);
            setSelectedSuggestionIndex(-1);
          } else if (e.key === "Escape") {
            setShowAutocomplete(false);
            setSelectedSuggestionIndex(-1);
          }
        }}
        onFocus={(e) => {
          if (filters.searchQuery.trim()) {
            setShowAutocomplete(true);
          }
          style?.input?.onFocus?.(e);
        }}
        onBlur={(e) => {
          style?.input?.onBlur?.(e);
        }}
        aria-label="Search clinics by name"
        aria-autocomplete="list"
        aria-controls="search-autocomplete"
        aria-expanded={showAutocomplete && suggestions.length > 0}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        style={style?.input?.style}
      />

      {showAutocomplete && suggestions.length > 0 && (
        <div
          ref={autocompleteRef}
          id="search-autocomplete"
          role="listbox"
          style={{
            position: "absolute",
            top: "100%",
            insetInlineStart: 0,
            insetInlineEnd: 0,
            marginTop: "4px",
            backgroundColor: "white",
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
            boxShadow: theme.shadows.lg,
            maxHeight: style?.dropdown?.maxHeight || "300px",
            overflowY: "auto",
            zIndex: 1001,
          }}
        >
          {suggestions.map((clinic, index) => (
            <div
              key={clinic.id}
              role="option"
              aria-selected={index === selectedSuggestionIndex}
              onClick={() => {
                setFilter("searchQuery", clinic.name);
                setShowAutocomplete(false);
                setSelectedSuggestionIndex(-1);
              }}
              onMouseEnter={() => setSelectedSuggestionIndex(index)}
              style={{
                padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                cursor: "pointer",
                backgroundColor:
                  index === selectedSuggestionIndex
                    ? theme.colors.surface
                    : "white",
                borderBottom:
                  index < suggestions.length - 1
                    ? `1px solid ${theme.colors.border}`
                    : "none",
              }}
            >
              <div
                style={{
                  fontSize: theme.fonts.size.sm,
                  fontWeight: theme.fonts.weight.medium,
                  color: theme.colors.textPrimary,
                }}
              >
                {highlightMatch(clinic.name, filters.searchQuery)}
              </div>
              {clinic.borough && (
                <div
                  style={{
                    fontSize: theme.fonts.size.xs,
                    color: theme.colors.textSecondary,
                    marginTop: "2px",
                  }}
                >
                  {clinic.borough}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
