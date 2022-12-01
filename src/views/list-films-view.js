import {createElement} from '../render.js';

const createListTemplate = (title, type) => {
  const listTypeClassName = (type === 'extra')
    ? 'films-list--extra'
    : '';

  return (`
    <section class="films-list ${listTypeClassName}">
      <h2 class="films-list__title">${title}</h2>
    </section>
  `);
};

/**
 * Вью списка фильмов. По умолчанию создается 'main' список.
*/
export default class ListFilmsView {
  #element = null;
  #title = null;
  #type = null;

  /**
   * @param {string} [title] Заголовок компонента.
   * @param {string=} [type] Тип списка. Может быть 'main' или 'extra'.
   */
  constructor(title, type = 'main') {
    this.#title = title;
    this.#type = type;
  }

  /**
   * @returns {string} Шаблон разметки.
   */
  get template() {
    return createListTemplate(this.#title, this.#type);
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

  /**
   * Изменяет заголовок списка фильмов.
   * @param {nodeObject} listElement DOM-элемент списка фильмов.
   * @param {string} title Новый заголовок.
   * @param {boolean=} isHide Скрыть заголовок?
   */
  changeTitle(title) {
    const titleElement = this.#element
      .querySelector('.films-list__title');

    titleElement.textContent = title;
  }

  /** Переключает скрытие заголовка. */
  toggleHidingTitle() {
    const titleElement = this.#element
      .querySelector('.films-list__title');

    titleElement.classList.toggle('visually-hidden');
  }
}
