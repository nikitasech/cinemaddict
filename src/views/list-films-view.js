import AbstractView from './../framework/view/abstract-view.js';
import createFilmsContainerTemplate from './templates/films-container-template.js';

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
 * @param {string} [type] тип списка. 'main' (по умолчанию) или 'extra'
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
   * Геттер для получения контайнера для фильмов
   * @returns {HTMLElement} контейнер для фильмов
   */
  get containerElement() {
    return this.element.querySelector('.films-list__container');
  }

  /** Вставляет контейнер для фильмов в список */
  insertFilmsContainer = () => {
    this.element.insertAdjacentHTML('beforeend', createFilmsContainerTemplate());
  };

  /**
   * Изменяет заголовок списка фильмов
   * @param {string} newTitle новый заголовок
   */
  changeTitle(newTitle) {
    this.element
      .querySelector('.films-list__title')
      .textContent = newTitle;
  }

  /** Скрывает заголовок */
  hideTitle = () => {
    this.element
      .querySelector('.films-list__title')
      .classList.add('visually-hidden');
  };
}
