import {createElement} from '../render.js';
import {formatIsoDate} from '../utils.js';


const createCommentTemplate = (comment) => {
  const {emotion, author} = comment;
  const text = comment.comment;
  const date = formatIsoDate(comment.date, 'YYYY/MM/DD HH:mm');

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

/** Вью комментария. */
export default class CommentView {
  /**
   * @param {object} comment Объект с данными комменария.
   */
  constructor(comment) {
    this.comment = comment;
  }

  /**
   * @returns {string} Шаблон разметки.
   */
  getTemplate() {
    return createCommentTemplate(this.comment);
  }

  /**
   * @returns {nodeObject} DOM-узел разметки.
   */
  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  /**
   * Удаляет DOM-узел из объекта.
   */
  removeElement() {
    this.element = null;
  }
}
