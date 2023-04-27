import {render, RenderPosition, replace} from './../framework/render.js';
import CardPresenter from './card-presenter.js';
import ButtonMoreView from './../views/load-more-button-view.js';
import FilmsContainerView from './../views/films-container-view.js';
import ListFilmsView from './../views/list-films-view.js';
import ListFilmsTitleView from './../views/list-films-title-view.js';
import {ListTitle, NameList, NoFilmsListTitle, TypeList, typeListMap, TypeSort} from '../const.js';
import SortView from '../views/sort-view.js';

/**
 * Дочерний презентер {@link FilmsPresenter}, управляющий
 * списком фильмов и презентерами карточек фильмов ({@link CardPresenter})
 * @param {HTMLElement} container контейнер для отрисовки для списка
 * @param {Function} viewActionHandler функция обновления данных фильма
 * @param {Function} openPopupHandler функция отрисовки попапа
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

  /** @type {string} тип списка */
  #type = TypeList.MAIN;

  /** @type {string} тип сортировки */
  #typeSort = TypeSort.DEFAULT;

  /** @type {number} количество карточек за одну отрисовку */
  #portionCards = 5;

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

  constructor(container, viewActionHandler, openPopupHandler) {
    this.#containerElement = container;
    this.#viewActionHandler = viewActionHandler;
    this.#openPopupHandler = openPopupHandler;
  }

  /** Инициализирует новый список
   * @param {string} nameList имя списка
   * @param {Function} getFilms функция возвращающая список фильмов
   */
  init = (nameList, getFilms) => {
    const isMainList = typeListMap[nameList] === NameList.MAIN;

    this.#type = typeListMap[nameList];
    this.#getFilms = getFilms;
    this.#loadMoreButtonComponent = null;
    this.#renderedCardCount = 0;
    this.#portionCards = (this.#type === NameList.MAIN) ? 5 : 2;

    if (nameList === NameList.RATING || nameList === NameList.COMMENTED) {
      this.#typeSort = nameList;
    }

    const films = this.#getFilms(this.#typeSort);
    this.#filmsLength = films.length;

    this.#cardPresenter.clear();
    this.#renderList(this.#type);

    if (isMainList) {
      this.#renderSort();
    }

    if (films.length) {
      this.#renderTitle(ListTitle[nameList], isMainList);
      this.#renderFilmsContainer();
      this.#renderPortionCards(films);
    } else if (isMainList) {
      this.#renderTitle(NoFilmsListTitle[nameList], isMainList);
    }
  };

  /** Обновляет фильм в списке
   * @param {Object} newFilm обновленный фильм
   */
  updateFilm = (newFilm) => {
    const cardPresenter = this.#cardPresenter.get(newFilm.id);

    if (cardPresenter) {
      cardPresenter.init(this.#filmsContainerComponent.element, newFilm);
    }
  };

  /** Отрисовывает сортировку */
  #renderSort = () => {
    const prevSortComponent = this.#sortComponent;
    this.#sortComponent = new SortView(this.#typeSort);

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

    if (!prevListComponent) {
      render(this.#listComponent, this.#containerElement);
    } else {
      replace(this.#listComponent, prevListComponent);
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
  #renderFilmsContainer = () => {
    this.#filmsContainerComponent = new FilmsContainerView();
    render(this.#filmsContainerComponent, this.#listComponent.element);
  };

  /** Отрисовыает карточку с списке фильмов
   * @param {Object} film данные фильма
   */
  #renderCard = (film) => {
    const cardPresenter = new CardPresenter(
      this.#viewActionHandler,
      this.#openPopupHandler
    );

    this.#cardPresenter.set(film.id, cardPresenter);
    cardPresenter.init(this.#filmsContainerComponent.element, film);
  };

  #removeCard = (filmId) => {
    this.cardPresenter.get(filmId).remove();
    this.cardPresenter.delete(filmId);
  };

  /** Отрисовывает карточки фильмов
   * @param {Array} films массив фильмов
   */
  #renderCards = (films) => {
    films.forEach((film) => {
      this.#renderCard(film);
    });
  };

  /** Очищает список карточек */
  #removeCards = () => {
    for (const cardPresenter of this.#cardPresenter.values()) {
      cardPresenter.remove();
    }

    this.#cardPresenter.clear();
  };

  /** Отрисовывает новую порцию карточек и кнопку,
  если есть ещё карточки которые нужно отрисовать */
  #renderPortionCards = () => {
    const films = this.#getFilms(this.#typeSort);
    const first = this.#renderedCardCount;
    const last = Math.min(first + this.#portionCards, this.#filmsLength);
    this.#renderedCardCount = last;

    this.#renderCards(films.slice(first, last));

    if (this.#type === TypeList.MAIN) {
      this.#renderLoadMoreButton();
    }
  };

  /** Добавляет рабочую кнопку Load more в список всех фильмов */
  #renderLoadMoreButton = () => {
    const component = this.#loadMoreButtonComponent;

    if (component && this.#renderedCardCount >= this.#filmsLength) {
      component.element.remove();
      this.#loadMoreButtonComponent = null;
    } else if (!component && this.#renderedCardCount !== this.#filmsLength) {
      this.#loadMoreButtonComponent = new ButtonMoreView();
      render(this.#loadMoreButtonComponent, this.#listComponent.element);
      this.#loadMoreButtonComponent.setClickHandler(this.#renderPortionCards);
    }
  };

  #sortFilms = (typeSort) => {
    this.#typeSort = typeSort;
    this.#renderedCardCount = 0;

    this.#removeCards();
    this.#renderSort();
    this.#renderPortionCards();
  };
}
