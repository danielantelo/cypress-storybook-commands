module.exports = {
  storyInList: (storyId, storyList) =>
    storyList.reduce(
      (acc, curr) => (curr === storyId || storyId.includes(curr) ? [true, curr] : acc),
      [false, undefined]
    ),
};
