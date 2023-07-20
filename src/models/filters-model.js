import { TypeFilter, TypeUpdate } from '../const.js';
import Observable from './../framework/observable.js';
import { filter } from './../utils/filter.js';

const DEFAULT_ACTIVE_FILTER = TypeFilter.ALL;

/** Модель управляющая фильтрами
 * @param {Array} films массив фильмов
*/
export default class FiltersModel extends Observable {
  #activeItem = DEFAULT_ACTIVE_FILTER;
  #counters = [];

  constructor() {
    super();
    this.setCounters();
  }

  get activeItem() {
    return this.#activeItem;
  }

  get counters() {
    return this.#counters;
  }

  // #TODO заменить на функцию updateActiveItem
  set activeItem(newActiveItem) {
    if (newActiveItem === this.#activeItem) {
      return;
    }

    this.#activeItem = newActiveItem;
    this._notify(TypeUpdate.MINOR, this.#activeItem);
  }

  setCounters(films = []) {
    const newCounters = [];
    for (const typeFilter of Object.values(TypeFilter)) {
      if (typeFilter !== TypeFilter.ALL) {
        newCounters.push({
          name: typeFilter,
          count: filter(films, typeFilter).length
        });
      }
    }

    this.#counters = newCounters;
  }
}
