import { FilterType, TypeAction, TypeUpdate } from '../const';
import { render, replace } from '../framework/render';
import FiltersView from '../views/filters-view';

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

  init = (container) => {
    const defaultActiveFilter = FilterType.ALL;
    this.#container = container;

    this.#render(defaultActiveFilter);
  };

  #render = (activeFilter) => {
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
        this.#filtersModel.updateItems(typeUpdate, payload);
        break;
    }
  };

  #filtersModelEventHandler = (typeUpdate, payload) => {
    switch (typeUpdate) {
      case TypeUpdate.MINOR:
        this.#render(payload);
        break;
    }
  };

  #viewActionHandler = (typeAction, typeUpdate, payload) => {
    switch (typeAction) {
      case TypeAction.UPDATE_FILTER:
        this.#filtersModel.changeActiveItem(typeUpdate, payload);
        break;
    }
  };
}
