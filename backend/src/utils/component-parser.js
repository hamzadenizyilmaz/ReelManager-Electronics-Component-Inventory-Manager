function parseEiaValue(code) {
  if (!/^\d{3,4}$/.test(code)) return null;
  if (code.length === 3) {
    const base = Number(code.slice(0, 2));
    const multiplier = Number(code[2]);
    const pf = base * Math.pow(10, multiplier);
    if (pf >= 1000000) return `${pf / 1000000}uF`;
    if (pf >= 1000) return `${pf / 1000}nF`;
    return `${pf}pF`;
  }
  return null;
}

function parseYageoResistor(partNumber) {
  const pn = String(partNumber || "").toUpperCase();
  const m = pn.match(/^RC(0201|0402|0603|0805|1206|1210)([A-Z]{2})-\d?(\d{3})([RKL])?/);
  if (!m) return null;
  const ohmCode = m[3];
  let value = `${Number(ohmCode)} Ohm`;
  if (pn.includes("R")) value = pn.match(/(\d+)R(\d*)/) ? pn.match(/(\d+)R(\d*)/)[0].replace("R", ".") + " Ohm" : value;
  const tolerance = { FR: "1%", JR: "5%" }[m[2]] || undefined;
  return {
    category: "Resistor",
    package_case: m[1],
    value,
    tolerance,
    manufacturer_guess: "YAGEO"
  };
}

function parseSamsungMlcc(partNumber) {
  const pn = String(partNumber || "").toUpperCase();
  const m = pn.match(/^CL(05|10|21|31|32|43|55)([A-Z])(\d{3})([A-Z])/);
  if (!m) return null;
  const pkg = { "05": "0402", "10": "0603", "21": "0805", "31": "1206", "32": "1210", "43": "1812", "55": "2220" }[m[1]];
  const value = parseEiaValue(m[3]);
  const tolerance = { J: "5%", K: "10%", M: "20%" }[m[4]];
  const dielectric = { B: "X7R", C: "C0G/NP0", X: "X6S", A: "X5R" }[m[2]];
  return {
    category: "Capacitor",
    package_case: pkg,
    value,
    tolerance,
    dielectric,
    manufacturer_guess: "Samsung"
  };
}

function parseComponentPartNumber(partNumber) {
  const pn = String(partNumber || "").trim().toUpperCase();
  return (
    parseYageoResistor(pn) ||
    parseSamsungMlcc(pn) ||
    (pn.includes("B340A") ? { category: "Diode", package_case: "SMA", value: "3A 40V", type: "Schottky diode" } : null) ||
    (pn.includes("SS36") ? { category: "Diode", package_case: "SMA/SMB", value: "3A 60V", type: "Schottky diode" } : null) ||
    (/^SMBJ\d/.test(pn) ? { category: "TVS / ESD", package_case: "SMB", value: pn.replace("SMBJ", ""), type: "TVS diode" } : null) ||
    {}
  );
}

module.exports = { parseComponentPartNumber };
