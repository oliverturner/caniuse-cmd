// Generate an array of version results for a browser
const makeResults = function(browser, stats, versionrange) {
  const results = [];
  let current = {};
  
  for (let i = 0; i < browser.versions.length; i++) {
    let version = browser.versions[i];
    if (version && (versionrange[0] <= i && i <= versionrange[1])) {
      let support = stats[version];
      const usage = browser.usage_global[version] || 0;
      if (browser.versions[i + 1]) {
        version += "+";
      }

      // 'p' means no-but-polyfill-available, which we can treat as no
      if (support[0] === "p") {
        support = `n${support.slice(1)}`;
      }

      // Only add a new version result when browser support changes
      if (!current.version || current.support !== support) {
        current = { version, support, usage: 0 };
        results.push(current);
      }

      current.usage += usage;
    }
  }

  return results;
};

module.exports = makeResults;
