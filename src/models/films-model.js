import {generateFilm} from '../mock/film.js';
import {shuffleArray} from '../utils/common.js';

export default class FilmsModel {
  #items = Array.from({length: 36}, generateFilm);

  get items() {
    return this.#items;
  }

  get top() {
    return shuffleArray(this.#items.slice())
      .sort((before, after) => {
        const beforeRating = before.info.totalRating;
        const afterRating = after.info.totalRating;

        return afterRating - beforeRating;
      });
  }

  get commented() {
    return shuffleArray(this.#items.slice())
      .sort((before, after) => {
        const beforeCount = before.comments.length;
        const afterCount = after.comments.length;

        return afterCount - beforeCount;
      });
  }
}
