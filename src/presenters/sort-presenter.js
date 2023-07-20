import { TypeAction, TypeUpdate } from './../const.js';
import { RenderPosition, remove, render, replace } from './../framework/render.js';
import SortView from './../views/sort-view.js';

/** Презентер управляющий сортировкой
 * @param {Object} sortModel {@link SortModel}
 */
export default class SortPresenter {
  #containerElement = null;
  #model = null;
  #component = null;

  constructor(filmsModel, sortModel) {
    this.#model = sortModel;
    filmsModel.addObserver(this.#modelEventHandler);
    this.#model.addObserver(this.#modelEventHandler);
  }

  /** Инициализирует сортировку в нужный контейнер
   * @param {HTMLElement} container
   */
  init = (container) => {
    this.#containerElement = container;
    this.#render(this.#model.activeItem);
  };

  remove = () => {
    remove(this.#component);
    this.#component = null;
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

  #render = (type) => {
    const prevComponent = this.#component;
    this.#component = new SortView(type);

    if (!prevComponent) {
      render(this.#component, this.#containerElement, RenderPosition.AFTERBEGIN);
    } else {
      replace(this.#component, prevComponent);
    }

    this.#component.setClickHandler(this.#viewActionHandler);
  };
}
