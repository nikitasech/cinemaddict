import { render } from './../render.js';
import PopupFilmView from './../views/popup-film-view.js';
import CommentView from '../views/comment-view.js';

/** Презентер попапа фильма. */
export default class FilmDetailsPresenter {
  /**
   * Отрисовывает папап фильма.
   */
  init() {
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
}
