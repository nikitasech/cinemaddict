import AbstractView from '../framework/view/abstract-view.js';

const createLoadMoreButtonTemplate = () => (`
  <button class="films-list__show-more">Show more</button>
`);

/** Вью кнопки "Load more" */
export default class LoadMoreButtonView extends AbstractView {
  get template() {
    return createLoadMoreButtonTemplate();
  }

  /**
   * Метод обработчика нажатия на кнопку "Load more"
   * @param {Object} evt объект события
   */
  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  /**
   * Устанавливает обработчик событий на клик по кнопке "Load more"
   * @param {Function} callback функция для выполнения после выявления события
   */
  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };
}
