/**
 * Filter virtual clinics based on selected service filters.
 * Returns virtual clinics that offer any of the selected services.
 *
 * @param {Array} virtualClinics - Array of virtual clinic objects
 * @param {Set} services - Set of selected service filter values
 * @returns {Array} Filtered virtual clinics
 */
export function filterVirtualClinicsByServices(virtualClinics, services) {
  if (!services || services.size === 0) return [];

  return virtualClinics.filter((clinic) => {
    return Array.from(services).some((service) => {
      switch (service) {
        case "abortion":
          return clinic.has_abortion;
        case "gender_affirming":
          return clinic.has_gender_affirming;
        case "prep":
          return clinic.has_prep;
        case "contraception":
          return clinic.has_contraception;
        case "sti_testing":
          return clinic.has_sti_testing;
        default:
          return false;
      }
    });
  });
}
