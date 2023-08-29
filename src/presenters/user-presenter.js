import { TypeUpdate } from '../const.js';
import { render, replace } from '../framework/render.js';
import ProfileRatingView from '../views/profile-rating-view.js';

export default class UserPresenter {
  #container;
  #userModel;
  #filmsModel;
  #component;

  constructor(userModel, filmsModel) {
    this.#userModel = userModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#modelEventHandler);
  }

  init = (container) => {
    this.#container = container;
  };

  #modelEventHandler = (typeUpdate, payload) => {
    switch(typeUpdate) {
      case TypeUpdate.INIT:
        this.#render(this.#userModel.getRank(payload));
    }
  };

  #render = (rank) => {
    const prevComponent = this.#component;
    this.#component = new ProfileRatingView(rank);

    if (!rank) {
      return;
    }

    if (!prevComponent) {
      render(this.#component, this.#container);
    } else {
      replace(this.#component, prevComponent);
    }
  };
}
