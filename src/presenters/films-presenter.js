import { render } from './../framework/render.js';
import { TypeAction, TypeUpdate, TypeFilter, TypeList,
  ListTitle, NoFilmsListTitle, TypeSort } from './../const.js';
import FilmsView from './../views/films-view.js';
import PopupPresenter from './popup-presenter.js';
import ListPresenter from './list-presenter.js';
import MainListPresenter from './main-list-presenter.js';
import { filter } from '../utils/filter.js';
import SortPresenter from './sort-presenter.js';
import UiBlocker from './../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER: 100,
  UPPER: 500
};

/**
 * Главный презентер. Управляет всеми списками фильмов ({@link MainListPresenter}
 * и {@link ListPresenter}) и попапом ({@link PopupPresenter})
 * @param {Object} filmsModel {@link FilmsModel}
 * @param {Object} filtersModel {@link FiltersModel}
 * @param {Object} sortModel {@link SortModel}
 * @param {Object} commentsModel {@link CommentsModel}
*/
export default class FilmsPresenter {
  #filmsModel;
  #filtersModel;
  #sortModel;
  #commentsModel;
  #sortPresenter;
  #popupPresenter;
  #ListPresenter = {};
  #filmsComponent = new FilmsView();
  #uiBlocker = new UiBlocker(TimeLimit.LOWER, TimeLimit.UPPER);
  #popupFilm;

  constructor(filmsModel, filtersModel, sortModel, commentsModel) {
    const filmsElement = this.#filmsComponent.element;
    const changeDate = this.#viewActionHandler;
    const renderPopup = this.#renderPopup;
    const removePopup = this.#removePopup;

    this.#filmsModel = filmsModel;
    this.#filtersModel = filtersModel;
    this.#sortModel = sortModel;
    this.#commentsModel = commentsModel;

    this.#popupPresenter = new PopupPresenter(changeDate, removePopup, commentsModel);
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

  #viewActionHandler = async (typeAction, typeUpdate, payload) => {
    this.#uiBlocker.block();

    const accessHandler = async (access) => {
      try {
        await access(typeUpdate, payload, this.#popupFilm);
      } catch (err) {
        this.#setAborting(typeAction, payload.id);
      }
    };

    switch(typeAction) {
      case TypeAction.UPDATE_FILM:
        accessHandler(this.#filmsModel.updateItemOnServer);
        break;
      case TypeAction.REMOVE_COMMENT:
        accessHandler(this.#commentsModel.removeItem);
        break;
      case TypeAction.ADD_COMMENT:
        accessHandler(this.#commentsModel.addItem);
        break;
    }

    this.#uiBlocker.unblock();
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

  #setAborting = (typeAction, elementId) => {
    switch (typeAction) {
      case TypeAction.ADD_COMMENT:
      case TypeAction.REMOVE_COMMENT:
        this.#popupPresenter.setAborting(typeAction, elementId);
        break;
      case TypeAction.UPDATE_FILM:
        if (this.#popupFilm) {
          this.#popupPresenter.setAborting(typeAction);
          break;
        }

        for (const list of Object.values(this.#ListPresenter)) {
          list.setAborting(typeAction, elementId);
        }
        break;
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
    this.#popupFilm = film;
    this.#popupPresenter.init(film);
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
