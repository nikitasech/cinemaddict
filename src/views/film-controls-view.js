import AbstractView from './../framework/view/abstract-view.js';
import createDetailsControlsTemplate from './templates/details-controls-template.js';
import createCardControlsTemplate from './templates/card-controls-template.js';
import {TypeControl, NameControl} from './../const.js';

const activeClassName = new Map([
  ['card', 'film-card__controls-item--active'],
  ['details', 'film-details__control-button--active']
]);

const getWatchlistText = (isWatchlist) => isWatchlist
  ? 'Not to watch'
  : 'Add to watchlist';

const getWatchedText = (isWatched) => isWatched
  ? 'Haven\'t watched'
  : 'Mark as watched';

const getFavoriteText = (isFavorite) => isFavorite
  ? 'Don\'t favorite'
  : 'Add to favorites';

/**
 * Вью кнопок управления
 * @param {Object} state состояние элементов управления
 * @param {string} [rapent] родительский блок. 'card' или 'details'
 */
export default class FilmControlsView extends AbstractView {
  #state = {};
  #activeClassName = null;
  #type = null;

  constructor(state, type) {
    super();
    this.#state = {
      isWatchlist: state.watchlist,
      isWatched: state.alreadyWatched,
      isFavorite: state.favorite
    };

    for (const value of Object.values(TypeControl)) {
      if (type === value) {
        this.#type = type;
        this.#activeClassName = activeClassName.get(value);
        return;
      }
    }

    throw Error('Incorrect controls type specified');
  }

  get template() {
    const className = {
      watchlist: this.#state.isWatchlist ? this.#activeClassName : '',
      watched: this.#state.isWatched ? this.#activeClassName : '',
      favorite: this.#state.isFavorite ? this.#activeClassName : ''
    };

    const Text = {
      watchlist: getWatchlistText(this.#state.isWatchlist),
      watched: getWatchedText(this.#state.isWatched),
      favorite: getFavoriteText(this.#state.isFavorite)
    };

    return (this.#type === TypeControl.DETAILS)
      ? createDetailsControlsTemplate(className, Text)
      : createCardControlsTemplate(className, Text);
  }

  /** Устанавливает обработчик событий на клик по одной из кнопок управления
   * @param {Function} callback функция для выполнения после выявления события
   */
  setClickHandler = (clickHandler) => {
    this._callback.clickHandler = clickHandler;

    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();

    const controlClassesString = evt.target.classList.value;

    Object.values(NameControl).forEach((value) => {
      if (controlClassesString.indexOf(value) !== -1) {
        this._callback.clickHandler(value);
      }
    });
  };
}
