import {createElement} from '../render.js';
import FilmDetailsView from './film-details-view.js';
import CommentsView from './comments-view.js';

const createPopupFilmTemplate = () => (`
  <section class="film-details">
    <div class="film-details__inner">
      ${new FilmDetailsView().getTemplate()}
      ${new CommentsView().getTemplate()}
    </div>
  </section>
`);

/** Вью попапа для подробного описания фильма. */
export default class PopupFilmView {
  /**
   * @returns {string} Шаблон разметки.
   */
  getTemplate() {
    return createPopupFilmTemplate();
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
