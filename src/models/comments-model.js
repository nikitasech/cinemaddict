import {generateComment} from '../mock/comment.js';

/** Модель комментариев. */
export default class CommentsModel {
  #comments = Array.from({length: 74}, generateComment);

  get comments() {
    return this.#comments;
  }

  /**
   * @param {array} ids Массив с id нужных комментариев.
   * @returns {array} Массив с найденными по id комментариями.
   */
  getCommentsById = (ids) => ids.map((id) => this.#comments
    .find((comment) => id === comment.id));
}
