import {createElement} from '../render.js';

const createListTemplate = (title, type) => (`
  <section class="films-list ${(type === 'extra') ? 'films-list--extra' : ''}">
    <h2 class="films-list__title">${title}</h2>
  </section>
`);

/**
 * Вью списка фильмов. По умолчанию создается 'main' список.
*/
export default class ListFilmsView {
  /**
   * @param {string} [title] Заголовок компонента.
   * @param {string=} [type] Тип списка. Может быть 'main' или 'extra'.
   */
  constructor(title, type = 'main') {
    this.title = title;
    this.type = type;
  }

  /**
   * @returns {string} Шаблон разметки.
   */
  getTemplate() {
    return createListTemplate(this.title, this.type);
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
