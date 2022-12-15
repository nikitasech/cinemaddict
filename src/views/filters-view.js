import AbstractView from './../framework/view/abstract-view.js';
import {capitalizeFirstLetter} from '../utils/common.js';

const createFiltersTemplate = (filters) => {
  const linksTemplate = filters.reduce((accumulator, item) => {
    const link = (`
      <a href="#${item.name}" class="main-navigation__item">
        ${capitalizeFirstLetter(item.name)}
        <span class="main-navigation__item-count">${item.count}</span>
      </a>
    `);

    return accumulator + link;
  }, '');

  return (`
    <nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${linksTemplate}
    </nav>
  `);
};

/** Вью фильтров */
export default class FiltersView extends AbstractView {
  #filters = {};

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }
}
