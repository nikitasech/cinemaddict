import Observable from '../framework/observable.js';
import {generateComment} from '../mock/comment.js';

/** Модель комментариев. */
export default class CommentsModel extends Observable {
  #items = Array.from({length: 74}, generateComment);

  get items() {
    return this.#items;
  }

  addItem = (newItem) => {
    this.#items.push(newItem);

    // this._notify();
  };

  removeItem = (deletedItem) => {
    delete this.#items[this.#items.indexOf((item) => item.id === deletedItem.id)];

    // this._notify();
  };
}
