import {render} from './../framework/render.js';
import {ListTitle, TypeList, PortionCardCount} from './../const.js';
import {sortByComments, sortByRating} from './../utils/sort.js';
import SortView from './../views/sort-view.js';
import FilmsView from './../views/films-view.js';
import PopupPresenter from './popup-presenter.js';
import ListPresenter from './list-presenter.js';
import {updateItem} from './../utils/common.js';

/**
 * Главный презентер. Управляет всеми списками фильмов
 * ({@link ListPresenter}) и попапом ({@link PopupPresenter})
 * @param {Object} filmsModel модель фильмов
 * @param {Object} commentsModel модель комментариев
*/
export default class FilmsPresenter {
  /** @type {Object|null} модель фильмов */
  #filmsModel = null;

  /** @type {Object|null} модель комментариев */
  #commentsModel = null;

  /** @type {Object|null} презентер попапа */
  #popupPresenter = null;

  /** Перечисление презентеров списков @enum {Object} */
  #ListPresenter = {};

  /** @type {Object|null} представление корневого контейнера для фильмов */
  #filmsComponent = new FilmsView();

  /** @type {Object|null} представление сортировки */
  #sortComponent = new SortView();

  /** @type {Object} список фильмов */
  #films = {};

  /** @type {null|number} id отрисованного в попапе фильма */
  #popupFilmId = null;

  constructor(filmsModel, commentsModel) {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#films = [...this.#filmsModel.items];

    this.#popupPresenter = new PopupPresenter(
      this.#commentsModel,
      this.#filmChangeHandler,
      this.#removePopup
    );

    this.#ListPresenter = {
      ALL: new ListPresenter(
        this.#films.slice(),
        PortionCardCount.MAIN,
        this.#filmChangeHandler,
        this.#renderPopup
      ),

      TOP: new ListPresenter(
        sortByRating(this.#films, PortionCardCount.EXTRA),
        PortionCardCount.EXTRA,
        this.#filmChangeHandler,
        this.#renderPopup
      ),

      COMMENTED: new ListPresenter(
        sortByComments(this.#films, PortionCardCount.EXTRA),
        PortionCardCount.EXTRA,
        this.#filmChangeHandler,
        this.#renderPopup
      )
    };
  }

  /** Отрисовывает начальное состояние приложения
   * @param {HTMLElement} filmsContainer контейнер для отрисовки состояния
   */
  init = (rootContainer) => {
    this.#rednerFilmsContainer(rootContainer);
    this.#renderMainList();

    if (this.#films.length) {
      this.#renderTopList();
      this.#renderCommentedList();
    }
  };

  /** @param {HTMLElement} container контейнер для отрисовки контейнера фильмов */
  #rednerFilmsContainer = (container) => render(this.#filmsComponent, container);

  /** Отрисовывает главный список фильмов. Сначало с информацией
  загрузке, а потом перерисовывает со стандартным заголовком списка. */
  #renderMainList = () => {
    let isTitleHidden = false;

    if (!this.#films.length) {
      this.#ListPresenter.ALL.init(
        this.#filmsComponent.element,
        ListTitle.LOADING,
        TypeList.MAIN,
        isTitleHidden
      );
      return;
    }

    isTitleHidden = true;

    this.#ListPresenter.ALL.init(
      this.#filmsComponent.element,
      ListTitle.ALL,
      TypeList.MAIN,
      isTitleHidden
    );
  };

  /** Отрисовывает список "Top rated" */
  #renderTopList = () => {
    const isTitleHidden = false;

    this.#ListPresenter.TOP.init(
      this.#filmsComponent.element,
      ListTitle.TOP,
      TypeList.EXTRA,
      isTitleHidden
    );
  };

  /** Отрисовывает список "Most commented" */
  #renderCommentedList = () => {
    const isTitleHidden = false;

    this.#ListPresenter.COMMENTED.init(
      this.#filmsComponent.element,
      ListTitle.COMMENTED,
      TypeList.EXTRA,
      isTitleHidden
    );
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
  #filmChangeHandler = (newFilm) => {
    this.#films = updateItem(this.#films, newFilm);

    this.#ListPresenter.ALL.updateFilm(newFilm);
    this.#ListPresenter.TOP.updateFilm(newFilm);
    this.#ListPresenter.COMMENTED.updateFilm(newFilm);

    if (this.#popupFilmId === newFilm.id) {
      this.#renderPopup(newFilm);
    }
  };
}
