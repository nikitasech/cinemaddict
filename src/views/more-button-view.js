import {createElement} from '../render.js';

const createMoreButtonTemplate = () => (`
  <button class="films-list__show-more">Show more</button>
`);

export default class MoreButtonView {
  /**
   * @returns {string} Шаблон разметки.
   */
  getTemplate() {
    return createMoreButtonTemplate();
  }

  /**
   * @returns {nodeObject} DOM-узел разметки.
   */
  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  /**
   * Удаляет DOM-узел из объекта.
   */
  removeElement() {
    this.element = null;
  }
}
