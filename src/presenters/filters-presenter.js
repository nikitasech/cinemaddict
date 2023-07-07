import { TypeAction, TypeUpdate } from './../const.js';
import { render, replace } from './../framework/render.js';
import FiltersView from './../views/filters-view.js';

/** Презентер управляющий фильтрами
 * @param {Object} filmsModel {@link FilmsModel}
 * @param {Object} filtersModel {@link FiltersModel}
 */
export default class FiltersPresenter {
  #container = null;
  #filmsModel = null;
  #filtersModel = null;

  #filtersComponent = null;

  constructor(filmsModel, filtersModel) {
    this.#filmsModel = filmsModel;
    this.#filtersModel = filtersModel;

    this.#filmsModel.addObserver(this.#filmsModelEventHandler);
    this.#filtersModel.addObserver(this.#filtersModelEventHandler);
  }

  /** Инициализирует фильтры в нужный контейнер
   * @param {HTMLElement} container
   */
  init = (container) => {
    this.#container = container;

    this.#render();
  };

  #render = () => {
    const activeFilter = this.#filtersModel.activeItem;
    const filters = Object
      .entries(this.#filtersModel.items)
      .map(([name, films]) => ({name, count: films.length}));

    const prevFiltersComponent = this.#filtersComponent;
    this.#filtersComponent = new FiltersView(filters, activeFilter);

    if (!prevFiltersComponent) {
      render(this.#filtersComponent, this.#container);
    } else {
      replace(this.#filtersComponent, prevFiltersComponent);
    }

    this.#filtersComponent.setClickHandler(this.#viewActionHandler);
  };

  #filmsModelEventHandler = (typeUpdate, payload) => {
    switch (typeUpdate) {
      case TypeUpdate.PATCH:
        this.#filtersModel.updateCounters(typeUpdate, payload);
        break;
    }
  };

  #filtersModelEventHandler = (typeUpdate) => {
    switch (typeUpdate) {
      case TypeUpdate.PATCH:
        this.#render();
        break;
      case TypeUpdate.MINOR:
        this.#render();
        break;
    }
  };

  #viewActionHandler = (typeAction, payload) => {
    switch (typeAction) {
      case TypeAction.UPDATE_FILTER:
        this.#filtersModel.activeItem = payload;
        break;
    }
  };
}
