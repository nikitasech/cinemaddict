import AbstractView from './../framework/view/abstract-view.js';
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

/**
 * Вью блока с комментариями
 * @param {number} commentsCount количество комметариев
 */
export default class CommentsView extends AbstractView {
  /** @type {number|null} количество комметариев */
  #count = null;

  constructor(commentsCount) {
    super();
    this.#count = commentsCount;
  }

  get template() {
    return createCommentsTemplate(this.#count);
  }
}
