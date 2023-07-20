import { render } from './../framework/render.js';
import { TypeAction, TypeUpdate, TypeFilter, TypeList,
  ListTitle, NoFilmsListTitle, TypeSort } from './../const.js';
import FilmsView from './../views/films-view.js';
import PopupPresenter from './popup-presenter.js';
import ListPresenter from './list-presenter.js';
import MainListPresenter from './main-list-presenter.js';
import { nanoid } from 'nanoid';
import { filter } from '../utils/filter.js';
import SortPresenter from './sort-presenter.js';

/**
 * Главный презентер. Управляет всеми списками фильмов ({@link MainListPresenter}
 * и {@link ListPresenter}) и попапом ({@link PopupPresenter})
 * @param {Object} filmsModel {@link FilmsModel}
 * @param {Object} filtersModel {@link FiltersModel}
 * @param {Object} sortModel {@link SortModel}
 * @param {Object} commentsModel {@link CommentsModel}
*/
export default class FilmsPresenter {
  #filmsModel = null;
  #filtersModel = null;
  #sortModel = null;
  #commentsModel = null;
  #sortPresenter = null;
  #popupPresenter = null;
  #ListPresenter = {};
  #filmsComponent = new FilmsView();
  #popupFilm = null;

  constructor(filmsModel, filtersModel, sortModel, commentsModel) {
    const filmsElement = this.#filmsComponent.element;
    const changeDate = this.#viewActionHandler;
    const renderPopup = this.#renderPopup;

    this.#filmsModel = filmsModel;
    this.#filtersModel = filtersModel;
    this.#sortModel = sortModel;
    this.#commentsModel = commentsModel;

    this.#popupPresenter = new PopupPresenter(changeDate, this.#removePopup);
    this.#sortPresenter = new SortPresenter(filmsModel, sortModel);

    this.#ListPresenter = {
      ALL: new MainListPresenter(filmsElement, TypeList.MAIN, changeDate, renderPopup),
      TOP: new ListPresenter(filmsElement, TypeList.EXTRA, changeDate, renderPopup),
      COMMENTED: new ListPresenter(filmsElement, TypeList.EXTRA, changeDate, renderPopup)
    };

    this.#filmsModel.addObserver(this.#filmsModelEventHandler);
    this.#filtersModel.addObserver(this.#filtersModelEventHandler);
    this.#sortModel.addObserver(this.#sortModelEventHandler);
  }

  /** Отрисовывает начальное состояние приложения
   * @param {HTMLElement} rootContainer контейнер для отрисовки
   */
  init = (rootContainer) => {
    this.#rednerFilmsContainer(rootContainer);
    this.#renderMainList();
    this.#ListPresenter.ALL.init(NoFilmsListTitle.loading);
  };

  #viewActionHandler = (typeAction, typeUpdate, payload) => {
    const addComment = (newComment) => {
      const newFilm = structuredClone(this.#popupFilm);
      const newCommentId = nanoid();
      const comment = {
        id: newCommentId,
        author: 'Cooper',
        date: new Date(),
        ...newComment
      };

      newFilm.comments.push(newCommentId);
      this.#commentsModel.addItem(typeUpdate, comment);
      this.#filmsModel.updateItem(typeUpdate, newFilm);
    };

    const deleteComment = (deletedComment) => {
      const newFilm = structuredClone(this.#popupFilm);
      const comments = Array.from(this.#popupFilm.comments);
      const commentIndexInFilmObject = comments
        .findIndex((comment) => comment === deletedComment.id);

      comments.splice(commentIndexInFilmObject, 1);
      newFilm.comments = comments;
      this.#popupFilm = newFilm;

      this.#commentsModel.removeItem(typeUpdate, deletedComment);
      this.#filmsModel.updateItem(typeUpdate, newFilm);
    };

    switch(typeAction) {
      case TypeAction.UPDATE_FILM:
        this.#filmsModel.updateItem(typeUpdate, payload);
        break;
      case TypeAction.REMOVE_COMMENT:
        deleteComment(payload);
        break;
      case TypeAction.ADD_COMMENT:
        addComment(payload);
        break;
    }
  };

  #filmsModelEventHandler = (typeUpdate, payload) => {
    switch (typeUpdate) {
      case TypeUpdate.INIT:
        this.#renderMainList(true); // #TODO заменить на конст
        this.#renderExtraList(this.#ListPresenter.TOP, TypeSort.RATING);
        this.#renderExtraList(this.#ListPresenter.COMMENTED, TypeSort.COMMENTED);
        break;
      case TypeUpdate.PATCH:
        this.#updateFilm(payload);

        if (this.#filtersModel.activeItem !== TypeFilter.ALL) {
          this.#renderMainList(false);
        }
    }
  };

  #filtersModelEventHandler = (typeUpdate) => {
    switch(typeUpdate) {
      case TypeUpdate.MINOR:
        this.#sortModel.resetActiveItem();
        this.#renderMainList(true); // #TODO заменить на конст
    }
  };

  #sortModelEventHandler = (typeUpdate) => {
    switch(typeUpdate) {
      case TypeUpdate.MINOR:
        this.#renderMainList(true); // #TODO заменить на конст
    }
  };

  #rednerFilmsContainer = (container) => render(this.#filmsComponent, container);

  #renderMainList = (isResetCounterFilms) => {
    const films = this.#sortModel
      .sort(filter(this.#filmsModel.items, this.#filtersModel.activeItem));

    const title = films.length
      ? ListTitle[this.#filtersModel.activeItem]
      : NoFilmsListTitle[this.#filtersModel.activeItem];

    this.#ListPresenter.ALL.init(title, films, isResetCounterFilms);

    if (films.length) {
      this.#sortPresenter.init(this.#filmsComponent.element);
      return;
    }

    this.#sortPresenter.remove();
  };

  #renderExtraList = (listPresenter, typeSort) => {
    const title = ListTitle[typeSort];
    const films = this.#sortModel
      .sort(this.#filmsModel.items, typeSort)
      .slice(0, 2);

    if (films.length) {
      listPresenter.init(title, films);
    }
  };

  #renderPopup = (film) => {
    const comments = this.#commentsModel.getItems(film.comments);
    this.#popupFilm = film;
    this.#popupPresenter.init(film, comments);
  };

  #removePopup = () => {
    this.#popupFilm = null;
    this.#popupPresenter.destroy();
  };

  #updateFilm = (newFilm) => {
    this.#ListPresenter.ALL.updateFilm(newFilm);
    this.#ListPresenter.TOP.updateFilm(newFilm);
    this.#ListPresenter.COMMENTED.updateFilm(newFilm);

    if (this.#popupFilm && this.#popupFilm.id === newFilm.id) {
      this.#renderPopup(newFilm);
    }
  };
}
