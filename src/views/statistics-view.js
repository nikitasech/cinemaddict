import {createElement} from '../render.js';

const createStatisticsTemplate = () => (`
  <section class="footer__statistics">
    <p>130 291 movies inside</p>
  </section>
`);

/** Вью статистики количества фильмов на сервисе. */
export default class StatisticsView {
  /**
   * @returns {string} Шаблон разметки.
   */
  getTemplate() {
    return createStatisticsTemplate();
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
