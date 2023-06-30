import Observable from '../framework/observable.js';
import {generateComment} from '../mock/comment.js';

/** Модель комментариев. */
export default class CommentsModel extends Observable {
  #items = Array.from({length: 74}, generateComment);

  getItems = (ids) => ids.map((id) => this.#items
    .find((comment) => id === comment.id));

  addItem = (newItem) => {
    this.#items.push(newItem);

    // this._notify();
  };

  removeItem = (typeUpdate, deletedItem) => {
    const deletedFilmIndex = this.#items
      .findIndex((item) => item.id === deletedItem.id);

    this.#items.splice(deletedFilmIndex, 1);
    this._notify(typeUpdate, deletedItem);
  };
}
