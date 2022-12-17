import {render} from './../framework/render.js';
import {ListTitle, TypeList, PORTION_CARDS_COUNT} from './../const.js';

import SortView from './../views/sort-view.js';
import FilmsView from './../views/films-view.js';
import ListFilmsView from './../views/list-films-view.js';
import ButtonMoreView from './../views/button-more-view.js';

import CardPresenter from './film-presenter.js';
import PopupPresenter from './popup-presenter.js';

/** Презентер списков фильмов
 * @param {Object} filmsModel модель фильмов
 * @param {Object} commentsModel модель комментариев
*/
export default class FilmsPresenter {
  #filmsModel = null;

  #popupPresenter = null;

  #filmsComponent = new FilmsView();
  #sortComponent = new SortView();
  #allListComponent = new ListFilmsView(ListTitle.LOADING);
  #topListComponent = new ListFilmsView(ListTitle.TOP, TypeList.EXTRA);
  #commentedListComponent = new ListFilmsView(ListTitle.COMMENTED, TypeList.EXTRA);
  #loadButtonComponent = new ButtonMoreView();

  #films = {};
  #topFilms = {};
  #commentedFilms = {};

  #renderedCardCount = 0;

  constructor(filmsModel, commentsModel) {
    this.#filmsModel = filmsModel;
    this.#popupPresenter = new PopupPresenter(commentsModel);
  }

  /** @param {HTMLElement} container контейнер для отрисовки сортировки */
  #renderSort = (container) => render(this.#sortComponent, container);

  /** @param {HTMLElement} container контейнер для отрисовки контейнера фильмов */
  #rednerFilmsContainer = (container) => render(this.#filmsComponent, container);

  /** Отрисовывает новую порцию карточек и кнопку,
  если есть ещё карточки которые нужно отрисовать */
  #renderPortionCards = () => {
    const first = this.#renderedCardCount;
    const last = Math.min(first + PORTION_CARDS_COUNT, this.#films.length);

    this.#films.slice(first, last).forEach((film) => {
      new CardPresenter(this.#popupPresenter)
        .init(this.#allListComponent.containerElement, film);
    });

    if (last === this.#films.length) {
      this.#loadButtonComponent.element.remove();
    }

    this.#renderedCardCount = last;
  };

  /** Добавляет рабочую кнопку Load more в список всех фильмов */
  #renderLoadMore = () => {
    render(this.#loadButtonComponent, this.#allListComponent.element);
    this.#loadButtonComponent.setClickHandler(this.#renderPortionCards);
  };

  /** Отрисовывает главный список фильмов
   * @param {Object} listComponent компонент списка
   */
  #renderMainList = (listComponent) => {
    render(listComponent, this.#filmsComponent.element);

    if (!this.#films.length) {
      listComponent.changeTitle(ListTitle.NO_FILMS);
    } else {
      listComponent.insertFilmsContainer();
      listComponent.changeTitle(ListTitle.ALL);
      listComponent.hideTitle();
      this.#renderLoadMore();
      this.#renderPortionCards();
    }
  };

  /** Отрисовывает обычный список
   * @param {Object} listComponent компонент списка
   * @param {Array} sortedFilms массив сортированных фильмов
   */
  #renderExtraList = (listComponent, sortedFilms) => {
    render(listComponent, this.#filmsComponent.element);
    listComponent.insertFilmsContainer();

    sortedFilms.slice(0, 2).forEach((film) => {
      new CardPresenter(this.#popupPresenter)
        .init(listComponent.containerElement, film);
    });
  };

  /** Отрисовывает начальное состояние приложения
   * @param {HTMLElement} filmsContainer контейнер для отрисовки состояния
   */
  init = (rootContainer) => {
    this.#films = [...this.#filmsModel.items];
    this.#topFilms = [...this.#filmsModel.top];
    this.#commentedFilms = [...this.#filmsModel.commented];

    this.#renderSort(rootContainer);
    this.#rednerFilmsContainer(rootContainer);
    this.#renderMainList(this.#allListComponent, this.#films);

    if (this.#films.length) {
      this.#renderExtraList(this.#topListComponent, this.#topFilms);
      this.#renderExtraList(this.#commentedListComponent, this.#commentedFilms);
    }
  };
}
