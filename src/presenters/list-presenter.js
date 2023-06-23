import {render, replace} from './../framework/render.js';
import CardPresenter from './card-presenter.js';
import FilmsContainerView from './../views/films-container-view.js';
import ListFilmsView from './../views/list-films-view.js';
import ListFilmsTitleView from './../views/list-films-title-view.js';

const IS_TITLE_HIDDEN = false;

/**
 * Дочерний презентер {@link FilmsPresenter}, управляющий
 * списком фильмов и презентерами карточек фильмов ({@link CardPresenter})
 * @param {HTMLElement} container контейнер для отрисовки для списка
 * @param {Function} viewActionHandler функция обновления данных фильма
 * @param {Function} openPopupHandler функция отрисовки попапа
 */
export default class ListPresenter {
  /** @type {HTMLElement|null} контейнер для списков фильмов */
  _containerElement = null;

  /** @type {Map<number, Object>} карта презентеров карточек */
  _cardPresenter = new Map();

  /** @type {Object|null} представление списка фильмов */
  _listComponent = null;

  /** @type {Object|null} представление заголовка списка */
  #listTitleComponent = null;

  /** @type {Object|null} представление контейнера для фильмов */
  #filmsContainerComponent = null;

  /** @type {Array|null} ссылка на массив с фильмами */
  _films = null;

  /** @type {string|null} заголовок списка */
  _title = null;

  /** @type {string|null} тип списка */
  _type = null;

  /** @type {Function|null} Функция обновления данных фильма */
  #viewActionHandler = null;

  /** @type {Function|null} Функция отрисовки попапа */
  #openPopupHandler = null;

  constructor(container, typeList, viewActionHandler, openPopupHandler) {
    this._containerElement = container;
    this._type = typeList;
    this.#viewActionHandler = viewActionHandler;
    this.#openPopupHandler = openPopupHandler;
  }

  /** Инициализирует новый список
   * @param {string} nameList имя списка
   * @param {Function} getFilms функция возвращающая список фильмов
   */
  init = (films, titleText) => {
    this._films = films;
    this._title = titleText;
    this._reset();
    this._render(films, titleText);
  };

  /** Обновляет фильм в списке
   * @param {Object} newFilm обновленный фильм
   */
  updateFilm = (newFilm) => {
    const cardPresenter = this._cardPresenter.get(newFilm.id);

    if (cardPresenter) {
      cardPresenter.init(this.#filmsContainerComponent.element, newFilm);
    }
  };

  _reset = () => {
    this._cardPresenter.clear();
  };

  _render = (films, titleText) => {
    this._renderList();
    this._renderTitle(titleText, IS_TITLE_HIDDEN);

    if (films.length) {
      this._renderFilmsContainer();
      this._renderCards(films);
    }
  };

  /** Отрисовывает список для фильмов */
  _renderList = () => {
    const prevListComponent = this._listComponent;
    this._listComponent = new ListFilmsView(this._type);

    if (!prevListComponent) {
      render(this._listComponent, this._containerElement);
    } else {
      replace(this._listComponent, prevListComponent);
    }
  };

  /** Отрисовывает заголовок в списке
   * @param {string} title текст заголовка
   * @param {Boolean} isTitleHidden нужно ли скрыть заголовок
   */
  _renderTitle = (title, isTitleHidden) => {
    this.#listTitleComponent = new ListFilmsTitleView(title, isTitleHidden);
    render(this.#listTitleComponent, this._listComponent.element);
  };

  /** Отрисовывает контейнер для фильмов в списке */
  _renderFilmsContainer = () => {
    this.#filmsContainerComponent = new FilmsContainerView();
    render(this.#filmsContainerComponent, this._listComponent.element);
  };

  /** Отрисовыает карточку с списке фильмов
   * @param {Object} film данные фильма
   */
  #renderCard = (film) => {
    const cardPresenter = new CardPresenter(
      this.#viewActionHandler,
      this.#openPopupHandler
    );

    this._cardPresenter.set(film.id, cardPresenter);
    cardPresenter.init(this.#filmsContainerComponent.element, film);
  };

  /** Отрисовывает карточки фильмов
   * @param {Array} films массив фильмов
   */
  _renderCards = (films) => {
    films.forEach((film) => {
      this.#renderCard(film);
    });
  };
}
