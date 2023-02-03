import AbstractStatefulView from './../framework/view/abstract-stateful-view.js';
import {emojies} from './../const.js';

const COMMENT_BLANK = {
  comment: '',
  emotion: ''
};

const createSelectedEmojiTemplate = (emojiName) => (`
  <img src="images/emoji/${emojiName}.png" width="55" height="55" alt="emoji-${emojiName}">
`);

const createInputEmojiTemplate = (emojiName, isActive) => (`
  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emojiName}" value="${emojiName}" ${isActive ? 'checked' : ''}>
  <label class="film-details__emoji-label" for="emoji-${emojiName}">
    <img src="./images/emoji/${emojiName}.png" width="30" height="30" alt="emoji">
  </label>
`);

const createFormCommentTemplate = (data) => {
  const {comment, emotion, isEmojiActive} = data;
  const addedEmojiImage = isEmojiActive ? createSelectedEmojiTemplate(emotion) : '';

  const inputsEmoji = emojies.reduce((accumulator, emoji) => {
    const isCurrentEmojiActive = emoji === emotion;
    return accumulator + createInputEmojiTemplate(emoji, isCurrentEmojiActive);
  }, '');

  return (`
    <form class="film-details__new-comment" action="" method="get">
      <div class="film-details__add-emoji-label">${addedEmojiImage}</div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment}</textarea>
      </label>

      <div class="film-details__emoji-list">${inputsEmoji}</div>
    </form>
  `);
};

/** Форма комментария с состоянием
 * @param {Object} comment состояние комментария
 */
export default class FormCommentView extends AbstractStatefulView {
  constructor(comment = COMMENT_BLANK) {
    super();
    this._state = FormCommentView.convertCommentToState(comment);

    this.#setInnerHandler();
  }

  get template() {
    return createFormCommentTemplate(this._state);
  }

  _restoreHandlers = () => {
    this.#setInnerHandler();
  };

  /** Выставляет внутренние обработчики */
  #setInnerHandler = () => {
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#textareaInputHandler);

    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('input', this.#emojiInputHandler);
  };

  /** Обработчик ввода комментария
   * @param {Object} evt объект события
   */
  #textareaInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({comment: evt.target.value});
  };

  /** Обработчик выбора смайлика
   * @param {Object} evt объект события
   */
  #emojiInputHandler = (evt) => {
    evt.preventDefault();

    for (const emoji of emojies) {
      if (evt.target.value === emoji) {
        this.updateElement({emotion: emoji, isEmojiActive: true});
      }
    }
  };

  /** Преобразовывает объект комментария в состояние
   * @param {Object} comment объект комментария
   */
  static convertCommentToState = (comment) => ({
    ...comment,
    isEmojiActive: Boolean(comment.emotion)
  });

  /** Преобразовывает обект состояния в комментарий
   * @param {Object} state объект состояния
   */
  static convertStateToComment = (state) => {
    const comment = state;

    delete comment.isEmojiActive;

    return comment;
  };
}
