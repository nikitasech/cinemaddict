import { TypeUpdate } from '../const.js';
import { render, replace } from '../framework/render';
import StatisticsView from '../views/statistics-view.js';

export class StatisticsPresenter {
  #containerElement;
  #filmsModel;
  #component;


  constructor(filmsModel) {
    this.#filmsModel = filmsModel;
    this.#filmsModel.addObserver(this.#modelEventHandler);
  }

  init = (container) => {
    this.#containerElement = container;
  };

  #modelEventHandler = (typeUpdate, payload) => {
    switch (typeUpdate) {
      case TypeUpdate.INIT:
        this.#render(payload.length);
        break;
    }
  };

  #render = (filmsCount) => {
    const prevComponent = this.#component;
    this.#component = new StatisticsView(filmsCount);

    if (!prevComponent) {
      render(this.#component, this.#containerElement);
    } else {
      replace(this.#component, prevComponent);
    }
  };
}
