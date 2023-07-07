import { TypeFilter, TypeUpdate } from '../const.js';
import Observable from '../framework/observable.js';
import { filter } from '../utils/filter.js';

const DEFAULT_ACTIVE_FILTER = TypeFilter.ALL;

/** Модель управляющая фильтрами
 * @param {Array} films массив фильмов
*/
export default class FiltersModel extends Observable {
  #activeItem = DEFAULT_ACTIVE_FILTER;
  #items = null;

  constructor(films) {
    super();
    this.#items = this.#getFilters(films);
  }

  get activeItem() {
    return this.#activeItem;
  }

  set activeItem(newActiveItem) {
    if (newActiveItem === this.#activeItem) {
      return;
    }

    this.#activeItem = newActiveItem;
    this._notify(TypeUpdate.MINOR, this.#activeItem);
  }

  get items() {
    return this.#items;
  }

  /** Обновляет счетчики фильтров
   * @param {string} typeUpdate
   * @param {Object} newFilm
   */
  updateCounters = (typeUpdate, newFilm) => {
    const isFiltersNewFilm = {
      [TypeFilter.WATCHLIST]: newFilm.userDetails.watchlist,
      [TypeFilter.HISTORY]: newFilm.userDetails.alreadyWatched,
      [TypeFilter.FAVORITE]: newFilm.userDetails.favorite
    };

    Object.keys(this.#items).forEach((typeFilter) => {
      const filmIndex = this.#items[typeFilter]
        .findIndex((film) => film === newFilm.id);

      if (filmIndex !== -1 && !isFiltersNewFilm[typeFilter]) {
        this.#items[typeFilter].splice(filmIndex, 1);
      } else if (filmIndex === -1 && isFiltersNewFilm[typeFilter]) {
        this.#items[typeFilter].push(newFilm.id);
      }
    });

    this._notify(typeUpdate, this.#activeItem);
  };

  #getFilters = (films) => ({
    [TypeFilter.WATCHLIST]: filter(films, TypeFilter.WATCHLIST).map((film) => film.id),
    [TypeFilter.HISTORY]: filter(films, TypeFilter.HISTORY).map((film) => film.id),
    [TypeFilter.FAVORITE]: filter(films, TypeFilter.FAVORITE).map((film) => film.id)
  });
}
