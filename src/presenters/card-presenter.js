import {TypeControls} from './../const.js';
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
    if (!this.#film) {
      this.#film = film;
      this.#renderCard(container);
    }

    this.#renderControls();
  };

  /** Отрисовывает новую карточку в контейнер
   * @param {HTMLElement} container контейнер для карточки
   */
  #renderCard = (container) => {
    this.#cardComponent = new FilmCardView(this.#film);
    render(this.#cardComponent, container);
    this.#cardComponent.setClickHandler(this.#renderPopup);
  };

  /** Отрисовывает элементы управления в карточке */
  #renderControls = () => {
    const prevControlsComponent = this.#controlsComponent;
    this.#controlsComponent = new FilmControlsView(
      this.#film.userDetails,
      TypeControls.CARD
    );

    if (!prevControlsComponent) {
      render(this.#controlsComponent, this.#cardComponent.element);
    } else {
      replace(this.#controlsComponent, prevControlsComponent);
    }

    this.#controlsComponent.setClickHandler(
      this.#chengeWatchlistHandler,
      this.#chengeWatchedHandler,
      this.#chengeFavoriteHandler
    );
  };

  /** Добавляет фильм в список просмотров и наоборот @callback */
  #chengeWatchlistHandler = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#filmChangeHandler(this.#film);
  };

  /** Добавляет фильм в просмотренные и наоборот @callback */
  #chengeWatchedHandler = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#filmChangeHandler(this.#film);
  };

  /** Добавляет фильм в любимые и наоборот @callback */
  #chengeFavoriteHandler = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#filmChangeHandler(this.#film);
  };
}
