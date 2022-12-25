import AbstractView from './../framework/view/abstract-view.js';
import createDetailsControlsTemplate from './templates/details-controls-template.js';
import createCardControlsTemplate from './templates/card-controls-template.js';
import {TypeControls} from './../const.js';

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
        return;
      }
    }

    throw Error('Incorrect controls type specified');
  }

  get template() {
    const ClassName = {
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
      ? createDetailsControlsTemplate(ClassName, Text)
      : createCardControlsTemplate(ClassName, Text);
  }
}
