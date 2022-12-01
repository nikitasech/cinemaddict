import {createElement} from '../render.js';

const createFilmsContainerTemplate = () => (`
    <div class="films-list__container"></div>
`);

/** Вью контейнера для фильмов в списке. */
export default class FilmsContainerView {
  #element = null;

  /**
   * @returns {string} Шаблон разметки.
   */
  getTemplate() {
    return createFilmsContainerTemplate();
  }

  /**
   * @returns {nodeObject} DOM-узел разметки.
   */
  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
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
