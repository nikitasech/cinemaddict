import {TypeControls} from './../const.js';
import {render} from './../framework/render.js';
import PopupFilmView from './../views/popup-film-view.js';
import CommentView from './../views/comment-view.js';
import FilmControlsView from './../views/film-controls-view.js';
import FilmDetailsView from './../views/film-details-view.js';
import CommentsView from './../views/comments-view.js';

/**
 * Дочерний презентер {@link FilmsPresenter},
 * управляющий отображением попапа с деталями фильма
 * @param {HTMLElement} container контейнер для отрисовки попапа
 * @param {Object} commentsModel модель комментариев
 */
export default class PopupPresenter {
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

  /** @type {HTMLElement|null} контейнер для отрисовки попапа */
  #containerElement = null;

  constructor(container, commentsModel) {
    this.#containerElement = container;
    this.#commentsModel = commentsModel;
  }

  /** Инициализирует попап
   * @param {Object} film объект фильма
   */
  init = (film) => {
    if (this.#popupComponent) {
      this.#removePopup();
    }

    this.#renderPopup(this.#containerElement, film);
  };

  /** Функция обработчика нажатия на esc
   * @param {Object} evt объект события
   */
  #onEscKeyDown = (evt) => {
    evt.preventDefault();

    if (evt.code === 'Escape') {
      this.#removePopup();
    }
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

  /** Отрисовывает комментарии
   * @param {Array} commentsIds массив с идентификаторами комментариев
   */
  #renderComments = (commentsIds) => {
    const comments = this.#commentsModel.getCommentsById(commentsIds);

    comments.forEach((comment) => {
      render(new CommentView(comment), this.#commentsComponent.listElement);
    });
  };

  /** Отрисовывает папап фильма
   * @param {HTMLElement} container контейнер для отрисовки попапа
   * @param {Object} film объект с данными о фильме
   */
  #renderPopup = (container, film) => {
    this.#popupComponent = new PopupFilmView(film);
    this.#filmDetailsComponent = new FilmDetailsView(film);
    this.#commentsComponent = new CommentsView(film.comments.length);
    this.#controlsComponent = new FilmControlsView(
      film.userDetails,
      TypeControls.DETAILS
    );

    render(this.#popupComponent, container);
    render(this.#filmDetailsComponent, this.#popupComponent.containerElement);
    render(this.#controlsComponent, this.#filmDetailsComponent.element);
    render(this.#commentsComponent, this.#popupComponent.element);
    this.#renderComments(film.comments);

    container.classList.add('hide-overflow');

    this.#popupComponent.setCloseClickHandler(this.#removePopup);
    document.addEventListener('keydown', this.#onEscKeyDown);
  };
}
