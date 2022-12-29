import {TypeControls} from './../const.js';
import {render, replace} from './../framework/render.js';
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

  constructor(popupPresenter, filmChangeHandler) {
    this.#popupPresenter = popupPresenter;
    this.filmChangeHandler = filmChangeHandler;
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
    if (this.#cardComponent) {
      const prevCardComponent = this.#cardComponent;
      this.#cardComponent = new FilmCardView(this.#film);

      replace(this.#cardComponent, prevCardComponent);
    } else {
      this.#cardComponent = new FilmCardView(this.#film);

      render(this.#cardComponent, container);
    }

    this.#renderControls();
    this.#cardComponent.setClickHandler(this.#popupPresenter.init);
  };

  /** Отрисовывает элементы управления в карточке */
  #renderControls = () => {
    this.#controlsComponent = new FilmControlsView(
      this.#film.userDetails,
      TypeControls.CARD
    );

    // this.#controlsComponent.setWatchlistClickHundler(this.#chengeWatchlistHandler);
    // this.#controlsComponent.setWatchedClickHundler(this.#chengeWatchedHandler);
    // this.#controlsComponent.setFavoriteClickHundler(this.#chengeFavoriteHandler);

    this.#controlsComponent.setClickHandler(
      this.#chengeWatchlistHandler,
      this.#chengeWatchedHandler,
      this.#chengeFavoriteHandler
    );

    render(this.#controlsComponent, this.#cardComponent.element);
  };

  #chengeWatchlistHandler = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.filmChangeHandler(this.#film);
  };

  #chengeWatchedHandler = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.filmChangeHandler(this.#film);
  };

  #chengeFavoriteHandler = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.filmChangeHandler(this.#film);
  };
}
