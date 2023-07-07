import {TypeControl, NameControl, TypeAction, TypeUpdate} from './../const.js';
import {remove, render, replace} from './../framework/render.js';
import FilmCardView from './../views/film-card-view.js';
import FilmControlsView from './../views/film-controls-view.js';

/**
 * Дочерний презентер {@link ListPresenter}, управляющий отображением карточки фильма
 * @param {Function} filmChangeHandler функция изменения данных фильма
 * @param {Function} renderPopup функция отрисовки попапа
*/
export default class CardPresenter {
  #film = null;
  #cardComponent = null;
  #controlsComponent = null;
  #changeDate = null;
  #renderPopup = null;

  constructor(changeDate, renderPopup) {
    this.#changeDate = changeDate;
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

  /** Удаляет карточку фильма */
  remove = () => {
    remove(this.#cardComponent);
  };

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

  #renderControls = () => {
    this.#controlsComponent = new FilmControlsView(
      this.#film.userDetails,
      TypeControl.CARD
    );

    render(this.#controlsComponent, this.#cardComponent.element);

    this.#controlsComponent.setClickHandler(this.#changeControlHandler);
  };

  #changeControlHandler = (controlName) => {
    const newFilm = structuredClone(this.#film);

    switch (controlName) {
      case NameControl.WATCHLIST:
        newFilm.userDetails.watchlist = !newFilm.userDetails.watchlist;
        break;
      case NameControl.WATCHED:
        newFilm.userDetails.alreadyWatched = !newFilm.userDetails.alreadyWatched;
        break;
      case NameControl.FAVORITE:
        newFilm.userDetails.favorite = !newFilm.userDetails.favorite;
        break;
    }

    this.#changeDate(TypeAction.UPDATE_FILM, TypeUpdate.PATCH, newFilm);
  };
}
