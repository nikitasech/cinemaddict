import AbstractView from './../framework/view/abstract-view.js';
import {capitalizeFirstLetter} from '../utils/common.js';
import { FilterType, TypeAction, TypeUpdate } from '../const.js';

const createFiltersTemplate = (filters, activeFilter) => {
  const allFilterClassName = activeFilter === FilterType.ALL
    ? 'main-navigation__item--active'
    : '';

  const linksTemplate = filters.reduce((accumulator, item) => {
    const currentFilterClassName = item.name === activeFilter
      ? 'main-navigation__item--active'
      : '';

    const link = (`
      <a href="#${item.name}" class="main-navigation__item ${currentFilterClassName}">
        ${capitalizeFirstLetter(item.name)}
        <span class="main-navigation__item-count">${item.count}</span>
      </a>
    `);

    return accumulator + link;
  }, '');

  return (`
    <nav class="main-navigation">
      <a href="#all" class="main-navigation__item ${allFilterClassName}">All movies</a>
      ${linksTemplate}
    </nav>
  `);
};

/** Вью фильтров */
export default class FiltersView extends AbstractView {
  #filters = {};
  #activeFilter = null;

  constructor(filters, activeFilter) {
    super();
    this.#filters = filters;
    this.#activeFilter = activeFilter;
  }

  #clickHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.classList.contains('main-navigation__item')
    && !evt.target.href.includes(this.#activeFilter)) {
      const nameClickFilter = evt.target.href.split('#').pop();
      this._callback.click(TypeAction.UPDATE_FILTER, TypeUpdate.MINOR, nameClickFilter);
    }
  };

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  get template() {
    return createFiltersTemplate(this.#filters, this.#activeFilter);
  }
}
