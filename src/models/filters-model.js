import { FilterType, TypeUpdate } from '../const.js';
import Observable from '../framework/observable.js';

const defaultActiveFilter = FilterType.ALL;

export default class FiltersModel extends Observable {
  #activeItem = defaultActiveFilter;
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

  updateItems = (typeUpdate, newFilm) => {
    const isFiltersNewFilm = {
      [FilterType.WATCHLIST]: newFilm.userDetails.watchlist,
      [FilterType.HISTORY]: newFilm.userDetails.alreadyWatched,
      [FilterType.FAVORITE]: newFilm.userDetails.favorite
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

  filter = (films, type = this.#activeItem) => films.filter((film) => {
    const isFilter = {
      [FilterType.ALL]: true,
      [FilterType.WATCHLIST]: film.userDetails.watchlist,
      [FilterType.HISTORY]: film.userDetails.alreadyWatched,
      [FilterType.FAVORITE]: film.userDetails.favorite
    };

    return isFilter[type];
  });

  #getFilters = (films) => ({
    [FilterType.WATCHLIST]: this.filter(films, FilterType.WATCHLIST).map((film) => film.id),
    [FilterType.HISTORY]: this.filter(films, FilterType.HISTORY).map((film) => film.id),
    [FilterType.FAVORITE]: this.filter(films, FilterType.FAVORITE).map((film) => film.id)
  });
}
