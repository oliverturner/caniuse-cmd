require("colors");
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

function getPercs(resultMap, result) {
  const { a, y } = resultMap;
  const { usage_perc_a, usage_perc_y } = result;

  const percs = [];
  if (usage_perc_y) {
    percs.push(`${y} ${usage_perc_y}%`.green);
  }
  if (usage_perc_a) {
    percs.push(`${a} ${usage_perc_a}%`.yellow);
  }

  return percs.join(" ");
}

// Display a single feature's browser support
function showFeature(
  versionrange,
  agents,
  types,
  statuses,
  resultMap,
  result,
  opts = {}
) {
  const {
    status,
    title,
    stats,
    categories,
    description,
    notes,
    notes_by_num
  } = result;
  const resStatus = opts.long ? ` [${statuses[status]}]` : "";
  const headerSep = opts["oneline-browser"] ? ": " : "\n";
  const percentages = getPercs(resultMap, result);
  const out = [];

  if (opts.long == null) opts.long = !opts.short;
  if (opts.short == null) opts.short = !opts.long;

  process.stdout.write(`${title.bold} ${percentages}${resStatus} ${headerSep}`);

  if (opts.oneline) return;

  if (opts.long) {
    const tags = categories.map(x => `#${x.replace(/\W/g, "")}`).join(" ");
    console.log(wrap(`\t${description.trim()} ${tags}\n`));
  }

  // console.log "columns", process.stdout.columns
  if (opts.short && !opts["oneline-browser"]) out.push("\t");

  // Store which notes have been used in a result
  const need_note = {};

  for (let browser in stats) {
    const browserStats = stats[browser];

    if (filter(browser, opts, agents, types)) {
      const results = makeResults(agents[browser], browserStats, versionrange);

      if (results.length === 1) results[0].version = null;

      if (!opts.short) out.push("\t");

      opts.abbrev
        ? out.push(`${agents[browser].abbr} `)
        : out.push(`${agents[browser].browser} `);

      results.forEach(res =>
        out.push(
          `${makeResult(res, resultMap, percentages, superNums, need_note)}`
        )
      );

      if (!opts.short) {
        out.push("\n");
      }
    }
  }

  console.log(wrap(out.join("")));

  if (!opts.short) {
    for (let num in notes_by_num) {
      const note = notes_by_num[num];
      if (need_note[num]) {
        console.log(wrap(`\t\t${superNums[num].yellow}${note}`));
      }
    }

    if (notes) {
      console.log(
        wrap(`\t ${resultMap.i}${`  ${notes.replace(/[\r\n]+/g, " ")}`}`)
      );
    }
  }
}

module.exports = showFeature;
