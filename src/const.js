/**
 * Перечисление заголовков списка
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

/**
 * Перечисление типов элементов управления
 * @enum {string}
 * @readonly
 */
export const TypeControls = {
  CARD: 'card',
  DETAILS: 'details'
};

/**
 * Перечисление типов списка
 * @enum {string}
 * @readonly
 */
export const TypeList = {
  MAIN: 'main',
  EXTRA: 'extra'
};

/**
 * Перечисление типов списка
 * @enum {string}
 * @readonly
 */
export const TypeSort = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating'
};

/**
 * Перечисление количества добавляемых карточек за один шаг
 * @enum {number}
 * @readonly
 */
export const PortionCardCount = {
  MAIN: 5,
  EXTRA: 2
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
