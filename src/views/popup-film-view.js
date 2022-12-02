import {createElement} from '../render.js';
import FilmDetailsView from './film-details-view.js';
import CommentsView from './comments-view.js';

const createPopupFilmTemplate = (film) => (`
  <section class="film-details">
    <div class="film-details__inner">
      ${new FilmDetailsView(film).template}
      ${new CommentsView(film.comments.length).template}
    </div>
  </section>
`);

/** Вью попапа для подробного описания фильма. */
export default class PopupFilmView {
  #element = null;
  #film = null;

  /**
   * @param {object} film Объект с данными о фильме.
   */
  constructor(film) {
    this.#film = film;
  }

  /**
   * @returns {string} Шаблон разметки.
   */
  get template() {
    return createPopupFilmTemplate(this.#film);
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
