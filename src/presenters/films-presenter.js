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

const CardCount = {
  ALL: 5,
  TOP: 2,
  COMMENTED: 2
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
   * Отрисовывает нужное количество карточек в списке фильмов.
   * @param {nodeObject} listElement Элемент, в контейнере которого нужно отрисовать карточки.
   * @param {number} countCards Количество карточек.
   */
  initialRenderCards(listElement, countCards) {
    render(new FilmsContainerView(), listElement);
    const containerElement = listElement
      .querySelector('.films-list__container');

    for (let i = 0; i < countCards; i++) {
      render(new FilmCardView(), containerElement);
    }
  }

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
   * Заполняет главный список фильмами и кнопкой 'Load more'.
   * @param {nodeObject} listElement DOM-элемент списка.
   */
  fillAllFilms(listElement) {
    this.changeTitleList(listElement, ListTitle.ALL);
    this.initialRenderCards(listElement, CardCount.ALL);

    render(new ButtonMoreView(), this.allListComponent.element);
  }

  /**
   * Отрисовывает блок Top rated.
   * @param {object} listComponent Компонент списка.
   * @param {nodeObject} container Контейнер для отрисовки списка.
   */
  renderTopFilms(listComponent, container) {
    this.initialRenderCards(
      listComponent.getElement(),
      CardCount.TOP
    );
    render(listComponent, container);
  }

  /**
   * Отрисовывает блок Most commented.
   * @param {object} listComponent Компонент списка.
   * @param {nodeObject} container Контейнер для отрисовки списка.
   */
  renderCommentedFilms(listComponent, container) {
    this.initialRenderCards(
      listComponent.getElement(),
      CardCount.COMMENTED
    );
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
  init(mainContainer) {
    render(new SortView(), mainContainer);
    render(new FilmsView(), mainContainer);
    const siteFilmsElement = mainContainer.querySelector('.films');

    /* -----------------------------------
      - Отрисовывает блок All movie с сообщением о загрузке.
      - После успешного получения данных заполняет список фильмами.
    */
    render(this.allListComponent, siteFilmsElement);
    this.fillAllFilms(
      siteFilmsElement.querySelector('.films-list')
    );

    /* -----------------------------------
      Отрисовывает блок Top rates.
    */
    this.renderTopFilms(
      this.topListComponent,
      siteFilmsElement
    );

    /* -----------------------------------
      Отрисовывает блок Most commented.
    */
    this.renderCommentedFilms(
      this.commentedListComponent,
      siteFilmsElement
    );

    /* -----------------------------------
      Отрисовывает попап с деталями фильма.
    */
    this.renderPopup();
  }
}
