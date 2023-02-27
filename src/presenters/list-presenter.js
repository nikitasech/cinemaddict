import {render, RenderPosition, replace} from './../framework/render.js';
import CardPresenter from './card-presenter.js';
import ButtonMoreView from './../views/load-more-button-view.js';
import FilmsContainerView from './../views/films-container-view.js';
import ListFilmsView from './../views/list-films-view.js';
import ListFilmsTitleView from './../views/list-films-title-view.js';
import {TypeList} from '../const.js';
import SortView from '../views/sort-view.js';

/**
 * Дочерний презентер {@link FilmsPresenter}, управляющий
 * списком фильмов и карточками фильмов ({@link CardPresenter})
 * @param {Object} films список фильмов
 * @param {number} portionCardsCount количество карточек, отображающихся за один раз
 * @param {Function} функция обновления данных фильма
 * @param {Function} функция отрисовки попапа
 * @param {Object|null} sortComponent представление сортировки (по умолчанию его нет)
 */
export default class ListPresenter {
  /** @type {HTMLElement|null} контейнер для списков фильмов */
  #containerElement = null;

  /** @type {Map<number, Object>} карта презентеров карточек */
  #cardPresenter = new Map();

  /** @type {Object|null} представление сортировки */
  #sortComponent = null;

  /** @type {Object|null} представление списка фильмов */
  #listComponent = null;

  /** @type {Object|null} представление заголовка списка */
  #listTitleComponent = null;

  /** @type {Object|null} представление контейнера для фильмов */
  #filmsContainerComponent = null;

  /** @type {Object|null} представление кнопки "Load More" */
  #loadMoreButtonComponent = null;


  #config = {};

  /** @type {number} количество отрисованных карточек */
  #renderedCardCount = 0;

  /** @type {number} количество имеющийся фильмов */
  #filmsLength = 0;

  /** @type {Function|null} функция возвращающая список фильмов */
  #getFilms = null;

  /** @type {Function|null} Функция обновления данных фильма */
  #viewActionHandler = null;

  /** @type {Function|null} Функция отрисовки попапа */
  #openPopupHandler = null;

  constructor(listConfig, getFilms, viewActionHandler, openPopupHandler) {
    this.#config = listConfig;
    this.#getFilms = getFilms;
    this.#viewActionHandler = viewActionHandler;
    this.#openPopupHandler = openPopupHandler;
  }

  /** Инициализирует новый список без фильмов, с указанным заголовком
   * @param {HTMLElement} container контейнер для отрисовки списка
   * @param {string} type тип списка
   * @param {string} title текст заголовка списка
   * @param {Boolean} isTitleHidden нужно ли скрыть заголовок
   */
  init = (container, title, isTitleHidden) => {
    const films = this.#getFilms(this.#config.SORT);

    this.#containerElement = container;
    this.#filmsLength = films.length;

    this.#renderList(this.#config.TYPE);
    this.#renderTitle(title, isTitleHidden);

    if (films) {
      this.renderFilmsContainer();
      this.#renderPortionCards();
    }

    if (this.#config.TYPE === TypeList.MAIN && films) {
      this.#renderSort();
    }
  };

  /** Обновляет фильмы в списке
   * @param {Object} newFilm обновленный объект фильма
   */
  updateFilm = (newFilm) => {
    const cardPresenter = this.#cardPresenter.get(newFilm.id);

    if (cardPresenter) {
      cardPresenter.init(this.#filmsContainerComponent.element, newFilm);
    }
  };

  /** Отрисовывает сортировку */
  #renderSort = (typeSort = this.#config.SORT) => {
    const prevSortComponent = this.#sortComponent;
    this.#sortComponent = new SortView(typeSort);

    if (!prevSortComponent) {
      render(this.#sortComponent, this.#containerElement, RenderPosition.BEFOREBEGIN);
    } else {
      replace(this.#sortComponent, prevSortComponent);
    }

    this.#sortComponent.setClickHandler(this.#sortFilms);
  };

  /** Отрисовывает список для фильмов
   * @param {string} typeList тип списка
   */
  #renderList = (typeList) => {
    const prevListComponent = this.#listComponent;
    this.#listComponent = new ListFilmsView(typeList);

    if (prevListComponent) {
      replace(this.#listComponent, prevListComponent);
    } else {
      render(this.#listComponent, this.#containerElement);
    }
  };

  /** Отрисовывает заголовок в списке
   * @param {string} title текст заголовка
   * @param {Boolean} isTitleHidden нужно ли скрыть заголовок
   */
  #renderTitle = (title, isTitleHidden) => {
    this.#listTitleComponent = new ListFilmsTitleView(title, isTitleHidden);
    render(this.#listTitleComponent, this.#listComponent.element);
  };

  /** Отрисовывает контейнер для фильмов в списке */
  renderFilmsContainer = () => {
    const prevFilmsContainerComponent = this.#filmsContainerComponent;
    this.#filmsContainerComponent = new FilmsContainerView();

    if (!prevFilmsContainerComponent) {
      render(this.#filmsContainerComponent, this.#listComponent.element);
    } else {
      replace(this.#filmsContainerComponent, prevFilmsContainerComponent);
    }
  };

  /** Отрисовыает карточку с списке фильмов
   * @param {Object} film данные фильма
   */
  #rednerCard = (film) => {
    const cardPresenter = new CardPresenter(
      this.#viewActionHandler,
      this.#openPopupHandler
    );

    this.#cardPresenter.set(film.id, cardPresenter);
    cardPresenter.init(this.#filmsContainerComponent.element, film);
  };

  /**
   * Отрисовывает несколько карточек от и до отпределенного номера
   * @param {} films
   */
  #renderCards = (films) => {
    films.forEach((film) => {
      this.#rednerCard(film);
    });
  };

  /** Отрисовывает новую порцию карточек и кнопку,
  если есть ещё карточки которые нужно отрисовать */
  #renderPortionCards = () => {
    const films = this.#getFilms(this.#config.SORT);
    const first = this.#renderedCardCount;
    const last = Math.min(first + this.#config.PORTION_CARDS, this.#filmsLength);
    this.#renderedCardCount = last;

    this.#renderCards(films.slice(first, last));

    if (this.#config.TYPE === TypeList.MAIN) {
      this.#renderLoadMoreButton();
    }
  };

  /** Добавляет рабочую кнопку Load more в список всех фильмов */
  #renderLoadMoreButton = () => {
    if (this.#loadMoreButtonComponent && this.#renderedCardCount >= this.#filmsLength) {
      this.#loadMoreButtonComponent.element.remove();
      this.#loadMoreButtonComponent = null;
    } else if (!this.#loadMoreButtonComponent && this.#renderedCardCount !== this.#filmsLength) {
      this.#loadMoreButtonComponent = new ButtonMoreView();
      render(this.#loadMoreButtonComponent, this.#listComponent.element);
      this.#loadMoreButtonComponent.setClickHandler(this.#renderPortionCards);
    }
  };

  #sortFilms = (typeSort) => {
    const films = this.#getFilms(typeSort).slice(0, this.#config.PORTION_CARDS);

    this.#cardPresenter.clear();
    this.renderFilmsContainer();
    this.#renderSort(typeSort);
    this.#renderCards(films);
  };
}
