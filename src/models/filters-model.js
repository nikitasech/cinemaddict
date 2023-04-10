import { FilterType } from '../const';
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

  changeActiveItem = (typeUpdate, newActiveItem) => {
    this.#activeItem = newActiveItem;
    this._notify(typeUpdate, this.#activeItem);
  };

  #getFilters = (films) => ({
    [FilterType.WATCHLIST]: this.#getWatchlist(films),
    [FilterType.HISTORY]: this.#getWatched(films),
    [FilterType.FAVORITE]: this.#getFavorite(films),
  });

  #getWatchlist = (films) => films
    .filter((film) => film.userDetails.watchlist)
    .map((film) => film.id);

  #getWatched = (films) => films
    .filter((film) => film.userDetails.alreadyWatched)
    .map((film) => film.id);

  #getFavorite = (films) => films
    .filter((film) => film.userDetails.favorite)
    .map((film) => film.id);
}
