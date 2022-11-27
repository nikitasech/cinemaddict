import {createElement} from '../render.js';
import FilmDetailsView from './film-details-view.js';
import CommentsView from './comments-view.js';

const createPopupFilmTemplate = (film) => (`
  <section class="film-details">
    <div class="film-details__inner">
      ${new FilmDetailsView(film).getTemplate()}
      ${new CommentsView().getTemplate()}
    </div>
  </section>
`);

/** Вью попапа для подробного описания фильма. */
export default class PopupFilmView {
  /**
   * @param {object} film Объект с данными о фильме.
   */
  constructor(film) {
    this.film = film;
  }

  /**
   * @returns {string} Шаблон разметки.
   */
  getTemplate() {
    return createPopupFilmTemplate(this.film);
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
