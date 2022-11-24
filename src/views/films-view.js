import {createElement} from '../render.js';

const createFilmsTemplate = () => (`
  <section class="films"></section>
`);

/** Вью контейнера списков фильмов. */
export default class FilmsView {
  /**
   * @returns {string} Шаблон разметки.
   */
  getTemplate() {
    return createFilmsTemplate();
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
