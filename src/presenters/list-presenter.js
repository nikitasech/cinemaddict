import {render, replace} from './../framework/render.js';
import CardPresenter from './card-presenter.js';
import ButtonMoreView from './../views/load-more-button-view.js';
import FilmsContainerView from './../views/films-container-view.js';
import ListFilmsView from './../views/list-films-view.js';
import ListFilmsTitleView from './../views/list-films-title-view.js';

/**
 * Дочерний презентер {@link FilmsPresenter}, управляющий списком фильмов
 * @param {Object} films список фильмов
 * @param {Object} popupPresenter презентер всплывающего окна
 * @param {number} portionCardsCount количество карточек, отображающееся за один раз
 */
export default class ListPresenter {
  /** @type {Map<number, Object>} карта презентеров карточек */
  #cardPresenter = new Map();

  /** @type {Object|null} презентер всплывающего окна */
  #popupPresenter = null;

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

  /** @type {number} количество отрисованных карточек */
  #renderedCardCount = 0;

  /** @type {Object|null} количество карточек за одну порцию */
  #portionCardCount = null;

  constructor(films, popupPresenter, portionCardsCount) {
    this.#films = films;
    this.#popupPresenter = popupPresenter;
    this.#portionCardCount = portionCardsCount;
  }

  /** Инициализирует новый список без фильмов, с указанным заголовком
   * @param {HTMLElement} container контейнер для отрисовки списка
   * @param {string} title текст заголовка списка
   * @param {string} type тип списка
   * @param {Boolean} isTitleHidden нужно ли скрыть заголовок
   */
  init = (container, title, type, isTitleHidden) => {
    const prevListComponent = this.#listComponent;

    if (this.#listComponent) {
      this.#listComponent = new ListFilmsView(type);
      replace(this.#listComponent, prevListComponent);
      return;
    }

    this.#listComponent = new ListFilmsView(type);
    render(this.#listComponent, container);
    this.#renderTitle(title, isTitleHidden);
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
    this.#filmsContainerComponent = new FilmsContainerView();
    render(this.#filmsContainerComponent, this.#listComponent.element);
  };

  /** Отрисовыает карточку с списке фильмов
   * @param {Object} film данные фильма
   */
  #rednerCard = (film) => {
    const cardPresenter = new CardPresenter(this.#popupPresenter);
    this.#cardPresenter.set(film.id, cardPresenter);
    cardPresenter.init(this.#filmsContainerComponent.element, film);
  };

  /** Отрисовывает новую порцию карточек и кнопку,
  если есть ещё карточки которые нужно отрисовать */
  renderPortionCards = () => {
    const first = this.#renderedCardCount;
    const last = Math.min(first + this.#portionCardCount, this.#films.length);

    this.#films.slice(first, last).forEach((film) => {
      this.#rednerCard(film);
    });

    this.#renderedCardCount = last;

    if (this.#loadMoreButtonComponent && last === this.#films.length) {
      this.#loadMoreButtonComponent.element.remove();
      this.#loadMoreButtonComponent = null;
    } else if (!this.#loadMoreButtonComponent && last !== this.#films.length) {
      this.#renderLoadMoreButton();
    }
  };

  /** Добавляет рабочую кнопку Load more в список всех фильмов */
  #renderLoadMoreButton = () => {
    this.#loadMoreButtonComponent = new ButtonMoreView();

    render(this.#loadMoreButtonComponent, this.#listComponent.element);
    this.#loadMoreButtonComponent.setClickHandler(this.renderPortionCards);
  };
}
