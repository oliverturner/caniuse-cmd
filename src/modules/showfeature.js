const linewrap = require("linewrap");

const makeResults = require("./makeresults");
const makeResult = require("./makeresult");

const superNums = "⁰¹²³⁴⁵⁶⁷⁸⁹";

const xwrap = linewrap(process.stdout.columns || 80, {
  skipScheme: "ansi-color",
  whitespace: "line",
  tabWidth: 2,
  wrapLineIndent: 0,
  wrapLineIndentBase: /\S/
});

// Replace our scary braille spaces with real spaces
const wrap = str => xwrap(str).replace(/\u2800/g, " ");

const filter = function(browser, opts, agents, types) {
  if (opts.browser) {
    let needle;
    return (needle = browser), opts.browser.split(",").includes(needle);
  }
  return types.includes(agents[browser].type);
};

// Display a single feature's browser support
function showFeature(versionrange, agents, types, statuses, resultMap, result, opts = {}) {
  // const {usage_perc_y, usage_perc_a, status, stats, categories, description} = result;
  const status = opts.long ? ` [${statuses[result.status]}]` : "";
  const headerSep = opts["oneline-browser"] ? ": " : "\n";
  const out = [];
  let percentages = [];

  if (opts.long == null) opts.long = !opts.short;
  if (opts.short == null) opts.short = !opts.long;

  if (result.usage_perc_y) {
    percentages.push(resultMap.y + ` ${result.usage_perc_y}%`.green);
  }
  if (result.usage_perc_a) {
    percentages.push(resultMap.a + ` ${result.usage_perc_a}%`.yellow);
  }
  percentages = percentages.join(" ");

  process.stdout.write(
    `${result.title.bold} ${percentages}${status}` + headerSep
  );

  if (opts.oneline) return;

  if (opts.long) {
    const tags = result.categories
      .map(x => `#${x.replace(/\W/g, "")}`)
      .join(" ");
    console.log(wrap(`\t${result.description.trim()} ${tags}\n`));
  }

  // console.log "columns", process.stdout.columns
  if (opts.short && !opts["oneline-browser"]) out.push("\t");

  // Store which notes have been used in a result
  const need_note = {};

  for (let browser in result.stats) {
    const stats = result.stats[browser];

    if (filter(browser, opts, agents, types)) {
      const results = makeResults(agents[browser], stats, versionrange);
      if (results.length === 1) results[0].version = null;

      if (!opts.short) out.push("\t");

      opts.abbrev
        ? out.push(`${agents[browser].abbr} `)
        : out.push(`${agents[browser].browser} `);

      results.forEach(res =>
        out.push(`${makeResult(res, resultMap, superNums, need_note)}`)
      );

      if (!opts.short) {
        out.push("\n");
      }
    }
  }

  console.log(wrap(out.join("")));

  if (!opts.short) {
    for (let num in result.notes_by_num) {
      const note = result.notes_by_num[num];
      if (need_note[num]) {
        console.log(wrap(`\t\t${superNums[num].yellow}${note}`));
      }
    }
    if (result.notes) {
      return console.log(
        wrap(`\t ${resultMap.i}${`  ${result.notes.replace(/[\r\n]+/g, " ")}`}`)
      );
    }
  }
}

module.exports = showFeature;
