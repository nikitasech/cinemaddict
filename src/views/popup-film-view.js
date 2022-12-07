import AbstractView from './../framework/view/abstract-view.js';
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

/**
 * Вью попапа для подробного описания фильма
 * @param {Object} film данные фильма
 */
export default class PopupFilmView extends AbstractView {
  /** @type {Object} данные фильма */
  #film = {};

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createPopupFilmTemplate(this.#film);
  }

  /**
   * Функция обработчика нажатия на кнопку закрытия попапа
   * @param {Object} evt объект события
   */
  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  };

  /**
   * Устанавливает обработчик событий на клик по кнопке закрытия попапа
   * @param {Function} callback функция для выполнения после выявления события
   */
  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this.#closeClickHandler);
  };

  /** Удаляет обработчик события с кнопки закрытия закрытия попапа */
  removeCloseClickHandler = () => {
    this.element
      .querySelector('.film-details__close-btn')
      .removeEventListener('click', this.#closeClickHandler);
  };
}
