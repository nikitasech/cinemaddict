import {createElement} from '../render.js';

const createNewProfileRatingTemplate = () => (`
  <section class="header__profile profile">
    <p class="profile__rating">Movie Buff</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>
`);

/** Вью рейтинга пользователя. */
export default class ProfileRatingView {
  #element = null;

  /**
   * @returns {string} Шаблон разметки.
   */
  get template() {
    return createNewProfileRatingTemplate();
  }

  /**
   * @returns {nodeObject} DOM-узел разметки.
   */
  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  /**
   * Удаляет DOM-узел из объекта.
   */
  removeElement() {
    this.#element = null;
  }
}
