import AbstractView from './../framework/view/abstract-view.js';

const createPopupFilmTemplate = () => (`
  <section class="film-details">
    <div class="film-details__inner"></div>
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
   * Геттер получения контейнера для информации
   * @returns {HTMLElement} контейнер для информации
   */
  get containerElement() {
    return this.element.querySelector('.film-details__inner');
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

  /** Удаляет обработчик события с кнопки закрытия попапа */
  removeCloseClickHandler = () => {
    this.element
      .querySelector('.film-details__close-btn')
      .removeEventListener('click', this.#closeClickHandler);
  };
}
