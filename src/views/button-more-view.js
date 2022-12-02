import {createElement} from '../render.js';

const createMoreButtonTemplate = () => (`
  <button class="films-list__show-more">Show more</button>
`);

/** Вью кнопки "Load more". */
export default class ButtonMoreView {
  #element = null;

  /**
   * @returns {string} Шаблон разметки.
   */
  get template() {
    return createMoreButtonTemplate();
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

  toggleHiding() {
    this.#element.setAttribute('hidden', 'true');
  }

  /**
   * Удаляет DOM-узел из объекта.
   */
  removeElement() {
    this.#element = null;
  }
}
