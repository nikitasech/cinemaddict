import {render} from './../framework/render.js';
import PopupFilmView from './../views/popup-film-view.js';
import CommentView from './../views/comment-view.js';
import FilmControlsView from '../views/film-controls-view.js';
import FilmDetailsView from '../views/film-details-view.js';
import CommentsView from '../views/comments-view.js';

/** Презентер попапа фильма. Управляет отображением попапа с деталями фильма */
export default class PopupPresenter {
  #commentsModel = null;

  #popupComponent = null;
  #filmDetailsComponent = null;
  #controlsComponent = null;
  #commentsComponent = null;

  constructor(commentsModel) {
    this.#commentsModel = commentsModel;
  }

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
   * Отрисовывает комментарии
   * @param {Array} commentsIds массив с идентификаторами комментариев
   */
  #renderComments = (commentsIds) => {
    const comments = this.#commentsModel.getCommentsById(commentsIds);

    comments.forEach((comment) => {
      render(new CommentView(comment), this.#commentsComponent.listElement);
    });
  };

  /**
   * Отрисовывает папап фильма
   * @param {HTMLElement} container контейнер для отрисовки попапа
   * @param {Object} film объект с данными о фильме
   */
  #renderPopup = (container, film) => {
    this.#popupComponent = new PopupFilmView(film);
    this.#filmDetailsComponent = new FilmDetailsView(film);
    this.#controlsComponent = new FilmControlsView(film.userDetails, 'details'); // #TODO заменить 'details' на константу
    this.#commentsComponent = new CommentsView(film.comments.length);

    render(this.#popupComponent, container);
    render(this.#filmDetailsComponent, this.#popupComponent.containerElement);
    render(this.#controlsComponent, this.#filmDetailsComponent.element);
    render(this.#commentsComponent, this.#popupComponent.element);
    this.#renderComments(film.comments);

    container.classList.add('hide-overflow');

    this.#popupComponent.setCloseClickHandler(this.#removePopup);
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  init = (film) => {
    const bodyElement = document.querySelector('body');

    if (this.#popupComponent) {
      this.#removePopup();
    }

    this.#renderPopup(bodyElement, film);
  };
}
