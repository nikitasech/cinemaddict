import dayjs from 'dayjs';

/**
 * Функция из интернета по генерации случайного числа из диапазона.
 * Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
 * @param {number} min Минимальный порог.
 * @param {number} max Максимальный порог.
 * @returns {number} Случайное число из заданого диапазона.
 */
const getRandomInt = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

/**
 * @param {string} date Дата в формате ISO 8601.
 * @returns {string} Год в формате "2001".
 */
const formatReleaseYear = (date) => dayjs(date).format('YYYY');

/**
 * @param {string} date Дата в формате ISO 8601.
 * @returns {string} Дата в формате "30 Мая 2013".
 */
const formatReleaseDate = (date) => dayjs(date).format('DD MMMM YYYY');

/**
 * @param {number} runtime Время в минутах.
 * @returns {string} Продолжительность фильма в формате "1h 3m".
 */
const formatRuntime = (runtime) => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime - (hours * 60);

  return `${hours}h ${minutes}m`;
};

export {getRandomInt, formatReleaseYear, formatReleaseDate, formatRuntime};
