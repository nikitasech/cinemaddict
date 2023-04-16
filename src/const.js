/** Перечисление заголовков списка
 * @enum {string}
 * @readonly
 */
export const ListTitle = {
  LOADING: 'Loading...',
  'all': 'All movies. Upcoming',
  'watchlist': 'Watchlist movies. Upcoming',
  'history': 'History movies. Upcoming',
  'favorite': 'Favorite movies. Upcoming',
  'rating': 'Top rated',
  'commented': 'Most commented'
};

/** Перечисление заголовков списка при отсутсвии фильмов
 * @enum {string}
 * @readonly
 */
export const NoFilmsListTitle = {
  'main': 'There are no movies in our database',
  'watchlist': 'There are no movies to watch now',
  'history': 'There are no watched movies now',
  'favorite': 'There are no favorite movies now'
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
  MAIN: 'all',
  EXTRA: 'extra'
};

export const typeListMap = {
  'all': TypeList.MAIN,
  'watchlist': TypeList.MAIN,
  'history': TypeList.MAIN,
  'favorite': TypeList.MAIN,
  'rating': TypeList.EXTRA,
  'commented': TypeList.EXTRA
};

/** Перечисление имен списка
 * @enum {string}
 * @readonly
 */
export const NameList = {
  MAIN: 'all',
  TOP: 'rating',
  COMMENTED: 'commented',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITE: 'favorite'
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
