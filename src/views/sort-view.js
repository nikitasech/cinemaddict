import {TypeSort} from '../const.js';
import AbstractView from './../framework/view/abstract-view.js';

const createSortTemplate = (typeSort) => {
  const defaultSortClassName = (typeSort === TypeSort.DEFAULT)
    ? 'sort__button--active'
    : '';

  const dateSortClassName = (typeSort === TypeSort.DATE)
    ? 'sort__button--active'
    : '';

  const ratingSortClassName = (typeSort === TypeSort.RATING)
    ? 'sort__button--active'
    : '';

  return (`
    <ul class="sort">
      <li><a href="#" class="sort__button ${defaultSortClassName}" data-type-sort="default">Sort by default</a></li>
      <li><a href="#" class="sort__button ${dateSortClassName}" data-type-sort="date">Sort by date</a></li>
      <li><a href="#" class="sort__button ${ratingSortClassName}" data-type-sort="rating">Sort by rating</a></li>
    </ul>
  `);
};

/** Вью сортировки */
export default class SortView extends AbstractView {
  #typeSort = null;

  constructor(type) {
    super();
    this.#typeSort = type;
  }

  get template() {
    return createSortTemplate(this.#typeSort);
  }

  #sortClickHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.dataset.typeSort && evt.target.dataset.typeSort !== this.#typeSort) {
      this.#typeSort = evt.target.dataset.typeSort;

      this._callback.sortClick(this.#typeSort);
    }
  };

  setClickHandler = (sortCallback) => {
    this._callback.sortClick = sortCallback;

    this.element.addEventListener('click', this.#sortClickHandler);
  };
}
