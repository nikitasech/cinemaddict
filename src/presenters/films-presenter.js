import SortView from './../views/sort-view.js';
import FilmsView from './../views/films-view.js';
import ListFilmsView from './../views/list-films-view.js';
import FilmsContainerView from './../views/films-container-view.js';
import ButtonMoreView from './../views/button-more-view.js';
import {render} from './../framework/render.js';
import {ListTitle, TypeList, PORTION_CARD_COUNT} from './../const.js';
import CardPresenter from './card-presenter.js';
import PopupPresenter from './popup-presenter.js';

/**
 * Презентер списков фильмов
 * @param {Object} filmsModel модель фильмов
 * @param {Object} commentsModel модель комментариев
*/
export default class FilmsPresenter {
  #filmsElement = null;

  #filmsModel = null;
  #commentsModel = null;

  #films = {};
  #topFilms = {};
  #commentedFilms = {};

  #allListComponent = new ListFilmsView(ListTitle.LOADING);
  #topListComponent = new ListFilmsView(ListTitle.TOP, TypeList.EXTRA);
  #commentedListComponent = new ListFilmsView(ListTitle.COMMENTED, TypeList.EXTRA);
  #loadButtonComponent = new ButtonMoreView();

  #renderedCardCount = 0;

  #popupPresenter = null;

  constructor(filmsModel, commentsModel) {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#popupPresenter = new PopupPresenter(this.#commentsModel);
  }

  /**
   * Отрисовывает новую порцию карточек и кнопку,
   * если есть ещё карточки которые нужно отрисовать
  */
  #renderPortionCards = () => {
    const containerElement = this.#allListComponent.element
      .querySelector('.films-list__container');

    const first = this.#renderedCardCount;
    const last = Math.min(
      this.#renderedCardCount + PORTION_CARD_COUNT,
      this.#films.length
    );

    this.#films.slice(first, last).forEach((film) => {
      new CardPresenter(this.#popupPresenter).init(containerElement, film);
    });

    if (last === this.#films.length) {
      this.#loadButtonComponent.hide();
    }

    this.#renderedCardCount = last;
  };

  /** Добавляет рабочую кнопку Load more в список всех фильмов */
  #renderLoadMore = () => {
    const listElement = this.#allListComponent.element;

    render(this.#loadButtonComponent, listElement);
    this.#loadButtonComponent.setClickHandler(this.#renderPortionCards);
  };

  /**
   * Отрисовывает главный список фильмов
   * @param {Object} listComponent компонент списка
   */
  #renderMainList = (listComponent) => {
    render(listComponent, this.#filmsElement);

    if (!this.#films.length) {
      listComponent.changeTitle(ListTitle.NO_FILMS);
    } else {
      render(new FilmsContainerView(), listComponent.element);
      listComponent.changeTitle(ListTitle.ALL);
      listComponent.toggleHidingTitle();
      this.#renderLoadMore();
      this.#renderPortionCards();
    }
  };

  /**
   * Отрисовывает обычный список
   * @param {Object} listComponent компонент списка
   * @param {Array} films массив фильмов
   */
  #renderExtraList = (listComponent, filtredFilms) => {
    render(listComponent, this.#filmsElement);
    const containerComponent = new FilmsContainerView();
    render(containerComponent, listComponent.element);

    filtredFilms.slice(0, 2).forEach((film) => {
      new CardPresenter(this.#popupPresenter).init(containerComponent.element, film);
    });
  };

  /**
   * Отрисовывает начальное состояние приложения
   * @param {HTMLElement} filmsContainer контейнер для отрисовки состояния
   */
  init = (rootContainer) => {
    this.#films = [...this.#filmsModel.films];
    this.#topFilms = [...this.#filmsModel.topFilms];
    this.#commentedFilms = [...this.#filmsModel.commentedFilms];

    render(new SortView(), rootContainer);
    render(new FilmsView(), rootContainer);
    this.#filmsElement = rootContainer.querySelector('.films');

    this.#renderMainList(this.#allListComponent, this.#films);

    if (this.#films.length) {
      this.#renderExtraList(this.#topListComponent, this.#topFilms);
      this.#renderExtraList(this.#commentedListComponent, this.#commentedFilms);
    }
  };
}
