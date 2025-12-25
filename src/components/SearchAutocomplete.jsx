import { useState, useRef, useEffect } from "react";
import useAppStore from "../store/useAppStore";

export default function SearchAutocomplete({ placeholder, className }) {
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
        <strong className="font-bold">{match}</strong>
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
    <div className={`relative ${className || ""}`}>
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
        onFocus={() => {
          if (filters.searchQuery.trim()) {
            setShowAutocomplete(true);
          }
        }}
        aria-label="Search clinics by name"
        role="combobox"
        aria-autocomplete="list"
        aria-controls="search-autocomplete"
        aria-expanded={showAutocomplete && suggestions.length > 0}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        className={`w-full py-2 px-3 border-2 rounded-md text-sm focus-ring ${
          filters.searchQuery.trim()
            ? "border-primary"
            : "border-border focus:border-primary"
        }`}
      />

      {showAutocomplete && suggestions.length > 0 && (
        <div
          ref={autocompleteRef}
          id="search-autocomplete"
          role="listbox"
          className="absolute top-full start-0 end-0 mt-1 bg-white border border-border rounded-md shadow-lg max-h-[300px] overflow-y-auto z-[1001]"
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
              className={`py-2 px-3 cursor-pointer ${
                index === selectedSuggestionIndex ? "bg-surface" : "bg-white"
              } ${index < suggestions.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="text-sm font-medium text-text-primary">
                {highlightMatch(clinic.name, filters.searchQuery)}
              </div>
              {clinic.borough && (
                <div className="text-xs text-text-secondary mt-0.5">
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
