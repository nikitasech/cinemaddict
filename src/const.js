/** Перечисление заголовков списка
 * @enum {string}
 * @readonly
 */
export const ListTitle = {
  LOADING: 'Loading...',
  ALL: 'All movies. Upcoming',
  TOP: 'Top rated',
  COMMENTED: 'Most commented',
  NO_FILMS: 'There are no movies in our database',
  NO_WATCHLIST: 'There are no movies to watch now',
  NO_HISTIRY: 'There are no watched movies now',
  NO_FAVORITES: 'There are no favorite movies now'
};

/** Перечисление типов элементов управления
 * @enum {string}
 * @readonly
 */
export const TypeControls = {
  CARD: 'card',
  DETAILS: 'details'
};

export const ControlName = {
  WATCHLIST: 'watchlist',
  WATCHED: 'watched',
  FAVORITE: 'favorite'
};

export const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITE: 'favorite'
};

/** Перечисление типов списка
 * @enum {string}
 * @readonly
 */
export const TypeList = {
  MAIN: 'main',
  EXTRA: 'extra'
};

/** Перечисление имен списка
 * @enum {string}
 * @readonly
 */
export const NameList = {
  MAIN: 'main',
  TOP: 'top',
  COMMENTED: 'commented'
};

/** Перечисление типов списка
 * @enum {string}
 * @readonly
 */
export const TypeSort = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
  COMMENTED: 'commented'
};

/** @type {Array} массив случайных имен */
export const names = [
  'Aelene Inglorion',
  'Fenella Ocallaghan',
  'Kevin Shan',
  'Reaghan Ennis',
  'Megan Jones',
  'Tom Ford',
  'Takeshi Kitano',
  'Morgan Freeman'
];

export const TypeAction = {
  UPDATE_FILM: 'update-film',
  UPDATE_FILTER: 'update-filter'
};

export const TypeUpdate = {
  PATCH: 'PATCH',
  MINOR: 'MINOR'
};

/** @type {Array} массив смайликов @readonly */
export const emojies = ['smile', 'sleeping', 'puke', 'angry'];
