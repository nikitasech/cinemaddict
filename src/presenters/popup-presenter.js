import {render} from './../framework/render.js';
import PopupFilmView from './../views/popup-film-view.js';
import CommentView from './../views/comment-view.js';

/** Презентер попапа фильма. Управляет отображением попапа с деталями фильма. */
export default class PopupPresenter {
  #commentsModel = null;
  #popupComponent = null;

  constructor(commentsModel) {
    this.#commentsModel = commentsModel;
  }

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
   * Отрисовывает папап фильма
   * @param {Object} film объект с данными о фильме
   */
  init = (film) => {
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
}
