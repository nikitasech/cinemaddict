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

    this.#filmsModel.addObserver(this.#modelEventHandler);
    this.#filtersModel.addObserver(this.#modelEventHandler);
  }

  /** Инициализирует фильтры в нужный контейнер
   * @param {HTMLElement} container
   */
  init = (container) => {
    this.#container = container;
    this.#render();
  };

  #viewActionHandler = (typeAction, payload) => {
    switch (typeAction) {
      case TypeAction.UPDATE_FILTER:
        this.#filtersModel.activeItem = payload;
        break;
    }
  };

  #modelEventHandler = (typeUpdate) => {
    switch (typeUpdate) {
      case TypeUpdate.INIT:
        this.#modelEventHandler(TypeUpdate.PATCH);
        break;
      case TypeUpdate.PATCH:
        this.#filtersModel.setCounters(this.#filmsModel.items);
        this.#modelEventHandler(TypeUpdate.MINOR);
        break;
      case TypeUpdate.MINOR:
        this.#render();
        break;
    }
  };

  #render = () => {
    const filterCounters = this.#filtersModel.counters;
    const activeFilter = this.#filtersModel.activeItem;

    const prevFiltersComponent = this.#filtersComponent;
    this.#filtersComponent = new FiltersView(filterCounters, activeFilter);

    if (!prevFiltersComponent) {
      render(this.#filtersComponent, this.#container);
    } else {
      replace(this.#filtersComponent, prevFiltersComponent);
    }

    this.#filtersComponent.setClickHandler(this.#viewActionHandler);
  };
}
