/**
 * NYC Subway line bullet with official MTA colors.
 */

// Official MTA subway line colors
const LINE_COLORS = {
  // IND 8th Avenue Line (Blue)
  A: "#0039A6",
  C: "#0039A6",
  E: "#0039A6",

  // IND 6th Avenue Line (Orange)
  B: "#FF6319",
  D: "#FF6319",
  F: "#FF6319",
  M: "#FF6319",

  // IND Crosstown Line (Light Green)
  G: "#6CBE45",

  // BMT Nassau Street Line (Brown)
  J: "#996633",
  Z: "#996633",

  // BMT Canarsie Line (Gray)
  L: "#A7A9AC",

  // BMT Broadway Line (Yellow)
  N: "#FCCC0A",
  Q: "#FCCC0A",
  R: "#FCCC0A",
  W: "#FCCC0A",

  // IRT Broadway-7th Avenue Line (Red)
  1: "#EE352E",
  2: "#EE352E",
  3: "#EE352E",

  // IRT Lexington Avenue Line (Green)
  4: "#00933C",
  5: "#00933C",
  6: "#00933C",

  // IRT Flushing Line (Purple)
  7: "#B933AD",

  // Shuttles (Gray)
  S: "#808183",

  // Staten Island Railway (Blue)
  SIR: "#0039A6",
};

// Lines that need dark text for contrast
const DARK_TEXT_LINES = ["N", "Q", "R", "W", "L"];

export default function SubwayBullet({ line }) {
  const bgColor = LINE_COLORS[line] || "#999";
  const textColor = DARK_TEXT_LINES.includes(line) ? "#000" : "#fff";
  const isLongText = line.length > 1;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: isLongText ? "auto" : "20px",
        height: "20px",
        padding: isLongText ? "0 6px" : 0,
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: "50%",
        fontSize: isLongText ? "10px" : "12px",
        fontWeight: 700,
        fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        lineHeight: 1,
      }}
    >
      {line}
    </span>
  );
}

/**
 * Parse transit string and render styled subway bullets.
 * Input: "A/C/E at 14 St (879 ft)"
 * Output: [A bullet] [C bullet] [E bullet] 14 St (879 ft)
 */
export function TransitInfo({ transit }) {
  if (!transit) return null;

  // Parse: "A/C/E at 14 St (879 ft)"
  const match = transit.match(/^([A-Z0-9/]+)\s+at\s+(.+)$/);
  if (!match) {
    // Fallback: just show the text
    return <span>{transit}</span>;
  }

  const [, linesStr, stationAndDistance] = match;
  const lines = linesStr.split("/");

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        flexWrap: "wrap",
      }}
    >
      {lines.map((line) => (
        <SubwayBullet key={line} line={line} />
      ))}
      <span style={{ marginInlineStart: "4px" }}>{stationAndDistance}</span>
    </span>
  );
}

/**
 * Get MTA bus color based on route type
 * - Local (M, B, Q, Bx, S): Blue
 * - SBS (Select Bus Service): Teal
 * - Express (X, BM, QM, SIM): Brown/Maroon
 */
function getBusColor(route) {
  if (route.includes("-SBS")) return "#00A1DE"; // SBS teal
  if (/^(X|BM|QM|SIM)/.test(route)) return "#6E3219"; // Express brown
  return "#004F9F"; // Local blue
}

/**
 * Bus route bullet - colored by bus type
 */
export function BusBullet({ route }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: "18px",
        padding: "0 5px",
        backgroundColor: getBusColor(route),
        color: "#fff",
        borderRadius: "3px",
        fontSize: "11px",
        fontWeight: 600,
        fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        lineHeight: 1,
      }}
    >
      {route}
    </span>
  );
}

/**
 * Parse bus string and render styled bus bullets.
 * Input: "M11, M12, M14D-SBS at 9 AV/W 18 ST (201 ft)"
 * Output: [M11] [M12] [M14D-SBS] 9 AV/W 18 ST (201 ft)
 */
export function BusInfo({ bus }) {
  if (!bus) return null;

  // Parse: "M11, M12, M14D-SBS at 9 AV/W 18 ST (201 ft)"
  const match = bus.match(/^(.+?)\s+at\s+(.+)$/);
  if (!match) {
    return <span>{bus}</span>;
  }

  const [, routesStr, stopAndDistance] = match;
  // Routes are comma-separated
  const routes = routesStr.split(", ").filter((r) => r);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
        flexWrap: "wrap",
      }}
    >
      {routes.map((route) => (
        <BusBullet key={route} route={route} />
      ))}
      <span style={{ marginInlineStart: "4px" }}>{stopAndDistance}</span>
    </span>
  );
}
