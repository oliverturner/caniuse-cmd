/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * DS209: Avoid top-level return
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// const colors = require("colors");
const open = require("open");
const os = require("os");

const {
  argv,
  outdated,
  data,
  agents,
  statuses,
  eras
} = require("./modules/config");
const getResultMap = require("./modules/get-resultmap");
const showFeature = require("./modules/showfeature");
const slowFind = require("./modules/slowfind");

const currentVersion = eras.indexOf("e0");
const versionrange = [0, currentVersion];
const types = [];

const resultMap = getResultMap({
  isWin32: os.platform() === "win32",
  isAscii: argv["ascii"]
});

if (outdated) {
  console.warn(
    `\${resultMap.w} Caniuse data is more than 30 days out of date!
    Consider updating: npm install -g caniuse-cmd
    `.yellow
  );
}

if (argv.web) {
  open(`http://caniuse.com/#search=${encodeURIComponent(argv._.join(" "))}`);
}

const searchkey = argv._.join("")
  .toLowerCase()
  .replace(/\W*/g, "");

if (argv["oneline-browser"]) {
  argv.abbrev = true;
  argv.short = true;
  argv.current = true;
}

if (argv.desktop) types.push("desktop");
if (argv.mobile) types.push("mobile");
if (argv.future) versionrange[1] = Infinity;
if (argv.current) versionrange[0] = currentVersion;
if (argv.era) versionrange[0] = eras.indexOf(argv.era);

(function() {
  const feat = data[searchkey];
  const features = slowFind(data, searchkey);

  if (feat) {
    return showFeature(versionrange, agents, types, statuses, resultMap, feat, argv);
  } else if (features.length > 0) {
    if (argv.short == null) argv.short = features.length > 1;

    return features.map(feat =>
      showFeature(versionrange, agents, types, statuses, resultMap, data[feat], argv)
    );
  } else {
    return console.error(`${searchkey}: not found`);
  }
})();
