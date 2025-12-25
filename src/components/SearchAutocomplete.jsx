import { useCombobox } from "downshift";
import useAppStore from "../store/useAppStore";

// Helper function to highlight matching text
function highlightMatch(text, query) {
  if (!query?.trim()) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase().trim();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.trim().length);
  const after = text.slice(index + query.trim().length);

  return (
    <>
      {before}
      <strong className="font-bold">{match}</strong>
      {after}
    </>
  );
}

export default function SearchAutocomplete({ placeholder, className }) {
  const { filters, setFilter, clinics } = useAppStore();

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

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items: suggestions,
    inputValue: filters.searchQuery,
    onInputValueChange: ({ inputValue }) => {
      setFilter("searchQuery", inputValue || "");
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        setFilter("searchQuery", selectedItem.name);
      }
    },
    itemToString: (item) => (item ? item.name : ""),
  });

  return (
    <div className={`relative ${className || ""}`}>
      <input
        {...getInputProps({
          placeholder,
          type: "search",
          "aria-label": "Search clinics by name",
          spellCheck: "false",
          autoComplete: "off",
          autoCorrect: "off",
          autoCapitalize: "off",
          className: `w-full py-2 px-3 border-2 rounded-md text-sm focus-ring ${
            filters.searchQuery.trim()
              ? "border-primary"
              : "border-border focus:border-primary"
          }`,
        })}
      />

      <ul
        {...getMenuProps()}
        className={`absolute top-full start-0 end-0 mt-1 bg-white border border-border rounded-md shadow-lg max-h-[300px] overflow-y-auto z-[1001] ${
          !(isOpen && suggestions.length > 0) ? "hidden" : ""
        }`}
      >
        {isOpen &&
          suggestions.map((clinic, index) => (
            <li
              key={clinic.id}
              {...getItemProps({ item: clinic, index })}
              className={`py-2 px-3 cursor-pointer ${
                highlightedIndex === index ? "bg-surface" : "bg-white"
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
            </li>
          ))}
      </ul>
    </div>
  );
}
