import { TypeUpdate } from '../const.js';
import Observable from '../framework/observable.js';
import { generateFilm } from '../mock/film.js';

/** Модель управляющая всеми всеми фильмами */
export default class FilmsModel extends Observable {
  #items = [];
  #filmsApiService = null;

  constructor(filmsApiService) {
    super();
    this.#filmsApiService = filmsApiService;
  }

  get items() {
    return this.#items;
  }

  /** Инициализирует модель */
  init = () => {
    this.#items = Array.from({length: 36}, generateFilm);
    this._notify(TypeUpdate.INIT, this.#items);
  };

  /** Находит в массиве элемент по id и заменяет его на новый
   * @param {Object} newItem новый элемент массива
   */
  updateItem = (typeUpdate, newItem) => {
    const index = this.#items.findIndex((item) => item.id === newItem.id);

    if (index !== -1) {
      this.#items = [
        ...this.#items.slice(0, index),
        newItem,
        ...this.#items.slice(index + 1)
      ];

      this._notify(typeUpdate, newItem);
    }
  };

  #adaptToClient = (item) => {
    const adaptedItem = {
      ...item,
      info: {
        ...item['film_info'],
        alternativeTitle: item['film_info']['alternative_title'],
        totalRating: item['film_info']['total_rating'],
        ageRating: item['film_info']['age_rating'],
        release: {
          ...item['film_info']['release'],
          country: item['film_info']['release']['release_country']
        },
      },
      userDetails: {
        ...item['user_details'],
        alreadyWatched: item['user_details']['already_watched'],
        watchingDate: item['user_details']['watching_date'],
      }
    };

    delete adaptedItem['film_info'];
    delete adaptedItem.info['alternative_title'];
    delete adaptedItem.info['total_rating'];
    delete adaptedItem.info['age_rating'];
    delete adaptedItem.info.release['release_country'];
    delete adaptedItem['user_details'];
    delete adaptedItem.userDetails['already_watched'];
    delete adaptedItem.userDetails['watching_date'];

    return item;
  };
}
