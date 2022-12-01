import {createElement} from '../render.js';

const createStatisticsTemplate = () => (`
  <section class="footer__statistics">
    <p>130 291 movies inside</p>
  </section>
`);

/** Вью статистики количества фильмов на сервисе. */
export default class StatisticsView {
  #element = null;

  /**
   * @returns {string} Шаблон разметки.
   */
  get template() {
    return createStatisticsTemplate();
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
