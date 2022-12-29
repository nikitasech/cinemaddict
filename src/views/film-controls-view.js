import AbstractView from './../framework/view/abstract-view.js';
import createDetailsControlsTemplate from './templates/details-controls-template.js';
import createCardControlsTemplate from './templates/card-controls-template.js';
import {TypeControls} from './../const.js';

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
  /** @type {Object} состояние элементов управления */
  #state = {};

  /** @type {string|null} класс активированной кнопки управления */
  #activeClassName = null;

  /** @type {string|null} родитель жлементов управления */
  #type = null;

  constructor(state, type) {
    super();
    this.#state = {
      isWatchlist: state.watchlist,
      isWatched: state.alreadyWatched,
      isFavorite: state.favorite
    };

    for (const value of Object.values(TypeControls)) {
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

    return (this.#type === TypeControls.DETAILS)
      ? createDetailsControlsTemplate(className, Text)
      : createCardControlsTemplate(className, Text);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();

    const controlClassesString = evt.target.classList.value;

    /* Вы можете меня бить за эту индусскую
    реализацию, но мне она нравится! */
    switch (true) {
      case /watchlist/.test(controlClassesString):
        this._callback.watchlistClick();
        break;
      case /watched/.test(controlClassesString):
        this._callback.watchedClick();
        break;
      case /favorite/.test(controlClassesString):
        this._callback.favoriteClick();
        break;
    }
  };

  setClickHandler = (watchlistCallback, watchedCallback, favoriteCallback) => {
    this._callback.watchlistClick = watchlistCallback;
    this._callback.watchedClick = watchedCallback;
    this._callback.favoriteClick = favoriteCallback;

    this.element.addEventListener('click', this.#clickHandler);
  };
}
