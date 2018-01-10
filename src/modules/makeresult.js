function __guard__(value, transform) {
  return typeof value !== "undefined" && value !== null
    ? transform(value)
    : undefined;
}

// Generate the text for a single version result
// FIXME: gross output parameter
function makeResult(result, resultMap, percentages, superNums, nums = {}) {
  const { support, version, usage } = result;
  const level = support[0];
  const note = __guard__(support.match(/#(\d+)/), x => x[1]);

  let out = "";

  // \u2800 is a braille space - the only kind of space I could find that
  // doesn't get split by the word wrapper
  out += (resultMap[level] || level) + "\u2800";

  if (version) out += version;
  if (support.includes("x")) out += "ᵖ";
  if (note) {
    nums[note] = true;
    out += superNums[note];
  }

  if (percentages && usage) {
    if (out.slice(-1) !== "\u2800") out += " ";
    out += `(${Math.round(usage * 1) / 1}%)`;
  }

  out += " ";

  switch (level) {
    case "y":
      return out.green;
    case "n":
      return out.red;
    case "a":
      return out.yellow;
    default:
      return out;
  }
}

module.exports = makeResult;
