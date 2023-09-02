import { TypeAction, TypeUpdate } from './../const.js';
import AbstractStatefulView from './../framework/view/abstract-stateful-view.js';
import { dateFromNow } from './../utils/common.js';
import he from 'he';

const DeleteButtonText = {
  DELETE: 'Delete',
  DELETING: 'Deleting...'
};

const createCommentTemplate = (state) => {
  const {emotion, author, isDeleting, isDisabled} = state;
  const text = he.encode(state.comment);
  const date = dateFromNow(state.date);
  const disabledTag = isDisabled ? 'disabled' : '';
  const deleteButtonText = isDeleting
    ? DeleteButtonText.DELETING
    : DeleteButtonText.DELETE;

  return (`
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${date}</span>
          <button class="film-details__comment-delete" ${disabledTag}>${deleteButtonText}</button>
        </p>
      </div>
    </li>
  `);
};

/** Представление комментария
 * @param {Object} comment данные комменария
 */
export default class CommentView extends AbstractStatefulView {
  #state = {};

  constructor(comment) {
    super();
    this._state = CommentView.convertCommentToState(comment);
  }

  get template() {
    return createCommentTemplate(this._state);
  }

  static convertStateToComment = ({author, comment, date, emotion, id}) => ({author, comment, date, emotion, id});

  static convertCommentToState = (comment) => ({
    ...comment,
    isDeleting: false,
    isDisabled: false
  });

  shake = () => {
    this.updateElement({isDeleting: false, isDisabled: false});
    super.shake();
  };

  /** Устанавливает обработчик клика на кнопку "Delete"
   * @param {Function} callback функция для выполнения после выявления события
   */
  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element
      .querySelector('.film-details__comment-delete')
      .addEventListener('click', this.#clickHandler);
  };

  _restoreHandlers = () => {
    this.element
      .querySelector('.film-details__comment-delete')
      .addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({isDeleting: true, isDisabled: true});
    this._callback.click(
      TypeAction.REMOVE_COMMENT,
      TypeUpdate.PATCH,
      CommentView.convertStateToComment(this._state)
    );
  };
}
