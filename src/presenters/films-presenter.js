import {render} from './../render.js';
import {ListTitle, TypeList} from './../const.js';
import SortView from './../views/sort-view.js';
import FilmsView from './../views/films-view.js';
import ListFilmsView from './../views/list-films-view.js';
import FilmsContainerView from './../views/films-container-view.js';
import FilmCardView from './../views/film-card-view.js';
import ButtonMoreView from './../views/button-more-view.js';
import PopupFilmView from './../views/popup-film-view.js';
import CommentView from '../views/comment-view.js';

/** Презентер списков фильмов. */
export default class FilmsPresenter {
  #filmsModel = null;
  #commentsModel = null;

  #films = [];
  #topFilms = [];
  #commentedFilms = [];

  #allListComponent = new ListFilmsView(ListTitle.LOADING);
  #topListComponent = new ListFilmsView(ListTitle.TOP, TypeList.EXTRA);
  #commentedListComponent = new ListFilmsView(ListTitle.COMMENTED, TypeList.EXTRA);

  /**
   * @param {object} filmsModel Модель фильмов.
   * @param {object} commentsModel Модель комментариев.
   */
  constructor(filmsModel, commentsModel) {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  /**
   * Изменяет заголовок списка фильмов.
   * @param {nodeObject} listElement DOM-элемент списка фильмов.
   * @param {string} title Новый заголовок.
   * @param {boolean=} isHide Скрыть заголовок?
   */
  changeTitleList(listElement, title, isHide = true) {
    const titleElement = listElement
      .querySelector('.films-list__title');

    if (isHide) {
      titleElement.classList.add('visually-hidden');
    } else {
      titleElement.classList.remove('visually-hidden');
    }

    titleElement.textContent = title;
  }

  /**
   * Отрисовывает в контейнер списка все переданные фильмы.
   * @param {nodeObject} listElement Список, в контейнере которого нужно отрисовать карточки.
   * @param {array} films Массив фильмов.
   */
  addCards(listElement, films) {
    const containerElement = listElement
      .querySelector('.films-list__container');

    for (const film of films) {
      render(new FilmCardView(film), containerElement);
    }
  }

  /**
   * Создает в списке контейнер для карточек и все отрисовывает.
   * @param {nodeObject} listElement Список, в контейнере которого нужно отрисовать карточки.
   * @param {array} films Массив фильмов.
   */
  initialRenderCards(listElement, films) {
    render(new FilmsContainerView(), listElement);
    this.addCards(listElement, films);
  }

  /**
   * Отрисовывает главный список фильмов.
   * @param {object} listComponent Компонент списка.
   * @param {nodeObject} container Контейнер для отрисовки списка.
   * @param {array} films Массив фильмов.
   */
  renderMainList(listComponent, container, films) {
    const CARD_COUNT = 5;
    const croppedFilms = films.slice(0, CARD_COUNT);

    render(listComponent, container);
    this.changeTitleList(listComponent.element, ListTitle.ALL);
    this.initialRenderCards(listComponent.element, croppedFilms);

    render(new ButtonMoreView(), listComponent.element);
  }

  /**
   * Отрисовывает дополнительный список.
   * @param {object} listComponent Компонент списка.
   * @param {nodeObject} container Контейнер для отрисовки списка.
   * @param {array} films Массив фильмов.
   */
  renderExtraList(listComponent, container, films) {
    const CARD_COUNT = 2;
    const croppedFilms = films.slice(0, CARD_COUNT);

    this.initialRenderCards(listComponent.element, croppedFilms);
    render(listComponent, container);
  }

  /**
   * Отрисовывает папап фильма.
   * @param {object} film Объект фильма для отрисовки.
   */
  renderPopup(film) {
    const siteElement = document.querySelector('body');
    const comments = this.#commentsModel.getCommentsById(film.comments);

    siteElement.classList.add('hide-overflow');

    render(new PopupFilmView(film), siteElement);
    const siteCommentsListElement = siteElement
      .querySelector('.film-details__comments-list');

    for (const comment of comments) {
      render(new CommentView(comment), siteCommentsListElement);
    }
  }

  /**
   * Отрисовывает начальное состояние приложения.
   * @param {nodeObject} filmsContainer Контейнер для отрисовки состояния.
   */
  init(filmsContainer) {
    this.#films = [...this.#filmsModel.films];
    this.#topFilms = [...this.#filmsModel.topFilms];
    this.#commentedFilms = [...this.#filmsModel.commentedFilms];

    render(new SortView(), filmsContainer);
    render(new FilmsView(), filmsContainer);
    const siteFilmsElement = filmsContainer.querySelector('.films');

    this.renderMainList(
      this.#allListComponent,
      siteFilmsElement,
      this.#films
    );

    this.renderExtraList(
      this.#topListComponent,
      siteFilmsElement,
      this.#topFilms
    );

    this.renderExtraList(
      this.#commentedListComponent,
      siteFilmsElement,
      this.#commentedFilms,
    );

    this.renderPopup(this.#films[0]);
  }
}
