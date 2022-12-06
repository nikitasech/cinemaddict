import AbstractView from './../framework/view/abstract-view.js';

const createControlsTemplate = (
  {isWatchlist, isWatched, isFavorite}, parent
) => {
  let activeClassName = '';

  switch (parent) {
    case 'card':
      activeClassName = 'film-card__controls-item--active';
      break;
    case 'details':
      activeClassName = 'film-details__control-button--active';
      break;
  }

  const watchlistClassName = isWatchlist ? activeClassName : '';
  const watchedClassName = isWatched ? activeClassName : '';
  const favoriteClassName = isFavorite ? activeClassName : '';

  const watchlistText = isWatchlist
    ? 'Not to watch'
    : 'Add to watchlist';
  const watchedText = isWatched
    ? 'Haven\'t watched'
    : 'Mark as watched';
  const favoriteText = isFavorite
    ? 'Don\'t favorite'
    : 'Add to favorites';

  const cardControlsTemplate = (`
    <div class="film-card__controls">
      <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button">${watchlistText}</button>
      <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">${watchedText}</button>
      <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">${favoriteText}</button>
    </div>
  `);

  const filmDetailsControlsTemplate = (`
    <section class="film-details__controls">
      <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlistClassName}" id="watchlist" name="watchlist">${watchlistText}</button>
      <button type="button" class="film-details__control-button film-details__control-button--watched ${watchedClassName}" id="watched" name="watched">${watchedText}</button>
      <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteClassName}" id="favorite" name="favorite">${favoriteText}</button>
    </section>
  `);

  switch (parent) {
    case 'card':
      return cardControlsTemplate;
    case 'details':
      return filmDetailsControlsTemplate;
  }
};

/**
 * Вью кнопок управления
 * @param {Object} state состояние элементов управления
 * @param {string} [rapent] родительский блок. 'card' или 'details'
 */
export default class FilmControlsView extends AbstractView {
  /** @type {Object} состояние элементов управления */
  #state = {};

  /** @type {string|null} родительский блок */
  #parent = null;

  constructor(state, rapent = 'card') {
    super();
    this.#parent = rapent;
    this.#state = {
      isWatchlist: state.watchlist,
      isWatched: state.alreadyWatched,
      isFavorite: state.favorite
    };
  }

  get template() {
    return createControlsTemplate(this.#state, this.#parent);
  }
}
