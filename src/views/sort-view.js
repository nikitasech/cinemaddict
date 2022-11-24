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
  /**
   * @returns {string} Шаблон разметки.
   */
  getTemplate() {
    return createSortTemplate();
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
