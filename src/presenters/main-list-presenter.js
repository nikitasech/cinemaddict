import { render } from './../framework/render.js';
import ButtonMoreView from './../views/load-more-button-view.js';
import { TypeList } from './../const.js';
import ListPresenter from './list-presenter.js';

const IS_TITLE_HIDDEN = true;

/**
 * Дочерний презентер {@link FilmsPresenter}, управляющий главным
 * списком фильмов и презентерами карточек фильмов ({@link CardPresenter})
 */
export default class MainListPresenter extends ListPresenter {
  #loadMoreButtonComponent = null;
  #portionCards = 5;
  #renderedCardCount = 0;
  #filmsLength = 0;

  constructor(...args) {
    super(...args);
    this.#portionCards = (this._type === TypeList.MAIN) ? 5 : 2;
  }

  /** Инициализирует список фильмов
   * @param {Array} films список фильмов
   * @param {string} titleText заголовок списка
   * @param {Boolean} isResetCounter обновлять счетчик отрисованных фильмов?
   */
  init = (titleText, films = {}, isResetCounter = true) => {
    const portionCards = isResetCounter || !this.#renderedCardCount
      ? this.#portionCards
      : this.#renderedCardCount;

    this._films = films;
    this._title = titleText;
    this._reset();
    this._render(films, titleText, portionCards);
  };

  _reset = () => {
    this._cardPresenter.clear();
    this.#loadMoreButtonComponent = null;
    this.#renderedCardCount = 0;
    this.#filmsLength = this._films.length;
  };

  _render = (films, titleText, portionCards) => {
    this._renderList();
    this._renderTitle(titleText, films.length
      ? IS_TITLE_HIDDEN
      : !IS_TITLE_HIDDEN);

    if (films.length) {
      this._renderFilmsContainer();
      this.#renderPortionCards(portionCards);
    }
  };

  #renderPortionCards = (portion = this.#portionCards) => {
    const first = this.#renderedCardCount;
    const last = Math.min(first + portion, this.#filmsLength);
    this.#renderedCardCount = last;

    this._renderCards(this._films.slice(first, last));

    if (this._type === TypeList.MAIN) {
      this.#renderLoadMoreButton();
    }
  };

  #renderLoadMoreButton = () => {
    const component = this.#loadMoreButtonComponent;

    if (component && this.#renderedCardCount >= this.#filmsLength) {
      component.element.remove();
      this.#loadMoreButtonComponent = null;
    } else if (!component && this.#renderedCardCount !== this.#filmsLength) {
      this.#loadMoreButtonComponent = new ButtonMoreView();
      render(this.#loadMoreButtonComponent, this._listComponent.element);
      this.#loadMoreButtonComponent.setClickHandler(this.#renderPortionCards);
    }
  };
}
