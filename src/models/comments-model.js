import Observable from './../framework/observable.js';
import { generateComment } from './../mock/comment.js';

/** Модель комментариев. */
export default class CommentsModel extends Observable {
  #items = Array.from({length: 74}, generateComment);

  /** Ищет и возвращает комментарии с нужныхм id
   * @param {Array} ids список id нужных комментариев
   * @returns {Array} список комментариев
   */
  getItems = (ids) => ids.map((id) => this.#items
    .find((comment) => id === comment.id));

  /** Добавляет новый комментарий
   * @param {Array} typeUpdate
   * @param {Object} newComment
   */
  addItem = (typeUpdate, newItem) => {
    this.#items.push(newItem);
  };

  /** Удаляет комментарий
   * @param {Array} typeUpdate
   * @param {Object} deletedItem
   */
  removeItem = (typeUpdate, deletedItem) => {
    const deletedFilmIndex = this.#items
      .findIndex((item) => item.id === deletedItem.id);

    this.#items.splice(deletedFilmIndex, 1);
  };
}
