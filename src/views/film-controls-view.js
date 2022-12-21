import AbstractView from './../framework/view/abstract-view.js';
import createDetailsControlsTemplate from './templates/details-controls-template.js';
import createCardControlsTemplate from './templates/card-controls-template.js';

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
  #parent = null;

  constructor(state, rapent = 'card') {
    super();
    this.#state = {
      isWatchlist: state.watchlist,
      isWatched: state.alreadyWatched,
      isFavorite: state.favorite
    };
    this.#parent = rapent;

    switch (rapent) {
      case 'card':
        this.#activeClassName = 'film-card__controls-item--active';
        break;
      case 'details':
        this.#activeClassName = 'film-details__control-button--active';
        break;
      default:
        throw Error('Передан неправильный родитель');
    }
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

    return (this.#parent === 'details')
      ? createDetailsControlsTemplate(ClassName, Text)
      : createCardControlsTemplate(ClassName, Text);
  }

  toggleWatchlistControl = () => {
    this.element
      .querySelector('[class=*"watchlist"]')
      .classList.toggle(this.#activeClassName);
  };

  toggleWatchedControl = () => {
    this.element
      .querySelector('[class=*"watched"]')
      .classList.toggle(this.#activeClassName);
  };

  toggleFavoriteControl = () => {
    this.element
      .querySelector('[class=*"favorite"]')
      .classList.toggle(this.#activeClassName);
  };

  setWatchlistClickHandler = () => {
    this.toggleWatchedControl();
    // callback();
  };
}
