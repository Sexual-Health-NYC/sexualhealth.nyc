import * as Select from "@radix-ui/react-select";
import { useTranslation } from "react-i18next";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

export default function GestationalDropdown({
  filters,
  gestationalOptions,
  setGestationalWeeks,
}) {
  const { t } = useTranslation(["gestational"]);
  const hasFilter = filters.gestationalWeeks !== null;

  const currentLabel =
    gestationalOptions.find((o) => o.value === filters.gestationalWeeks)
      ?.label || t("gestational:weeksPregnant");

  // Convert value to string for Radix Select (requires string values)
  const stringValue =
    filters.gestationalWeeks !== null
      ? String(filters.gestationalWeeks)
      : undefined;

  return (
    <Select.Root
      value={stringValue}
      onValueChange={(value) => {
        // Convert back: "null" string means clear, otherwise parse as number
        setGestationalWeeks(value === "null" ? null : Number(value));
      }}
    >
      <Select.Trigger
        aria-label={`Gestational age filter${hasFilter ? `, ${currentLabel}` : ""}`}
        className={`filter-pill py-2 px-4 rounded-md text-sm font-medium cursor-pointer inline-flex items-center gap-2 focus-ring ${
          hasFilter
            ? "bg-primary text-white border-2 border-primary"
            : "bg-primary/5 text-text-primary border-2 border-primary/20"
        }`}
      >
        <Select.Value placeholder={t("gestational:weeksPregnant")}>
          {hasFilter ? currentLabel : t("gestational:weeksPregnant")}
        </Select.Value>
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="bg-white border border-border rounded-md shadow-lg z-[1000] overflow-hidden"
          position="popper"
          sideOffset={4}
        >
          <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white cursor-default">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-2 min-w-[200px]">
            {gestationalOptions.map((option) => (
              <Select.Item
                key={option.value ?? "any"}
                value={option.value !== null ? String(option.value) : "null"}
                className={`flex items-center p-2 cursor-pointer rounded-sm transition-colors text-sm select-none outline-none data-[highlighted]:bg-surface data-[state=checked]:bg-accent/15 data-[state=checked]:font-medium`}
              >
                <Select.ItemIndicator className="me-2 inline-flex items-center">
                  <CheckIcon />
                </Select.ItemIndicator>
                <Select.ItemText>{option.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white cursor-default">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
