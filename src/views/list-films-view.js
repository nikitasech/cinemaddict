import AbstractView from './../framework/view/abstract-view.js';

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
 * Вью списка фильмов
 * @param {string} title заголовок компонента
 * @param {string} [type] тип списка. Может быть 'main' (по умолчанию) или 'extra'
*/
export default class ListFilmsView extends AbstractView {
  /** @type {string} заголовок компонента */
  #title = null;

  /** @type {string} тип списка */
  #type = null;

  constructor(title, type = 'main') {
    super();
    this.#title = title;
    this.#type = type;
  }

  get template() {
    return createListTemplate(this.#title, this.#type);
  }

  /**
   * Изменяет заголовок списка фильмов
   * @param {string} title новый заголовок
   */
  changeTitle(title) {
    this.element
      .querySelector('.films-list__title')
      .textContent = title;
  }

  /** Переключает скрытие заголовка. */
  toggleHidingTitle = () => {
    this.element
      .querySelector('.films-list__title')
      .classList.toggle('visually-hidden');
  };
}
