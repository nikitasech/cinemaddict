import {TypeControls} from './../const.js';
import {render} from './../framework/render.js';
import FilmCardView from './../views/film-card-view.js';
import FilmControlsView from './../views/film-controls-view.js';

/** Презентер фильма. Управляет отображением карточки
 * @param {Object} popupPresenter презентер попапа
*/
export default class CardPresenter {
  /** @type {Object|null} презентер попапа */
  #popupPresenter = null;

  /** @type {Object|null} данные фильма */
  #film = null;

  /** @type {Object|null} представление карточки */
  #cardComponent = null;

  /** @type {Object|null} представление элементов управления */
  #controlsComponent = null;

  constructor(popupPresenter) {
    this.#popupPresenter = popupPresenter;
  }

  /** Отрисовывает карточку фильма в контейнер
   * @param {HTMLElement} container контейнер для отрисовки карточек
   * @param {Object} film объект с данными о фильме
   */
  init = (container, film) => {
    this.#film = film;

    this.#renderCard(container);
  };

  /** Отрисовывает новую карточку в контейнер
   * @param {HTMLElement} container контейнер для карточки
   */
  #renderCard = (container) => {
    this.#cardComponent = new FilmCardView(this.#film);
    this.#renderControls();
    render(this.#cardComponent, container);
    this.#cardComponent.setClickHandler(this.#popupPresenter.init);
  };

  /** Отрисовывает элементы управления в карточке */
  #renderControls = () => {
    this.#controlsComponent = new FilmControlsView(
      this.#film.userDetails,
      TypeControls.CARD
    );

    render(this.#controlsComponent, this.#cardComponent.element);
  };
}
