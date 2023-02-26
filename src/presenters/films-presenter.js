import {render} from './../framework/render.js';
import {ListTitle, TypeList, TypeSort, NameList} from './../const.js';
import {sortByDate, sortByComments, sortByRating} from './../utils/sort.js';
import FilmsView from './../views/films-view.js';
import PopupPresenter from './popup-presenter.js';
import ListPresenter from './list-presenter.js';
import {ListConfig} from '../configs.js';

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

  /** @type {null|number} id отрисованного в попапе фильма */
  #popupFilmId = null;

  constructor(filmsModel, commentsModel) {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;

    this.#popupPresenter = new PopupPresenter(
      this.#getComments,
      this.#filmChangeHandler,
      this.#removePopup
    );

    this.#ListPresenter = {
      ALL: new ListPresenter(
        ListConfig[NameList.MAIN],
        this.#getFilms,
        this.#filmChangeHandler,
        this.#renderPopup
      ),

      TOP: new ListPresenter(
        ListConfig[NameList.TOP],
        this.#getFilms,
        this.#filmChangeHandler,
        this.#renderPopup
      ),

      COMMENTED: new ListPresenter(
        ListConfig[NameList.COMMENTED],
        this.#getFilms,
        this.#filmChangeHandler,
        this.#renderPopup
      )
    };
  }

  #getFilms = (typeSort, countFilms) => {
    switch (typeSort) {
      case TypeSort.DATE:
        return sortByDate(this.#filmsModel.items, countFilms);
      case TypeSort.RATING:
        return sortByRating(this.#filmsModel.items, countFilms);
      case TypeList.COMMENTED:
        return sortByComments(this.#filmsModel.items, countFilms);
      default:
        return this.#filmsModel.items.slice();
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
    let isTitleHidden = false;

    if (!this.#filmsModel.items.length) {
      this.#ListPresenter.ALL.init(
        this.#filmsComponent.element,
        ListTitle.LOADING,
        isTitleHidden
      );
      return;
    }

    isTitleHidden = true;

    this.#ListPresenter.ALL.init(
      this.#filmsComponent.element,
      ListTitle.ALL,
      isTitleHidden
    );
  };

  /** Отрисовывает список "Top rated" */
  #renderTopList = () => {
    const isTitleHidden = false;

    this.#ListPresenter.TOP.init(
      this.#filmsComponent.element,
      ListTitle.TOP,
      isTitleHidden
    );
  };

  /** Отрисовывает список "Most commented" */
  #renderCommentedList = () => {
    const isTitleHidden = false;

    this.#ListPresenter.COMMENTED.init(
      this.#filmsComponent.element,
      ListTitle.COMMENTED,
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
    this.#filmsModel.updateItem(newFilm);

    this.#ListPresenter.ALL.updateFilm(newFilm);
    this.#ListPresenter.TOP.updateFilm(newFilm);
    this.#ListPresenter.COMMENTED.updateFilm(newFilm);

    if (this.#popupFilmId === newFilm.id) {
      this.#renderPopup(newFilm);
    }
  };
}
