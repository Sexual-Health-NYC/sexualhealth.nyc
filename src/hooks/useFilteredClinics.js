import { useMemo } from "react";
import { getOpenStatus, isOpenAfter } from "../utils/hours";

/**
 * Extracts subway lines from transit string.
 * @param {string} transit - Transit info like "A/C at 145th St"
 * @returns {string[]} - Array of line letters/numbers
 */
function parseSubwayLines(transit) {
  if (!transit) return [];
  return transit
    .split(",")
    .map((t) => {
      const match = t.trim().match(/^([A-Z0-9/]+)\s+at/i);
      return match ? match[1].toUpperCase().split("/") : [];
    })
    .flat();
}

/**
 * Extracts bus routes from bus string.
 * @param {string} bus - Bus info like "M1 at 5th Ave"
 * @returns {string[]} - Array of route names
 */
function parseBusRoutes(bus) {
  if (!bus) return [];
  return bus
    .split(",")
    .map((b) => b.trim().split(" at ")[0].split("...")[0].trim().toUpperCase());
}

/**
 * Hook to filter clinics based on active filters.
 * Memoized for performance.
 *
 * @param {Array} clinics - All clinics
 * @param {Object} filters - Active filter state
 * @returns {Array} - Filtered clinics
 */
export default function useFilteredClinics(clinics, filters) {
  return useMemo(() => {
    return clinics.filter((clinic) => {
      // Search query: filter by clinic name
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const clinicName = clinic.name.toLowerCase();
        if (!clinicName.includes(query)) return false;
      }

      // Services: must have ALL selected services (AND logic)
      if (filters.services.size > 0) {
        const hasAllServices = Array.from(filters.services).every(
          (service) => clinic[`has_${service}`] === true,
        );
        if (!hasAllServices) return false;
      }

      // Gender Affirming filters
      if (filters.genderAffirming.size > 0) {
        const hasAllGAC = Array.from(filters.genderAffirming).every(
          (gacType) => clinic[`gender_affirming_${gacType}`] === true,
        );
        if (!hasAllGAC) return false;
      }

      // PrEP filters
      if (filters.prep.size > 0) {
        const hasAllPrep = Array.from(filters.prep).every(
          (prepType) => clinic[`prep_${prepType}`] === true,
        );
        if (!hasAllPrep) return false;
      }

      // Access Type filters (e.g., Virtual/Telehealth)
      if (filters.accessType.size > 0) {
        const hasAllAccessTypes = Array.from(filters.accessType).every(
          (accessType) => clinic[accessType] === true,
        );
        if (!hasAllAccessTypes) return false;
      }

      // Insurance: must have ANY selected insurance option (OR logic)
      if (filters.insurance.size > 0) {
        const hasAnyInsurance = Array.from(filters.insurance).some(
          (insuranceType) => clinic[insuranceType] === true,
        );
        if (!hasAnyInsurance) return false;
      }

      // Access
      if (filters.access.size > 0) {
        const hasAccess = Array.from(filters.access).some(
          (access) => clinic[access] === true,
        );
        if (!hasAccess) return false;
      }

      // Borough: must match if filter active
      if (filters.boroughs.size > 0) {
        if (!filters.boroughs.has(clinic.borough)) return false;
      }

      // Gestational age: filter abortion clinics by weeks
      if (filters.gestationalWeeks !== null) {
        // 99 means "beyond 24 weeks" - check checkbox OR procedure weeks > 24
        if (filters.gestationalWeeks === 99) {
          const hasBeyond24 =
            clinic.offers_late_term || clinic.abortion_procedure_max_weeks > 24;
          if (!hasBeyond24) return false;
        } else {
          // Check if clinic can serve this gestational age
          const medMax = clinic.abortion_medication_max_weeks;
          const procMax = clinic.abortion_procedure_max_weeks;
          // Clinic must have at least one method that covers the weeks
          const canServe =
            (medMax && medMax >= filters.gestationalWeeks) ||
            (procMax && procMax >= filters.gestationalWeeks);
          if (!canServe) return false;
        }
      }

      // Open now filter
      if (filters.openNow) {
        const status = getOpenStatus(clinic.hours);
        if (!status || !status.isOpen) return false;
      }

      // Open after 5pm filter
      if (filters.openAfter5pm) {
        if (!isOpenAfter(clinic.hours, 17)) return false;
      }

      // Subway lines filter (OR logic - clinic near ANY selected line)
      if (filters.subwayLines.size > 0) {
        const clinicLines = parseSubwayLines(clinic.transit);
        if (clinicLines.length === 0) return false;
        const hasMatchingLine = Array.from(filters.subwayLines).some((line) =>
          clinicLines.includes(line),
        );
        if (!hasMatchingLine) return false;
      }

      // Bus routes filter (OR logic)
      if (filters.busRoutes.size > 0) {
        const clinicBuses = parseBusRoutes(clinic.bus);
        if (clinicBuses.length === 0) return false;
        const hasMatchingBus = Array.from(filters.busRoutes).some((route) =>
          clinicBuses.includes(route),
        );
        if (!hasMatchingBus) return false;
      }

      return true;
    });
  }, [clinics, filters]);
}
