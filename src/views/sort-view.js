import {createElement} from '../render.js';

const createSortTemplate = () => (`
  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>
`);

/** Вью сортировки. */
export default class SortView {
  #element = null;

  /**
   * @returns {string} Шаблон разметки.
   */
  get template() {
    return createSortTemplate();
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
