import {render} from './../framework/render.js';
import FilmCardView from '../views/film-card-view.js';

/**
 * Презентер фильма. Управляет отображением карточки.
 * @param {Object} filmsModel модель фильмов
 * @param {Object} commentsModel модель комментариев
*/
export default class CardPresenter {
  /** @type {Object} презентер попапа */
  #popupPresenter = null;

  constructor(popupPresenter) {
    this.#popupPresenter = popupPresenter;
  }

  /**
   * Отрисовывает карточку фильма в контейнер
   * @param {HTMLElement} container контейнер для отрисовки карточек
   * @param {Object} film объект с данными о фильме
   */
  init = (container, film) => {
    const card = new FilmCardView(film);
    card.setClickHandler(this.#popupPresenter.init);
    render(card, container);
  };
}
