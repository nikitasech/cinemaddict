import { TypeList } from './../const.js';
import AbstractView from './../framework/view/abstract-view.js';

const createListFilmsTemplate = (type) => {
  const listTypeClassName = (type !== TypeList.MAIN)
    ? `films-list--${type}`
    : '';

  return (`
    <section class="films-list ${listTypeClassName}"></section>
  `);
};

/**
 * Представление списка фильмов
 * @param {string} [type] тип списка. 'main' или 'extra'
*/
export default class ListFilmsView extends AbstractView {
  #type = null;

  constructor(type) {
    super();

    for (const value of Object.values(TypeList)) {
      if (type === value) {
        this.#type = type;
        return;
      }
    }

    throw Error('Incorrect list type specified');
  }

  get template() {
    return createListFilmsTemplate(this.#type);
  }
}
