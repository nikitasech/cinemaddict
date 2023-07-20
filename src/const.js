/** Перечисление заголовков списка @readonly @enum {string} */
export const ListTitle = {
  'all': 'All movies. Upcoming',
  'watchlist': 'Watchlist movies. Upcoming',
  'history': 'History movies. Upcoming',
  'favorite': 'Favorite movies. Upcoming',
  'rating': 'Top rated',
  'commented': 'Most commented'
};

/** Перечисление заголовков списка при отсутсвии фильмов @readonly @enum {string} */
export const NoFilmsListTitle = {
  'loading': 'Loading...',
  'all': 'There are no movies in our database',
  'watchlist': 'There are no movies to watch now',
  'history': 'There are no watched movies now',
  'favorite': 'There are no favorite movies now'
};

/** Перечисление типов элементов управления @readonly @enum {string} */
export const TypeControl = {
  CARD: 'card',
  DETAILS: 'details'
};

/** Перечисление типов списка @readonly @enum {string} */
export const TypeList = {
  MAIN: 'all',
  EXTRA: 'extra'
};

export const TypeFilter = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITE: 'favorite'
};

/** Перечисление типов сортировки @readonly @enum {string} */
export const TypeSort = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
  COMMENTED: 'commented'
};

/** Перечисление типов действий пользователя @readonly @enum {string} */
export const TypeAction = {
  UPDATE_FILM: 'update-film',
  UPDATE_FILTER: 'update-filter',
  REMOVE_COMMENT: 'remove-comment',
  ADD_COMMENT: 'add-comment',
  SORT: 'sort'
};

/** Перечисление типов обновления экрана @readonly @enum {string} */
export const TypeUpdate = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MOJOR: 'MAJOR',
  INIT: 'INIT'
};

/** Перечисление типов HTTP=запросов @readonly @enum {string} */
export const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
};

/** Перечисление имен элементов управления фильмом @readonly @enum {string} */
export const NameControl = {
  WATCHLIST: 'watchlist',
  WATCHED: 'watched',
  FAVORITE: 'favorite'
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

/** @type {Array} массив смайликов @readonly */
export const emojies = ['smile', 'sleeping', 'puke', 'angry'];
