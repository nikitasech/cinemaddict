import {shuffleArray} from '../utils/common.js';

export const sortByRating = (items, count) => shuffleArray(items.slice())
  .sort((before, after) => {
    const beforeRating = before.info.totalRating;
    const afterRating = after.info.totalRating;

    return afterRating - beforeRating;
  })
  .slice(0, count);

export const sortByComments = (items, count) => shuffleArray(items.slice())
  .sort((before, after) => {
    const beforeCount = before.comments.length;
    const afterCount = after.comments.length;

    return afterCount - beforeCount;
  })
  .slice(0, count);

export const sortByDate = (items, count) => shuffleArray(items.slice())
  .sort((before, after) => {
    const beforeDate = Date.parse(before.info.release.date);
    const afterDate = Date.parse(after.info.release.date);

    return afterDate - beforeDate;
  })
  .slice(0, count);
