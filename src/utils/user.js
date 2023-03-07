import { FilterType } from '../const.js';
import {filter} from './../utils/filter.js';

/** @type {Map<string, Array>} карта, сопоставляющая ранг пользователя с количеством просмторенных фильмов */
const RankMap = new Map([
  ['Novice', [1, 10]],
  ['Fan', [11, 20]],
  ['Movie Buff', [21, Infinity]]
]);

/**
 * Возвращает ранг пользователя основываясь на количестве просмотренных фильмов
 * @param {Array} films массив со всеми фильмами
 * @returns {string|null} ранг пользователя
 */
export const getUserRank = (films) => {
  const watchedCount = filter[FilterType.WATCHLIST](films).length;

  for (const [rank, [min, max]] of RankMap) {
    if (watchedCount >= min && watchedCount <= max) {
      return rank;
    }
  }

  return null;
};
