import AbstractView from './../framework/view/abstract-view.js';

const createListFilmsTitleTemplate = (title, isHidden) => {
  const listHiddenClassList = !isHidden
    ? 'visually-hidden'
    : '';

  return (`
    <h2 class="films-list__title ${listHiddenClassList}">${title}</h2>
  `);
};

/**
 * Представление заголовка для {@link ListFilmsView}
 * @param {string} title текст заголовка
 * @param {Boolean} isHidden нужно ли скрыть заголовок
*/
export default class ListFilmsTitleView extends AbstractView {
  /** @type {string} заголовок компонента */
  #title = null;

  /** @type {Boolean} нужно ли скрыть заголовок */
  #isHidden = null;

  constructor(title, isHidden) {
    super();
    this.#title = title;
    this.#isHidden = isHidden;
  }

  get template() {
    return createListFilmsTitleTemplate(this.#title, this.#isHidden);
  }
}
