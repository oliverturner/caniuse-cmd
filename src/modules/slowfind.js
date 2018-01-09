const slowFind = (data, query) => {
  const results = [];
  for (let key in data) {
    const { title, description, keywords, categories } = data[key];
    const matcher = (key + title + description + keywords + categories)
      .toLowerCase()
      .replace(/\W*/g, "");

    if (matcher.match(query)) {
      results.push(key);
    }
  }

  return results;
};

module.exports = slowFind;
