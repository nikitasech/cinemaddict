import {shuffleArray} from '../utils/common.js';

export const sortTopFilms = (items, count) => shuffleArray(items.slice())
  .sort((before, after) => {
    const beforeRating = before.info.totalRating;
    const afterRating = after.info.totalRating;

    return afterRating - beforeRating;
  })
  .slice(0, count);

export const sortCommentedFilms = (items, count) => shuffleArray(items.slice())
  .sort((before, after) => {
    const beforeCount = before.comments.length;
    const afterCount = after.comments.length;

    return afterCount - beforeCount;
  })
  .slice(0, count);
