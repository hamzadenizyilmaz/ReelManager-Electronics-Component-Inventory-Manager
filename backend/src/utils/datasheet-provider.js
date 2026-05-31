const providerOrder = [
  { key: "local", name: "Local database", type: "internal", priority: 1 },
  { key: "nexar_octopart", name: "Nexar / Octopart API", type: "external", priority: 2 },
  { key: "digikey", name: "DigiKey API", type: "external", priority: 3 },
  { key: "mouser", name: "Mouser API", type: "external", priority: 4 },
  { key: "manual", name: "Manual datasheet URL", type: "manual", priority: 5 }
];

async function resolveDatasheet(component) {
  if (component?.datasheetUrl) {
    return {
      found: true,
      provider: providerOrder[0],
      url: component.datasheetUrl,
      source: "local_database"
    };
  }

  return {
    found: false,
    providerOrder,
    message:
      "No local datasheet found. Configure Nexar/Octopart, DigiKey and Mouser API keys to enable external lookup, then fall back to manual URL."
  };
}

module.exports = { providerOrder, resolveDatasheet };
