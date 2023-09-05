import { render, replace } from './../framework/render.js';
import CardPresenter from './card-presenter.js';
import FilmsContainerView from './../views/films-container-view.js';
import ListFilmsView from './../views/list-films-view.js';
import ListFilmsTitleView from './../views/list-films-title-view.js';
import { TypeAction } from './../const.js';

const IS_TITLE_HIDDEN = false;

/**
 * Дочерний презентер {@link FilmsPresenter}, управляющий простым
 * списком фильмов и презентерами карточек фильмов ({@link CardPresenter})
 * @param {HTMLElement} container контейнер для отрисовки для списка
 * @param {string} typeList тип списка
 * @param {Function} changeDate функция обновления данных
 * @param {Function} openPopup функция отрисовки попапа
 */
export default class ListPresenter {
  _containerElement = null;
  _CardPresenter = new Map();
  _listComponent = null;
  #listTitleComponent = null;
  #filmsContainerComponent = null;
  _films = null;
  _title = null;
  _type = null;
  #changeDate = null;
  #openPopup = null;

  constructor(container, typeList, changeDate, openPopup) {
    this._containerElement = container;
    this._type = typeList;
    this.#changeDate = changeDate;
    this.#openPopup = openPopup;
  }

  /** Инициализирует новый список
   * @param {Array} films список фильмов
   * @param {string} titleText заголовок списка
   */
  init = (titleText, films) => {
    this._title = titleText;
    this._films = films;
    this._reset();
    this._render(films, titleText);
  };

  /** Обновляет фильм в списке
   * @param {Object} newFilm обновленный фильм
   */
  updateFilm = (newFilm) => {
    const cardPresenter = this._CardPresenter.get(newFilm.id);

    if (cardPresenter) {
      cardPresenter.init(this.#filmsContainerComponent.element, newFilm);
    }
  };

  setAborting = (typeAction, elementId) => {
    switch (typeAction) {
      case TypeAction.UPDATE_FILM:
        if (this._CardPresenter.get(elementId)) {
          this._CardPresenter.get(elementId).setAborting(typeAction);
          break;
        }
    }
  };

  _reset = () => {
    this._CardPresenter.clear();
  };

  _render = (films, titleText) => {
    this._renderList();
    this._renderTitle(titleText, IS_TITLE_HIDDEN);

    if (films.length) {
      this._renderFilmsContainer();
      this._renderCards(films);
    }
  };

  _renderList = () => {
    const prevListComponent = this._listComponent;
    this._listComponent = new ListFilmsView(this._type);

    if (!prevListComponent) {
      render(this._listComponent, this._containerElement);
    } else {
      replace(this._listComponent, prevListComponent);
    }
  };

  _renderTitle = (title, isTitleHidden) => {
    this.#listTitleComponent = new ListFilmsTitleView(title, isTitleHidden);
    render(this.#listTitleComponent, this._listComponent.element);
  };

  _renderFilmsContainer = () => {
    this.#filmsContainerComponent = new FilmsContainerView();
    render(this.#filmsContainerComponent, this._listComponent.element);
  };

  #renderCard = (film) => {
    const cardPresenter = new CardPresenter(
      this.#changeDate,
      this.#openPopup
    );

    this._CardPresenter.set(film.id, cardPresenter);
    cardPresenter.init(this.#filmsContainerComponent.element, film);
  };

  _renderCards = (films) => {
    films.forEach((film) => {
      this.#renderCard(film);
    });
  };
}
