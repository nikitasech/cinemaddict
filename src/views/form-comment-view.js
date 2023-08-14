import AbstractStatefulView from './../framework/view/abstract-stateful-view.js';
import {TypeAction, TypeUpdate, emojies} from './../const.js';

const COMMENT_BLANK = {
  comment: '',
  emotion: ''
};

const createSelectedEmojiTemplate = (emojiName) => (`
  <img src="images/emoji/${emojiName}.png" width="55" height="55" alt="emoji-${emojiName}">
`);

const createInputEmojiTemplate = (emojiName, isActive, disabledAttr) => (`
  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emojiName}" value="${emojiName}" ${isActive ? 'checked' : ''} ${disabledAttr}>
  <label class="film-details__emoji-label" for="emoji-${emojiName}">
    <img src="./images/emoji/${emojiName}.png" width="30" height="30" alt="emoji">
  </label>
`);

const createFormCommentTemplate = (data) => {
  const {comment, emotion, isEmojiActive, isDisabled} = data;
  const disabledAttr = isDisabled ? 'disabled' : '';
  const addedEmojiImage = isEmojiActive ? createSelectedEmojiTemplate(emotion) : '';
  const inputsEmoji = emojies.reduce((accumulator, emoji) => {
    const isCurrentEmojiActive = emoji === emotion;
    return accumulator + createInputEmojiTemplate(emoji, isCurrentEmojiActive, disabledAttr);
  }, '');

  return (`
    <form class="film-details__new-comment" action="" method="get">
      <div class="film-details__add-emoji-label">${addedEmojiImage}</div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${disabledAttr}>${comment}</textarea>
      </label>

      <div class="film-details__emoji-list">${inputsEmoji}</div>
    </form>
  `);
};

/** Представление формы добавления нового комментария
 * @param {Object} comment данные комментария
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

  /** Преобразовывает объект комментария в состояние
   * @param {Object} comment объект комментария
   */
  static convertCommentToState = (comment) => ({
    ...comment,
    isEmojiActive: Boolean(comment.emotion),
    isDisabled: false
  });

  /** Преобразовывает обект состояния в комментарий
   * @param {Object} state объект состояния
   */
  static convertStateToComment = ({comment, emotion}) => ({comment, emotion});

  shake = () => {
    this.updateElement({isEmojiActive: false, isDisabled: false});
    super.shake();
  };

  /** Устанавливает обработчик на отправку формы сочитанием клавиш Cmd/Ctrl+Enter
   * @param {Function} callback функция для выполнения после выявления события
   */
  setSubmitHandler = (callback) => {
    this._callback.submit = callback;
    document.addEventListener('keydown', this.#submitHandler);
  };

  /** Удаляет обработчик отправки формы */
  removeSubmitHandler = () => {
    document.removeEventListener('keydown', this.#submitHandler);
  };

  _restoreHandlers = () => {
    document.addEventListener('keydown', this.#submitHandler);
    this.#setInnerHandler();
  };

  #setInnerHandler = () => {
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#textareaInputHandler);

    this.element.querySelector('.film-details__emoji-list')
      .addEventListener('input', this.#emojiInputHandler);
  };

  #submitHandler = (evt) => {
    const comment = FormCommentView.convertStateToComment(this._state);

    if (evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey)) {
      evt.preventDefault();

      if (comment.comment && comment.emotion) {
        this.updateElement({isDisabled: true});
        this.removeSubmitHandler();
        this._callback.submit(TypeAction.ADD_COMMENT, TypeUpdate.PATCH, comment);
        return;

      }

      super.shake();
    }
  };

  #textareaInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({comment: evt.target.value});
  };

  #emojiInputHandler = (evt) => {
    evt.preventDefault();

    for (const emoji of emojies) {
      if (evt.target.value === emoji) {
        this.updateElement({emotion: emoji, isEmojiActive: true});
      }
    }
  };
}
