import { FilterType } from '../const';
import Observable from '../framework/observable.js';

export default class FiltersModel extends Observable {
  #items = null;

  constructor(films) {
    super();
    this.#items = this.#getFilters(films);
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
        .findIndex((film) => film.id === newFilm.id);

      if (filmIndex !== -1 && !isFiltersNewFilm[typeFilter]) {
        this.#items[typeFilter].splice(filmIndex, 1);
      } else if (filmIndex !== -1 && isFiltersNewFilm[typeFilter]) {
        this.#items[typeFilter] = [
          ...this.#items[typeFilter].slice(0, filmIndex),
          newFilm,
          ...this.#items[typeFilter].slice(filmIndex + 1)
        ];
      } else if (filmIndex === -1 && isFiltersNewFilm[typeFilter]) {
        this.#items[typeFilter].push(newFilm);
      }
    });

    this._notify(typeUpdate, this.#items);
  };

  #getFilters = (films) => ({
    [FilterType.WATCHLIST]: this.#getWatchlist(films),
    [FilterType.HISTORY]: this.#getWatched(films),
    [FilterType.FAVORITE]: this.#getFavorite(films),
  });

  #getWatchlist = (films) => films.filter((film) => film.userDetails.watchlist);
  #getWatched = (films) => films.filter((film) => film.userDetails.alreadyWatched);
  #getFavorite = (films) => films.filter((film) => film.userDetails.favorite);
}
