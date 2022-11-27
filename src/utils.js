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
 * @returns {string} Дата по шаблону.
 */
const formatIsoDate = (date, template) => dayjs(date).format(template);

/**
 * @param {number} runtime Время в минутах.
 * @returns {string} Продолжительность фильма в формате "1h 3m".
 */
const formatRuntime = (runtime) => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime - (hours * 60);

  return `${hours}h ${minutes}m`;
};

/**
 * @returns {string} Случайное имя.
 */
const getRandomName = () => {
  const names = [
    'Aelene Inglorion',
    'Fenella Ocallaghan',
    'Kevin Shan',
    'Reaghan Ennis',
    'Megan Jones'
  ];

  return names[getRandomInt(0, names.length - 1)];
};

export {getRandomInt, formatIsoDate, formatRuntime, getRandomName};
