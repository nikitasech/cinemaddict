import {render} from './../framework/render.js';
import {TypeAction, TypeUpdate, FilterType, TypeList, ListTitle, NoFilmsListTitle, TypeSort} from './../const.js';
import FilmsView from './../views/films-view.js';
import PopupPresenter from './popup-presenter.js';
import ListPresenter from './list-presenter.js';
import MainListPresenter from './main-list-presenter.js';
import {nanoid} from 'nanoid';

/**
 * Главный презентер. Управляет всеми списками фильмов ({@link MainListPresenter}
 * и {@link ListPresenter}) и попапом ({@link PopupPresenter})
 * @param {Object} filmsModel модель фильмов
 * @param {Object} commentsModel модель комментариев
*/
export default class FilmsPresenter {
  /** @type {Object|null} модель фильмов */
  #filmsModel = null;

  /** @type {Object|null} модель фильтров */
  #filtersModel = null;

  #sortModel = null;

  /** @type {Object|null} модель комментариев */
  #commentsModel = null;

  /** @type {Object|null} презентер попапа */
  #popupPresenter = null;

  /** Перечисление презентеров списков @enum {Object} */
  #ListPresenter = {};

  /** @type {Object|null} представление корневого контейнера для фильмов */
  #filmsComponent = new FilmsView();

  /** @type {null|Object} */
  #popupFilm = null;

  constructor(filmsModel, filtersModel, sortModel, commentsModel) {
    this.#filmsModel = filmsModel;
    this.#filtersModel = filtersModel;
    this.#sortModel = sortModel;
    this.#commentsModel = commentsModel;

    this.#popupPresenter = new PopupPresenter(
      this.#viewActionHandler,
      this.#removePopup
    );

    this.#ListPresenter = {
      ALL: new MainListPresenter(
        this.#filmsComponent.element,
        TypeList.MAIN,
        this.#viewActionHandler,
        this.#renderPopup
      ),

      TOP: new ListPresenter(
        this.#filmsComponent.element,
        TypeList.EXTRA,
        this.#viewActionHandler,
        this.#renderPopup
      ),

      COMMENTED: new ListPresenter(
        this.#filmsComponent.element,
        TypeList.EXTRA,
        this.#viewActionHandler,
        this.#renderPopup
      )
    };

    this.#filmsModel.addObserver(this.#filmsModelEventHandler);
    this.#filtersModel.addObserver(this.#filtersModelEventHandler);
    this.#sortModel.addObserver(this.#sortModelEventHandler);
  }

  #viewActionHandler = (typeAction, typeUpdate, payload) => {
    switch(typeAction) {
      case TypeAction.UPDATE_FILM:
        this.#filmsModel.updateItem(typeUpdate, payload);
        break;
      case TypeAction.REMOVE_COMMENT:
        this.#deleteComment(payload);
        break;
      case TypeAction.ADD_COMMENT:
        this.#addComment(payload);
        break;
    }
  };

  #filmsModelEventHandler = (typeUpdate, payload) => {
    this.#updateFilm(payload);
    switch (typeUpdate) {
      case TypeUpdate.PATCH:
        if (this.#filtersModel.activeItem !== FilterType.ALL) {
          this.#renderMainList(false);
        }
    }
  };

  #filtersModelEventHandler = (typeUpdate) => {
    switch(typeUpdate) {
      case TypeUpdate.MINOR:
        this.#sortModel.resetItem();
        this.#renderMainList(true);
    }
  };

  #sortModelEventHandler = (typeUpdate) => {
    switch(typeUpdate) {
      case TypeUpdate.MINOR:
        this.#renderMainList(true);
    }
  };

  /** Отрисовывает начальное состояние приложения
   * @param {HTMLElement} filmsContainer контейнер для отрисовки состояния
   */
  init = (rootContainer) => {
    this.#rednerFilmsContainer(rootContainer);
    this.#renderMainList();

    if (this.#filmsModel.items.length) {
      this.#renderExtraList(this.#ListPresenter.TOP, TypeSort.RATING);
      this.#renderExtraList(this.#ListPresenter.COMMENTED, TypeSort.COMMENTED);
    }
  };

  /** @param {HTMLElement} container контейнер для отрисовки контейнера фильмов */
  #rednerFilmsContainer = (container) => render(this.#filmsComponent, container);

  /** Отрисовывает главный список фильмов. Сначало с информацией
  загрузке, а потом перерисовывает со стандартным заголовком списка. */
  #renderMainList = (isResetCounterFilms) => {
    const films = this.#sortModel
      .sort(this.#filtersModel
        .filter(this.#filmsModel.items));

    const title = films.length
      ? ListTitle[this.#filtersModel.activeItem]
      : NoFilmsListTitle[this.#filtersModel.activeItem];

    this.#ListPresenter.ALL.init(films, title, isResetCounterFilms);
  };

  #renderExtraList = (listPresenter, typeSort) => {
    const title = ListTitle[typeSort];
    const films = this.#sortModel
      .sort(this.#filmsModel.items, typeSort)
      .slice(0, 2);

    listPresenter.init(films, title);
  };

  /** Отрисовывает попап фильма
   * @param {Object} film фильм для отрисовки попапа
   */
  #renderPopup = (film) => {
    const comments = this.#commentsModel.getItems(film.comments);
    this.#popupFilm = film;
    this.#popupPresenter.init(film, comments);
  };

  /** Удаляет попап фильма */
  #removePopup = () => {
    this.#popupFilm = null;
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

    if (this.#popupFilm.id === newFilm.id) {
      this.#renderPopup(newFilm);
    }
  };

  #addComment = (newComment) => {
    const newFilm = structuredClone(this.#popupFilm);
    const newCommentId = nanoid();
    const comment = {
      id: newCommentId,
      author: 'Cooper',
      date: new Date(),
      ...newComment
    };

    newFilm.comments.push(newCommentId);
    this.#commentsModel.addItem(TypeUpdate.PATCH, comment);
    this.#filmsModel.updateItem(TypeUpdate.PATCH, newFilm);
  };

  #deleteComment = (deletedComment) => {
    const newFilm = structuredClone(this.#popupFilm);
    const comments = Array.from(this.#popupFilm.comments);
    const commentIndexInFilmObject = comments
      .findIndex((comment) => comment === deletedComment.id);

    comments.splice(commentIndexInFilmObject, 1);
    newFilm.comments = comments;
    this.#popupFilm = newFilm;

    this.#commentsModel.removeItem(TypeUpdate.PATCH, deletedComment);
    this.#filmsModel.updateItem(TypeUpdate.PATCH, newFilm);
  };
}
