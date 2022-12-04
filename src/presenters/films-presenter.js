import SortView from './../views/sort-view.js';
import FilmsView from './../views/films-view.js';
import ListFilmsView from './../views/list-films-view.js';
import FilmsContainerView from './../views/films-container-view.js';
import FilmCardView from './../views/film-card-view.js';
import ButtonMoreView from './../views/button-more-view.js';
import PopupFilmView from './../views/popup-film-view.js';
import CommentView from '../views/comment-view.js';
import {render} from './../render.js';
import {ListTitle, TypeList, PORTION_CARD_COUNT} from './../const.js';

/**
 * Презентер списков фильмов.
 * @param {object} filmsModel модель фильмов
 * @param {object} commentsModel модель комментариев
*/
export default class FilmsPresenter {
  #filmsElement = null;

  #filmsModel = null;
  #commentsModel = null;

  #films = null;
  #topFilms = null;
  #commentedFilms = null;

  #allListComponent = new ListFilmsView(ListTitle.LOADING);
  #topListComponent = new ListFilmsView(ListTitle.TOP, TypeList.EXTRA);
  #commentedListComponent = new ListFilmsView(ListTitle.COMMENTED, TypeList.EXTRA);
  #loadButton = new ButtonMoreView();
  #popupComponent = null;

  #renderedCardCount = 0;

  constructor(filmsModel, commentsModel) {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  /**
   * Отрисовывает карточку фильма в контейнер.
   * @param {nodeObject} container контейнер для отрисовки карточек
   * @param {object} film объект с данными о фильме
   */
  #renderCard = (container, film) => {
    const card = new FilmCardView(film);
    const linkElement = card.element.querySelector('.film-card__link');

    linkElement.addEventListener('click', this.#renderPopup.bind(this, film));
    render(card, container);
  };

  /**
   * Отрисовывает новую порцию карточек и кнопку,
   * если есть ещё карточки которые нужно отрисовать.
  */
  #renderPortionCards = () => {
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
        this.#renderCard(containerElement, film);
      });

    if (last === this.#films.length) {
      this.#loadButton.hide();
    }

    this.#renderedCardCount = last;
  };

  /** Добавляет рабочую кнопку Load more в список всех фильмов. */
  #renderLoadMore = () => {
    const listElement = this.#allListComponent.element;

    render(this.#loadButton, listElement);
    this.#allListComponent.element
      .addEventListener('click', this.#renderPortionCards);
  };

  /**
   * Отрисовывает главный список фильмов.
   * @param {object} listComponent компонент списка
   */
  #renderMainList = (listComponent) => {
    render(listComponent, this.#filmsElement);

    render(new FilmsContainerView(), listComponent.element);
    listComponent.changeTitle(ListTitle.ALL);
    listComponent.toggleHidingTitle();
    this.#renderLoadMore();
    this.#renderPortionCards();
  };

  /**
   * Отрисовывает обычный список.
   * @param {object} listComponent компонент списка
   * @param {array} films массив фильмов
   */
  #renderExtraList = (listComponent, filtredFilms) => {
    render(listComponent, this.#filmsElement);
    const containerComponent = new FilmsContainerView();
    render(containerComponent, listComponent.element);

    filtredFilms
      .slice(0, 2)
      .forEach((film) => {
        this.#renderCard(containerComponent.element, film);
      });
  };

  /**
   * Отрисовывает папап фильма.
   * @param {object} film объект с данными о фильме
   */
  #renderPopup = (film) => {
    const bodyElement = document.querySelector('body');
    const comments = this.#commentsModel.getCommentsById(film.comments);

    if (this.#popupComponent) {
      this.#removePopup();
    }

    this.#popupComponent = new PopupFilmView(film);
    const closeButtonElement = this.#popupComponent.element
      .querySelector('.film-details__close-btn');

    render(this.#popupComponent, bodyElement);
    bodyElement.classList.add('hide-overflow');

    comments.forEach((comment) => {
      render(new CommentView(comment), this.#popupComponent.element
        .querySelector('.film-details__comments-list')
      );
    });

    closeButtonElement.addEventListener('click', this.#onClosePopupClick);
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  /** Удаляет попап. */
  #removePopup = () => {
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#popupComponent.element
      .querySelector('.film-details__close-btn')
      .removeEventListener('click', this.#onClosePopupClick);

    document.querySelector('body').classList.remove('hide-overflow');
    this.#popupComponent.element.remove();
    this.#popupComponent.removeElement();
    this.#popupComponent = null;
  };

  /**
   * Функция обработчика нажатия на кнопку закрытия попапа.
   * @param {evt} evt объект события
   */
  #onClosePopupClick = (evt) => {
    evt.preventDefault();

    this.#removePopup();
  };

  /**
   * Функция обработчика нажатия на esc.
   * @param {evt} evt объект события
   */
  #onEscKeyDown = (evt) => {
    evt.preventDefault();

    if (evt.code === 'Escape') {
      this.#removePopup();
    }
  };

  /**
   * Отрисовывает начальное состояние приложения.
   * @param {nodeObject} filmsContainer контейнер для отрисовки состояния
   */
  init = (filmsContainer) => {
    this.#films = [...this.#filmsModel.films];
    this.#topFilms = [...this.#filmsModel.topFilms];
    this.#commentedFilms = [...this.#filmsModel.commentedFilms];

    render(new SortView(), filmsContainer);
    render(new FilmsView(), filmsContainer);
    this.#filmsElement = filmsContainer.querySelector('.films');

    this.#renderMainList(this.#allListComponent, this.#films);
    this.#renderExtraList(this.#topListComponent, this.#topFilms);
    this.#renderExtraList(this.#commentedListComponent, this.#commentedFilms);
  };
}
