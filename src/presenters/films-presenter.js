import {render} from './../framework/render.js';
import {TypeSort, NameList, TypeAction, TypeUpdate, FilterType} from './../const.js';
import {sortByDate, sortByComments, sortByRating} from './../utils/sort.js';
import FilmsView from './../views/films-view.js';
import PopupPresenter from './popup-presenter.js';
import ListPresenter from './list-presenter.js';

/**
 * Главный презентер. Управляет всеми списками фильмов
 * ({@link ListPresenter}) и попапом ({@link PopupPresenter})
 * @param {Object} filmsModel модель фильмов
 * @param {Object} commentsModel модель комментариев
*/
export default class FilmsPresenter {
  /** @type {Object|null} модель фильмов */
  #filmsModel = null;

  /** @type {Object|null} модель фильтров */
  #filtersModel = null;

  /** @type {Object|null} модель комментариев */
  #commentsModel = null;

  /** @type {Object|null} презентер попапа */
  #popupPresenter = null;

  /** Перечисление презентеров списков @enum {Object} */
  #ListPresenter = {};

  /** @type {Object|null} представление корневого контейнера для фильмов */
  #filmsComponent = new FilmsView();

  /** @type {null|number} id отрисованного в попапе фильма */
  #popupFilmId = null;

  constructor(filmsModel, filtersModel, commentsModel) {
    this.#filmsModel = filmsModel;
    this.#filtersModel = filtersModel;
    this.#commentsModel = commentsModel;

    this.#popupPresenter = new PopupPresenter(
      this.#getComments,
      this.#viewActionHandler,
      this.#removePopup
    );

    this.#ListPresenter = {
      ALL: new ListPresenter(
        this.#filmsComponent.element,
        this.#viewActionHandler,
        this.#renderPopup
      ),

      TOP: new ListPresenter(
        this.#filmsComponent.element,
        this.#viewActionHandler,
        this.#renderPopup
      ),

      COMMENTED: new ListPresenter(
        this.#filmsComponent.element,
        this.#viewActionHandler,
        this.#renderPopup
      )
    };

    this.#filmsModel.addObserver(this.#modelEventHandler);
    this.#filtersModel.addObserver(this.#modelEventHandler);
  }

  #viewActionHandler = (typeAction, typeUpdate, payload) => {
    switch(typeAction) {
      case TypeAction.UPDATE_FILM:
        this.#filmsModel.updateItem(typeUpdate, payload);
        break;
    }
  };

  #modelEventHandler = (typeUpdate, payload) => {
    switch(typeUpdate) {
      case TypeUpdate.PATCH:
        this.#updateFilm(payload);
        break;
      case TypeUpdate.MINOR:
        this.#ListPresenter.ALL.init(payload);
    }
  };

  #getFilms = (typeSort, countFilms) => {
    const activeFilter = this.#filtersModel.activeItem;

    const films = (activeFilter === FilterType.ALL)
      ? this.#filmsModel.items
      : this.#filmsModel.items
        .filter((film) => this.#filtersModel
          .items[activeFilter].includes(film.id));

    switch (typeSort) {
      case TypeSort.DATE:
        return sortByDate(films, countFilms);
      case TypeSort.RATING:
        return sortByRating(films, countFilms);
      case NameList.COMMENTED:
        return sortByComments(films, countFilms);
      default:
        return films;
    }
  };

  /**
   * @param {array} ids массив с id нужных комментариев
   * @returns {array} массив с найденными по id комментариями
   */
  #getComments = (ids) => ids.map((id) => this.#commentsModel.items
    .find((comment) => id === comment.id));

  /** Отрисовывает начальное состояние приложения
   * @param {HTMLElement} filmsContainer контейнер для отрисовки состояния
   */
  init = (rootContainer) => {
    this.#rednerFilmsContainer(rootContainer);
    this.#renderMainList();

    if (this.#filmsModel.items.length) {
      this.#renderTopList();
      this.#renderCommentedList();
    }
  };

  /** @param {HTMLElement} container контейнер для отрисовки контейнера фильмов */
  #rednerFilmsContainer = (container) => render(this.#filmsComponent, container);

  /** Отрисовывает главный список фильмов. Сначало с информацией
  загрузке, а потом перерисовывает со стандартным заголовком списка. */
  #renderMainList = () => {
    this.#ListPresenter.ALL
      .init(NameList.MAIN, this.#getFilms);
  };

  /** Отрисовывает список "Top rated" */
  #renderTopList = () => {
    this.#ListPresenter.TOP
      .init(NameList.RATING, this.#getFilms);
  };

  /** Отрисовывает список "Most commented" */
  #renderCommentedList = () => {
    this.#ListPresenter.COMMENTED
      .init(NameList.COMMENTED, this.#getFilms);
  };

  /** Отрисовывает попап фильма
   * @param {Object} film фильм для отрисовки попапа
   */
  #renderPopup = (film) => {
    this.#popupFilmId = film.id;
    this.#popupPresenter.init(film);
  };

  /** Удаляет попап фильма */
  #removePopup = () => {
    this.#popupFilmId = null;
    this.#popupPresenter.destroy();
  };

  /**
   * Обновляет данные фильма во всех списках
   * @param {Object} новые данные фильма
   */
  #updateFilm = (newFilm) => {
    this.#ListPresenter.ALL.updateFilm(newFilm);
    this.#ListPresenter.TOP.updateFilm(newFilm);
    this.#ListPresenter.COMMENTED.updateFilm(newFilm);

    if (this.#popupFilmId === newFilm.id) {
      this.#renderPopup(newFilm);
    }
  };
}
