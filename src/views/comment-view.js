import { TypeAction, TypeUpdate } from '../const.js';
import AbstractView from './../framework/view/abstract-view.js';
import { dateFromNow } from './../utils/common.js';
import he from 'he';

const createCommentTemplate = (comment) => {
  const {emotion, author} = comment;
  const text = he.encode(comment.comment);
  const date = dateFromNow(comment.date);

  return (`
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${date}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>
  `);
};

/** Представление комментария
 * @param {Object} comment данные комменария
 */
export default class CommentView extends AbstractView {
  #comment = {};

  constructor(comment) {
    super();
    this.#comment = comment;
  }

  get template() {
    return createCommentTemplate(this.#comment);
  }

  /** Устанавливает обработчик клика на кнопку "Delete"
   * @param {Function} callback функция для выполнения после выявления события
   */
  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element
      .querySelector('.film-details__comment-delete')
      .addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click(
      TypeAction.REMOVE_COMMENT,
      TypeUpdate.PATCH,
      this.#comment
    );
  };
}
