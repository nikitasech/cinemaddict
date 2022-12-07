import SortView from './../views/sort-view.js';
import FilmsView from './../views/films-view.js';
import ListFilmsView from './../views/list-films-view.js';
import FilmsContainerView from './../views/films-container-view.js';
import FilmCardView from './../views/film-card-view.js';
import ButtonMoreView from './../views/button-more-view.js';
import PopupFilmView from './../views/popup-film-view.js';
import CommentView from '../views/comment-view.js';
import {render} from './../framework/render.js';
import {ListTitle, TypeList, PORTION_CARD_COUNT} from './../const.js';

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
  #popupComponent = null;

  #renderedCardCount = 0;

  constructor(filmsModel, commentsModel) {
    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
  }

  /**
   * Отрисовывает карточку фильма в контейнер
   * @param {HTMLElement} container контейнер для отрисовки карточек
   * @param {Object} film объект с данными о фильме
   */
  #renderCard = (container, film) => {
    const card = new FilmCardView(film);
    card.setClickHandler(this.#renderPopup);
    render(card, container);
  };

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

    this.#films
      .slice(first, last)
      .forEach((film) => {
        this.#renderCard(containerElement, film);
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

    filtredFilms
      .slice(0, 2)
      .forEach((film) => {
        this.#renderCard(containerComponent.element, film);
      });
  };

  /**
   * Отрисовывает папап фильма
   * @param {Object} film объект с данными о фильме
   */
  #renderPopup = (film) => {
    const bodyElement = document.querySelector('body');
    const comments = this.#commentsModel.getCommentsById(film.comments);

    if (this.#popupComponent) {
      this.#removePopup();
    }

    this.#popupComponent = new PopupFilmView(film);
    render(this.#popupComponent, bodyElement);
    bodyElement.classList.add('hide-overflow');

    comments.forEach((comment) => {
      render(new CommentView(comment), this.#popupComponent.element
        .querySelector('.film-details__comments-list')
      );
    });

    this.#popupComponent.setCloseClickHandler(this.#removePopup);
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  /** Удаляет попап */
  #removePopup = () => {
    document.removeEventListener('keydown', this.#onEscKeyDown);
    this.#popupComponent.removeCloseClickHandler(this.#removePopup);

    document.querySelector('body').classList.remove('hide-overflow');
    this.#popupComponent.element.remove();
    this.#popupComponent.removeElement();
    this.#popupComponent = null;
  };

  /**
   * Функция обработчика нажатия на esc
   * @param {Object} evt объект события
   */
  #onEscKeyDown = (evt) => {
    evt.preventDefault();

    if (evt.code === 'Escape') {
      this.#removePopup();
    }
  };

  /**
   * Отрисовывает начальное состояние приложения
   * @param {HTMLElement} filmsContainer контейнер для отрисовки состояния
   */
  init = (filmsContainer) => {
    this.#films = [...this.#filmsModel.films];
    this.#topFilms = [...this.#filmsModel.topFilms];
    this.#commentedFilms = [...this.#filmsModel.commentedFilms];

    render(new SortView(), filmsContainer);
    render(new FilmsView(), filmsContainer);
    this.#filmsElement = filmsContainer.querySelector('.films');

    this.#renderMainList(this.#allListComponent, this.#films);

    if (this.#films.length) {
      this.#renderExtraList(this.#topListComponent, this.#topFilms);
      this.#renderExtraList(this.#commentedListComponent, this.#commentedFilms);
    }
  };
}
