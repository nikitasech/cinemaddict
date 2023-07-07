import AbstractView from './../framework/view/abstract-view.js';

const createPopupFilmTemplate = () => (`
  <section class="film-details">
    <div class="film-details__inner"></div>
  </section>
`);

/** Представление попапа с подробный описанием фильма
 * @param {Object} film данные фильма
 */
export default class PopupFilmView extends AbstractView {
  #film = {};

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createPopupFilmTemplate(this.#film);
  }

  get containerElement() {
    return this.element.querySelector('.film-details__inner');
  }

  /** Устанавливает обработчик событий на клик по кнопке закрытия попапа
   * @param {Function} callback функция для выполнения после выявления события
   */
  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this.#closeClickHandler);
  };

  /** Устанавливает обработчик событий на Esc
   * @param {Function} callback функция для выполнения после выявления события
   */
  setEscKeydownHandler = (callback) => {
    this._callback.escKeydown = callback;
    document.addEventListener('keydown', this.#escKeydownHandler);
  };

  /** Удаляет обработчик события с кнопки закрытия попапа */
  removeCloseClickHandler = () => {
    this.element
      .querySelector('.film-details__close-btn')
      .removeEventListener('click', this.#closeClickHandler);
  };

  /** Удаляет обработчик события с клавиши Esc */
  removeEscKeydownHandler = () => {
    document.removeEventListener('keydown', this.#escKeydownHandler);
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  };

  #escKeydownHandler = (evt) => {
    if (evt.code === 'Escape') {
      evt.preventDefault();
      this._callback.escKeydown();
    }
  };
}
