import { TypeUpdate } from './../const.js';
import { remove, render, replace } from './../framework/render.js';
import ProfileRatingView from './../views/profile-rating-view.js';

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
        break;
      case TypeUpdate.PATCH:
        this.#render(this.#userModel.getRank(this.#filmsModel.items));
    }
  };

  #render = (rank) => {
    if (!rank) {
      if (this.#component) {
        remove(this.#component);
        this.#component = null;
      }

      return;
    }

    const prevComponent = this.#component;
    this.#component = new ProfileRatingView(rank);

    if (!prevComponent) {
      render(this.#component, this.#container);
    } else {
      replace(this.#component, prevComponent);
    }
  };
}
