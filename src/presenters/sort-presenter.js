import { TypeAction, TypeUpdate } from './../const.js';
import { render, replace } from './../framework/render.js';
import SortView from './../views/sort-view.js';

/** Презентер управляющий сортировкой
 * @param {Object} sortModel {@link SortModel}
 */
export default class SortPresenter {
  #containerElement = null;
  #model = null;
  #component = null;

  constructor(sortModel) {
    this.#model = sortModel;
    this.#model.addObserver(this.#modelEventHandler);
  }

  /** Инициализирует сортировку в нужный контейнер
   * @param {HTMLElement} container
   */
  init = (container) => {
    this.#containerElement = container;
    this.#render(this.#model.activeItem);
  };

  #render = (type) => {
    const prevComponent = this.#component;
    this.#component = new SortView(type);

    if (!prevComponent) {
      render(this.#component, this.#containerElement);
    } else {
      replace(this.#component, prevComponent);
    }

    this.#component.setClickHandler(this.#viewActionHandler);
  };

  #viewActionHandler = (typeAction, payload) => {
    switch (typeAction) {
      case TypeAction.SORT:
        this.#model.activeItem = payload;
    }
  };

  #modelEventHandler = (typeUpdate, payload) => {
    switch (typeUpdate) {
      case TypeUpdate.MINOR:
        this.#render(payload);
    }
  };
}
