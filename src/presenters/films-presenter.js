import { render } from './../render.js';
import SortView from './../views/sort-view.js';
import FilmsView from './../views/films-view.js';
import ListFilmsView from './../views/list-films-view.js';
import FilmsContainerView from './../views/films-container-view.js';
import FilmCardView from './../views/film-card-view.js';
import ButtonMoreView from './../views/button-more-view.js';
import PopupFilmView from './../views/popup-film-view.js';
import CommentView from '../views/comment-view.js';

const ListTitle = {
  LOADING: 'Loading...',
  ALL: 'All movies. Upcoming',
  TOP: 'Top rated',
  COMMENTED: 'Most commented',
  NO_FILMS: 'There are no movies in our database',
  NO_WATCHLIST_ADDED: 'There are no movies to watch now',
  NO_HISTIRY_ADDED: 'There are no watched movies now',
  NO_FAVORITES_ADDED: 'There are no favorite movies now'
};

const TypeList = {
  MAIN: 'main',
  EXTRA: 'extra'
};

/** Презентер списков фильмов. */
export default class FilmsPresenter {
  allListComponent = new ListFilmsView(ListTitle.LOADING);
  topListComponent = new ListFilmsView(ListTitle.TOP, TypeList.EXTRA);
  commentedListComponent = new ListFilmsView(ListTitle.COMMENTED, TypeList.EXTRA);

  /**
   * Изменяет заголовок списка фильмов.
   * @param {nodeObject} listElement DOM-элемент списка фильмов.
   * @param {string} title Новый заголовок.
   * @param {boolean} isHide Скрыть заголовок?
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
   * @param {number} count Количество карточек.
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
    this.changeTitleList(listComponent.getElement(), ListTitle.ALL);
    this.initialRenderCards(listComponent.getElement(), croppedFilms);

    render(new ButtonMoreView(), listComponent.getElement());
  }

  /**
   * Отрисовывает дополнительный список.
   * @param {object} listComponent Компонент списка.
   * @param {nodeObject} container Контейнер для отрисовки списка.
   */
  renderExtraList(listComponent, container, films) {
    const CARD_COUNT = 2;
    const croppedFilms = films.slice(0, CARD_COUNT);

    this.initialRenderCards(listComponent.getElement(), croppedFilms);
    render(listComponent, container);
  }

  /** Отрисовывает папап фильма. */
  renderPopup() {
    const COMMENT_COUNT = 2;
    const siteElement = document.querySelector('body');

    siteElement.classList.add('hide-overflow');

    render(new PopupFilmView(), siteElement);
    const siteCommentsListElement = siteElement
      .querySelector('.film-details__comments-list');

    for (let i = 0; i < COMMENT_COUNT; i++) {
      render(new CommentView(), siteCommentsListElement);
    }
  }

  /**
   * Отрисовывает начальное состояние приложения.
   * @param {nodeObject} filmsContainer Контейнер для отрисовки состояния.
   */
  init(filmsContainer, filmsModel) {
    this.films = [...filmsModel.getFilms()];

    render(new SortView(), filmsContainer);
    render(new FilmsView(), filmsContainer);
    const siteFilmsElement = filmsContainer.querySelector('.films');

    this.renderMainList(
      this.allListComponent,
      siteFilmsElement,
      this.films
    );

    this.renderExtraList(
      this.topListComponent,
      siteFilmsElement,
      this.films,
    );

    this.renderExtraList(
      this.commentedListComponent,
      siteFilmsElement,
      this.films,
    );
  }
}
