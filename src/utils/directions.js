export function getDirectionsUrl(latitude, longitude) {
  return `https://www.openstreetmap.org/directions?from=&to=${latitude},${longitude}#map=15/${latitude}/${longitude}`;
}
