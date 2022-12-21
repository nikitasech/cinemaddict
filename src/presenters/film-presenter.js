import {render} from '../framework/render.js';
import FilmCardView from '../views/film-card-view.js';

/**
 * Презентер фильма. Управляет отображением карточки
 * @param {Object} popupPresenter презентер попапа
*/
export default class FilmPresenter {
  /** @type {Object|null} презентер попапа */
  #popupPresenter = null;

  /** @type {Object|null} данные фильма */
  #film = null;

  constructor(popupPresenter) {
    this.#popupPresenter = popupPresenter;
  }

  changeControlWatchlist = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
  };

  /**
   * Отрисовывает карточку фильма в контейнер
   * @param {HTMLElement} container контейнер для отрисовки карточек
   * @param {Object} film объект с данными о фильме
   */
  init = (container, film) => {
    this.#film = film;
    const card = new FilmCardView(film);
    card.setClickHandler(this.#popupPresenter.init);
    render(card, container);
  };
}
