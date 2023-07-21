import { TypeUpdate } from '../const.js';
import Observable from '../framework/observable.js';

/** Модель управляющая всеми всеми фильмами */
export default class FilmsModel extends Observable {
  #apiService;
  #items = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get items() {
    return this.#items;
  }

  /** Инициализирует модель */
  init = async () => {
    try {
      const films = await this.#apiService.items;
      this.#items = films.map(this.#adaptToClient);
    } catch (err) {
      this.#items = [];
    }

    this._notify(TypeUpdate.INIT, this.#items);
  };

  /** Находит в массиве элемент по id и заменяет его на новый
   * @param {Object} newItem новый элемент массива
   */
  updateItem = async (typeUpdate, newItem) => {
    const index = this.#items.findIndex((item) => item.id === newItem.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#apiService.updateItem(newItem);
      const updatedItem = this.#adaptToClient(response);
      this.#items = [
        ...this.#items.slice(0, index),
        updatedItem,
        ...this.#items.slice(index + 1)
      ];

      this._notify(typeUpdate, newItem);
    } catch (err) {
      throw new Error('Can\'t update film');
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

    return adaptedItem;
  };
}
