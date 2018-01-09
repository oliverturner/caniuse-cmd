function getResultMap({ isWin32, isAscii }) {
  if (isWin32) {
    return {
      y: "\u221A",
      n: "\u00D7",
      a: "\u0398",
      u: "\u203D",
      i: "\u24D8",
      w: "\u26A0"
    };
  }

  if (isAscii) {
    return {
      y: "[Yes]",
      n: "[No]",
      a: "[Partly]",
      u: "[?!]",
      i: "[Info]",
      w: "[Warning]"
    };
  }

  return { y: "✔", n: "✘", a: "◒", u: "‽", i: "ⓘ", w: "⚠" };
}

module.exports = getResultMap;
