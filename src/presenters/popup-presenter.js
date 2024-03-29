import {NameControl, TypeAction, TypeControl, TypeUpdate} from './../const.js';
import {remove, render, RenderPosition, replace} from './../framework/render.js';
import PopupFilmView from './../views/popup-film-view.js';
import CommentView from './../views/comment-view.js';
import FilmControlsView from './../views/film-controls-view.js';
import FilmDetailsView from './../views/film-details-view.js';
import CommentsView from './../views/comments-view.js';
import FormCommentView from './../views/form-comment-view.js';

/**
 * Дочерний презентер {@link FilmsPresenter},
 * управляющий отображением попапа с деталями фильма
 * @param {Function} changeData функция изменения данных
 * @param {Function} closePopup функция закрытия попапа
 */
export default class PopupPresenter {
  #containerElement = document.body;
  #commentsModel = null;
  #popupComponent = null;
  #filmDetailsComponent = null;
  #controlsComponent = null;
  #commentsComponent = null;
  #commentComponent = new Map();
  #formCommentComponent = null;
  #film = null;
  #changeData = null;
  #closePopup = null;

  constructor(changeData, closePopup, commentsModel) {
    this.#changeData = changeData;
    this.#closePopup = closePopup;
    this.#commentsModel = commentsModel;
  }

  /** Инициализирует попап
   * @param {Object} film объект фильма
   * @param {Array} comments массив комментариев
   */
  init = (film) => {
    this.#film = film;

    if (this.#popupComponent) {
      this.#formCommentComponent.removeSubmitHandler();
      this.#popupComponent.removeCloseClickHandler();
    } else {
      this.#renderPopup();
    }

    this.#renderDetails();
    this.#renderComments();
    this.#renderControls();
  };

  /** Удаляет попап */
  destroy = () => {
    this.#popupComponent.removeCloseClickHandler();
    this.#formCommentComponent.removeSubmitHandler();
    this.#popupComponent.removeEscKeydownHandler();

    this.#containerElement.classList.remove('hide-overflow');
    remove(this.#popupComponent);
    this.#popupComponent = null;
    this.#filmDetailsComponent = null;
    this.#commentsComponent = null;
  };

  setAborting = (typeAction, commentId) => {
    switch (typeAction) {
      case TypeAction.ADD_COMMENT:
        this.#formCommentComponent.shake();
        break;
      case TypeAction.REMOVE_COMMENT:
        if (this.#commentComponent.get(commentId)) {
          this.#commentComponent.get(commentId).shake();
        }
        break;
      case TypeAction.UPDATE_FILM:
        this.#controlsComponent.shake();
    }
  };

  #renderPopup = () => {
    this.#popupComponent = new PopupFilmView(this.#film);

    render(this.#popupComponent, this.#containerElement);
    this.#containerElement.classList.add('hide-overflow');
  };

  #renderDetails = () => {
    const prevDetailsComponent = this.#filmDetailsComponent;
    this.#filmDetailsComponent = new FilmDetailsView(this.#film);

    if (!prevDetailsComponent) {
      render(this.#filmDetailsComponent, this.#popupComponent.containerElement);
    } else {
      replace(this.#filmDetailsComponent, prevDetailsComponent);
    }

    this.#popupComponent.setCloseClickHandler(this.#closePopup);
    this.#popupComponent.setEscKeydownHandler(this.#closePopup);
  };

  #renderControls = () => {
    this.#controlsComponent = new FilmControlsView(
      this.#film.userDetails,
      TypeControl.DETAILS
    );

    render(this.#controlsComponent, this.#filmDetailsComponent.element);
    this.#controlsComponent.setClickHandler(this.#changeControlHandler);
  };

  #renderComments = async () => {
    const prevCommentsComponent = this.#commentsComponent;
    const comments = await this.#commentsModel.getItems(this.#film.id);
    this.#commentsComponent = new CommentsView(this.#film.comments.length);
    this.#formCommentComponent = new FormCommentView();

    if (!prevCommentsComponent) {
      render(this.#commentsComponent, this.#popupComponent.element);
    } else {
      replace(this.#commentsComponent, prevCommentsComponent);
    }

    render(this.#formCommentComponent, this.#commentsComponent.listElement, RenderPosition.AFTEREND);
    this.#formCommentComponent.setSubmitHandler(this.#changeData);

    comments.forEach((comment) => {
      const commentComponent = new CommentView(comment);
      this.#commentComponent.set(comment.id, commentComponent);
      render(commentComponent, this.#commentsComponent.listElement);
      commentComponent.setClickHandler(this.#changeData);
    });
  };

  #changeControlHandler = (controlName) => {
    const newFilm = structuredClone(this.#film);

    switch (controlName) {
      case NameControl.WATCHLIST:
        newFilm.userDetails.watchlist = !newFilm.userDetails.watchlist;
        break;
      case NameControl.WATCHED:
        newFilm.userDetails.alreadyWatched = !newFilm.userDetails.alreadyWatched;
        break;
      case NameControl.FAVORITE:
        newFilm.userDetails.favorite = !newFilm.userDetails.favorite;
        break;
    }

    this.#changeData(TypeAction.UPDATE_FILM, TypeUpdate.PATCH, newFilm);
  };
}
