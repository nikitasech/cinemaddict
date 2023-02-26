import Observable from '../framework/observable.js';
import {generateFilm} from '../mock/film.js';

export default class FilmsModel extends Observable {
  #items = Array.from({length: 36}, generateFilm);

  get items() {
    return this.#items;
  }

  /**
   * Находит в массиве элемент по id и заменяет его на новый
   * @param {Object} newItem новый элемент массива
   */
  updateItem = (newItem) => {
    const index = this.#items.findIndex((item) => item.id === newItem.id);

    if (index !== -1) {
      this.#items = [
        ...this.#items.slice(0, index),
        newItem,
        ...this.#items.slice(index + 1)
      ];

      // this._notify(); В будущем добавится подписочная система наблюдателя
    }
  };
}
