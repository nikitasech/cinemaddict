import {render, RenderPosition, replace} from './../framework/render.js';
import CardPresenter from './card-presenter.js';
import ButtonMoreView from './../views/load-more-button-view.js';
import FilmsContainerView from './../views/films-container-view.js';
import ListFilmsView from './../views/list-films-view.js';
import ListFilmsTitleView from './../views/list-films-title-view.js';
import {updateItem} from './../utils/common.js';
import {sortByDate, sortByRating} from '../utils/sort.js';
import {TypeList, TypeSort} from '../const.js';
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

  /** @type {Object|null} список фильмов */
  #films = null;

  /** @type {Object|null} список отсортированных фильмов */
  #sortedFilms = null;

  /** @type {number} количество отрисованных карточек */
  #renderedCardCount = 0;

  /** @type {Object|null} количество карточек за одну порцию */
  #portionCardCount = null;

  /** @type {Function|null} Функция обновления данных фильма */
  #filmChangeHandler = null;

  /** @type {Function|null} Функция отрисовки попапа */
  #openPopupHandler = null;

  constructor(films, portionCardsCount, filmChangeHandler, openPopupHandler) {
    this.#films = films;
    this.#sortedFilms = films;
    this.#portionCardCount = portionCardsCount;
    this.#filmChangeHandler = filmChangeHandler;
    this.#openPopupHandler = openPopupHandler;
  }

  /** Инициализирует новый список без фильмов, с указанным заголовком
   * @param {HTMLElement} container контейнер для отрисовки списка
   * @param {string} type тип списка
   * @param {string} title текст заголовка списка
   * @param {Boolean} isTitleHidden нужно ли скрыть заголовок
   */
  init = (container, title, typeList, isTitleHidden) => {
    this.#containerElement = container;

    this.#renderList(typeList);
    this.#renderTitle(title, isTitleHidden);

    if (this.#films) {
      this.renderFilmsContainer();
      this.#renderPortionCards();
    }

    if (typeList === TypeList.MAIN && this.#films) {
      this.#renderSort(TypeSort.DEFAULT);
    }
  };

  /** Обновляет фильмы в списке
   * @param {Object} newFilm обновленный объект фильма
   */
  updateFilm = (newFilm) => {
    this.#films = updateItem(this.#films, newFilm);
    this.#sortedFilms = updateItem(this.#sortedFilms, newFilm);

    const cardPresenter = this.#cardPresenter.get(newFilm.id);

    if (cardPresenter) {
      cardPresenter.init(this.#filmsContainerComponent.element, newFilm);
    }
  };

  /** Отрисовывает сортировку
   * @param {string} тип сортировки
   */
  #renderSort = (typeSort) => {
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
      this.#filmChangeHandler,
      this.#openPopupHandler
    );

    this.#cardPresenter.set(film.id, cardPresenter);
    cardPresenter.init(this.#filmsContainerComponent.element, film);
  };

  /**
   * Отрисовывает несколько карточек от и до отпределенного номера
   * @param {number} from от какого фильма по счету
   * @param {number} to до какого фильма
   */
  #renderCards = (from, to) => {
    this.#sortedFilms.slice(from, to).forEach((film) => {
      this.#rednerCard(film);
    });

    this.#renderedCardCount = to;
  };

  /** Отрисовывает новую порцию карточек и кнопку,
  если есть ещё карточки которые нужно отрисовать */
  #renderPortionCards = () => {
    const first = this.#renderedCardCount;
    const last = Math.min(first + this.#portionCardCount, this.#sortedFilms.length);

    this.#renderCards(first, last);
    this.#renderLoadMoreButton();
  };

  /** Добавляет рабочую кнопку Load more в список всех фильмов */
  #renderLoadMoreButton = () => {
    if (this.#loadMoreButtonComponent && this.#renderedCardCount >= this.#sortedFilms.length) {
      this.#loadMoreButtonComponent.element.remove();
      this.#loadMoreButtonComponent = null;
    } else if (!this.#loadMoreButtonComponent && this.#renderedCardCount !== this.#sortedFilms.length) {
      this.#loadMoreButtonComponent = new ButtonMoreView();
      render(this.#loadMoreButtonComponent, this.#listComponent.element);
      this.#loadMoreButtonComponent.setClickHandler(this.#renderPortionCards);
    }
  };

  /** Сортирует список фильмов в соответсвии с переданным типом
   * @param {string} typeSort тип сортировки
   */
  #sortFilms = (typeSort) => {
    switch (typeSort) {
      case TypeSort.DATE:
        this.#sortedFilms = sortByDate(this.#films, this.#films.length);
        break;
      case TypeSort.RATING:
        this.#sortedFilms = sortByRating(this.#films, this.#films.length);
        break;
      default:
        this.#sortedFilms = this.#films.slice();
        break;
    }

    this.#cardPresenter.clear();
    this.renderFilmsContainer();
    this.#renderSort(typeSort);
    this.#renderCards(0, this.#renderedCardCount);
  };
}
