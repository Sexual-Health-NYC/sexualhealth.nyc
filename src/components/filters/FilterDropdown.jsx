import * as Popover from "@radix-ui/react-popover";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";

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

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={(open) => setOpenDropdown(open ? name : null)}
    >
      <Popover.Trigger asChild>
        <button
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
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="bg-white border border-border rounded-md shadow-lg p-2 min-w-[220px] z-[1000] data-[state=open]:animate-fade-in"
          sideOffset={4}
          align="start"
        >
          {options.map((option) => {
            const isChecked = filters[category].has(option.value);
            return (
              <label
                key={option.value}
                className={`flex items-center p-2 cursor-pointer rounded-sm transition-colors ${
                  isChecked ? "bg-primary-light/15" : "hover:bg-surface"
                }`}
              >
                <Checkbox.Root
                  checked={isChecked}
                  onCheckedChange={() => handleCheckbox(category, option.value)}
                  className="me-2 w-[18px] h-[18px] flex items-center justify-center border-2 border-border rounded-sm bg-white data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                >
                  <Checkbox.Indicator>
                    <CheckIcon className="text-white w-3 h-3" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <span
                  className={`text-sm select-none flex-1 ${
                    isChecked ? "font-medium" : "font-normal"
                  }`}
                >
                  {option.label}
                </span>
              </label>
            );
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
