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

const PORTION_CARD_COUNT = 5;

/** Презентер списков фильмов. */
export default class FilmsPresenter {
  #filmsElement = null;

  #filmsModel = null;
  #commentsModel = null;

  #films = [];
  #topFilms = [];
  #commentedFilms = [];

  #allListComponent = new ListFilmsView(ListTitle.LOADING);
  #topListComponent = new ListFilmsView(ListTitle.TOP, TypeList.EXTRA);
  #commentedListComponent = new ListFilmsView(ListTitle.COMMENTED, TypeList.EXTRA);
  #loadButton = new ButtonMoreView();

  #renderedCardCount = 0;

  /**
   * @param {object} filmsModel Модель фильмов.
   * @param {object} commentsModel Модель комментариев.
   */
  constructor(filmsModel, commentsModel) {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  renderCard(container, film) {
    render(new FilmCardView(film), container);
  }

  renderPortionCardsToAllList() {
    const containerElement = this.#allListComponent.element
      .querySelector('.films-list__container');

    const first = this.#renderedCardCount;
    const last = Math.min(
      this.#renderedCardCount + PORTION_CARD_COUNT,
      this.#films.length
    );

    this.#films
      .slice(first, last)
      .forEach((film) => {
        this.renderCard(containerElement, film);
      });

    if (last === this.#films.length) {
      this.#loadButton.toggleHiding();
    }

    this.#renderedCardCount = last;
  }

  /**
   * Отрисовывает главный список фильмов.
   * @param {object} listComponent Компонент списка.
   * @param {array} films Массив фильмов.
   */
  renderMainList(listComponent) {
    render(listComponent, this.#filmsElement);

    render(new FilmsContainerView(), listComponent.element);
    render(this.#loadButton, listComponent.element);
    listComponent.changeTitle(ListTitle.ALL);
    listComponent.toggleHidingTitle();
    this.renderPortionCardsToAllList();
  }

  /**
   * Отрисовывает обычный список.
   * @param {object} listComponent Компонент списка.
   * @param {array} films Массив фильмов.
   */
  renderExtraList(listComponent, filtredFilms) {
    render(listComponent, this.#filmsElement);
    const containerComponent = new FilmsContainerView();
    render(containerComponent, listComponent.element);

    filtredFilms
      .slice(0, 2)
      .forEach((film) => {
        this.renderCard(containerComponent.element, film);
      });
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
    this.#filmsElement = filmsContainer.querySelector('.films');

    this.renderMainList(this.#allListComponent, this.#films);
    this.renderExtraList(this.#topListComponent, this.#topFilms);
    this.renderExtraList(this.#commentedListComponent, this.#commentedFilms);

    // this.renderPopup(this.#films[0]);
  }
}
