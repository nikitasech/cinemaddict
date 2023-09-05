import { TypeFilter } from './../const.js';
import { filter } from './../utils/filter.js';

/** @type {Map<string, Array>} карта, сопоставляющая ранг пользователя с количеством просмторенных фильмов */
const RankMap = new Map([
  ['Novice', [1, 10]],
  ['Fan', [11, 20]],
  ['Movie Buff', [21, Infinity]]
]);

export default class UserModel {
  getRank = (films) => {
    if (!films.length) {
      return null;
    }

    const watchedCount = filter(films, TypeFilter.HISTORY).length;

    for (const [rank, [min, max]] of RankMap) {
      if (watchedCount >= min && watchedCount <= max) {
        return rank;
      }
    }
  };
}
