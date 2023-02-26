import {TypeControls, ControlName} from './../const.js';
import {render, replace} from './../framework/render.js';
import FilmCardView from './../views/film-card-view.js';
import FilmControlsView from './../views/film-controls-view.js';

/**
 * Дочерний презентер {@link ListPresenter}, управляющий отображением карточки фильма
 * @param {Function} filmChangeHandler функция изменения данных фильма
 * @param {Function} renderPopup функция отрисовки попапа
*/
export default class CardPresenter {
  /** @type {Object|null} данные фильма */
  #film = null;

  /** @type {Object|null} представление карточки */
  #cardComponent = null;

  /** @type {Object|null} представление элементов управления */
  #controlsComponent = null;

  /** @type {Function|null} функция изменения данных фильма */
  #filmChangeHandler = null;

  /** @type {Function|null} функция отрисовки попапа */
  #renderPopup = null;

  constructor(filmChangeHandler, renderPopup) {
    this.#filmChangeHandler = filmChangeHandler;
    this.#renderPopup = renderPopup;
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
    const prevCardComponent = this.#cardComponent;
    this.#cardComponent = new FilmCardView(this.#film);

    if (!prevCardComponent) {
      render(this.#cardComponent, container);
    } else {
      replace(this.#cardComponent, prevCardComponent);
    }

    this.#renderControls();
    this.#cardComponent.setClickHandler(this.#renderPopup);
  };

  /** Отрисовывает элементы управления в карточке */
  #renderControls = () => {
    this.#controlsComponent = new FilmControlsView(
      this.#film.userDetails,
      TypeControls.CARD
    );

    render(this.#controlsComponent, this.#cardComponent.element);

    this.#controlsComponent.setClickHandler(this.#changeControlHandler);
  };

  #changeControlHandler = (controlName) => {
    const newFilm = structuredClone(this.#film);

    switch (controlName) {
      case ControlName.WATCHLIST:
        newFilm.userDetails.watchlist = !newFilm.userDetails.watchlist;
        break;
      case ControlName.WATCHED:
        newFilm.userDetails.alreadyWatched = !newFilm.userDetails.alreadyWatched;
        break;
      case ControlName.FAVORITE:
        newFilm.userDetails.favorite = !newFilm.userDetails.favorite;
        break;
    }

    this.#filmChangeHandler(newFilm);
  };
}
