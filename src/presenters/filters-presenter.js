import { TypeUpdate } from '../const';
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
    this.#container = container;
    const filters = Object
      .entries(this.#filtersModel.items)
      .map(([name, films]) => ({name, count: films.length}));

    this.#render(filters);
  };

  #render = (filters) => {
    const prevFiltersComponent = this.#filtersComponent;
    this.#filtersComponent = new FiltersView(filters);

    if (!prevFiltersComponent) {
      render(this.#filtersComponent, this.#container);
    } else {
      replace(this.#filtersComponent, prevFiltersComponent);
    }
  };

  #filmsModelEventHandler = (typeUpdate, payload) => {
    switch (typeUpdate) {
      case TypeUpdate.PATCH:
        this.#filtersModel.updateItems(typeUpdate, payload);
        break;
    }
  };

  #filtersModelEventHandler = (typeUpdate) => {
    switch (typeUpdate) {
      case TypeUpdate.PATCH:
        this.init(this.#container);
        break;
    }
  };

  // #viewActionHandler = (typeAction, typeUpdate, payload) => {

  // };
}
