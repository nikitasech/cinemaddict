import {createElement} from '../render.js';
import FormCommentView from './form-comment-view.js';

const createCommentsTemplate = (commentsCount) => (`
  <div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">
        Comments <span class="film-details__comments-count">${commentsCount}</span>
      </h3>
      <ul class="film-details__comments-list"></ul>
      ${new FormCommentView().template}
    </section>
  </div>
`);

/** Вью блока с комментариями. */
export default class CommentsView {
  #element = null;
  #count = null;

  constructor(commentsCount) {
    this.#count = commentsCount;
  }

  /**
   * @returns {string} Шаблон разметки.
   */
  get template() {
    return createCommentsTemplate(this.#count);
  }

  /**
   * @returns {nodeObject} DOM-узел разметки.
   */
  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  /**
   * Удаляет DOM-узел из объекта.
   */
  removeElement = () => {
    this.#element = null;
  };
}
