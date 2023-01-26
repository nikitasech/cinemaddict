import {TypeControls} from './../const.js';
import {remove, render, RenderPosition, replace} from './../framework/render.js';
import PopupFilmView from './../views/popup-film-view.js';
import CommentView from './../views/comment-view.js';
import FilmControlsView from './../views/film-controls-view.js';
import FilmDetailsView from './../views/film-details-view.js';
import CommentsView from './../views/comments-view.js';
import FormCommentView from '../views/form-comment-view.js';

/**
 * Дочерний презентер {@link FilmsPresenter},
 * управляющий отображением попапа с деталями фильма
 * @param {Object} commentsModel модель комментариев
 * @param {Function} filmChangeHandler функция изменения данных фильма
 * @param {Function} closePopup функция закрытия попапа
 */
export default class PopupPresenter {
  /** @type {HTMLElement} контейнер для отрисовки попапа */
  #containerElement = document.body;

  /** @type {Object|null} модель комментариев */
  #commentsModel = null;

  /** @type {Object|null} представление всплывающего окна */
  #popupComponent = null;

  /** @type {Object|null} представление деталей фильма */
  #filmDetailsComponent = null;

  /** @type {Object|null} представление элементов управления */
  #controlsComponent = null;

  /** @type {Object|null} представление комментариев */
  #commentsComponent = null;

  /** @type {Object|null} данные фильма */
  #film = null;

  /** @type {Function|null} функция изменнеия данных фильма */
  #filmChangeHandler = null;

  /** @type {Function|null} функция закрытия попапа */
  #closePopupClickHundler = null;

  constructor(commentsModel, filmChangeHandler, closePopupClickHundler) {
    this.#commentsModel = commentsModel;
    this.#filmChangeHandler = filmChangeHandler;
    this.#closePopupClickHundler = closePopupClickHundler;
  }

  /** Инициализирует попап
   * @param {Object} film объект фильма
   */
  init = (film) => {
    this.#film = film;

    if (!this.#popupComponent) {
      this.#renderPopup();
    }

    this.#renderDetails();
    this.#renderComments();
    this.#renderControls();
  };

  /** Удаляет попап */
  destroy = () => {
    this.#popupComponent.removeCloseClickHandler(this.#closePopupClickHundler);
    document.removeEventListener('keydown', this.#EscKeyDownHandler);

    this.#containerElement.classList.remove('hide-overflow');
    remove(this.#popupComponent);
    this.#popupComponent = null;
    this.#filmDetailsComponent = null;
    this.#commentsComponent = null;
  };

  /** Отрисовывает папап фильма
   * @param {HTMLElement} container контейнер для отрисовки попапа
   */
  #renderPopup = () => {
    this.#popupComponent = new PopupFilmView(this.#film);

    render(this.#popupComponent, this.#containerElement);
    this.#containerElement.classList.add('hide-overflow');
  };

  /** Отрисовывает детали фильма */
  #renderDetails = () => {
    const prevDetailsComponent = this.#filmDetailsComponent;
    this.#filmDetailsComponent = new FilmDetailsView(this.#film);

    if (!prevDetailsComponent) {
      render(this.#filmDetailsComponent, this.#popupComponent.containerElement);
    } else {
      replace(this.#filmDetailsComponent, prevDetailsComponent);
    }

    this.#popupComponent.setCloseClickHandler(this.#closePopupClickHundler);
    document.addEventListener('keydown', this.#EscKeyDownHandler);
  };

  /** Отрисовывает элементы управления */
  #renderControls = () => {
    this.#controlsComponent = new FilmControlsView(
      this.#film.userDetails,
      TypeControls.DETAILS
    );

    this.#controlsComponent.setClickHandler(
      this.#chengeWatchlistHandler,
      this.#chengeWatchedHandler,
      this.#chengeFavoriteHandler
    );

    render(this.#controlsComponent, this.#filmDetailsComponent.element);
  };

  /** Отрисовывает комментарии */
  #renderComments = () => {
    const comments = this.#commentsModel.getCommentsById(this.#film.comments);
    const prevCommentsComponent = this.#commentsComponent;
    this.#commentsComponent = new CommentsView(this.#film.comments.length);

    if (!prevCommentsComponent) {
      render(this.#commentsComponent, this.#popupComponent.element);
    } else {
      replace(this.#commentsComponent, prevCommentsComponent);
    }

    render(new FormCommentView(), this.#commentsComponent.listElement, RenderPosition.AFTEREND);

    comments.forEach((comment) => {
      render(new CommentView(comment), this.#commentsComponent.listElement);
    });
  };

  /** Функция обработчика нажатия на esc
   * @param {Object} evt объект события
   */
  #EscKeyDownHandler = (evt) => {
    if (evt.code === 'Escape') {
      evt.preventDefault();
      this.#closePopupClickHundler();
    }
  };

  /** Добавляет фильм в список просмотров и наоборот @callback */
  #chengeWatchlistHandler = () => {
    this.#film.userDetails.watchlist = !this.#film.userDetails.watchlist;
    this.#filmChangeHandler(this.#film);
  };

  /** Добавляет фильм в просмотренные и наоборот @callback */
  #chengeWatchedHandler = () => {
    this.#film.userDetails.alreadyWatched = !this.#film.userDetails.alreadyWatched;
    this.#filmChangeHandler(this.#film);
  };

  /** Добавляет фильм в любимые и наоборот @callback */
  #chengeFavoriteHandler = () => {
    this.#film.userDetails.favorite = !this.#film.userDetails.favorite;
    this.#filmChangeHandler(this.#film);
  };
}
