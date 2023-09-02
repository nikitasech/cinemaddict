import { TypeSort, TypeUpdate } from './../const.js';
import Observable from './../framework/observable.js';
import { shuffleArray } from './../utils/common.js';

/** Модель управляющая сортировкой */
export default class SortModel extends Observable {
  #activeItem = TypeSort.DEFAULT;

  get activeItem() {
    return this.#activeItem;
  }

  set activeItem(newActiveItem) {
    if (this.#activeItem === newActiveItem) {
      return;
    }

    this.#activeItem = newActiveItem;
    this._notify(TypeUpdate.MINOR, this.#activeItem);
  }

  /** Обнуляет активную сортировку */
  resetActiveItem = () => {
    this.activeItem = TypeSort.DEFAULT;
  };

  /** Сортирует список фильмов
   * @param {Array} films
   * @param {string} typeSort
   * @returns {Array}
   */
  static sort = (films, typeSort) => shuffleArray(films.slice())
    .sort((before, after) => {
      let beforeComparison = before.info.totalRating;
      let afterComparison = before.info.totalRating;

      switch (typeSort) {
        case TypeSort.DATE:
          beforeComparison = Date.parse(before.info.release.date);
          afterComparison = Date.parse(after.info.release.date);
          break;
        case TypeSort.COMMENTED:
          beforeComparison = before.comments.length;
          afterComparison = after.comments.length;
          break;
      }

      return afterComparison - beforeComparison;
    });
}
