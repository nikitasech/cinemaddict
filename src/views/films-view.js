import {createElement} from '../render.js';

const createFilmsTemplate = () => (`
  <section class="films"></section>
`);

/** Вью контейнера списков фильмов. */
export default class FilmsView {
  #element = null;

  /**
   * @returns {string} Шаблон разметки.
   */
  get template() {
    return createFilmsTemplate();
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
  removeElement = () => {
    this.#element = null;
  };
}
