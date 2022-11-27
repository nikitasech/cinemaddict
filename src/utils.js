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
 * Перемешивает массив по алгоритму Фишера - Йетса.
 * WARNING: Перемешивает переданный массив!
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 * @param {array} array Массив для перемешивания.
 * @returns {array} Ссылка на перемешанный массив.
 */
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i);

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
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

export {getRandomInt, shuffleArray, formatIsoDate, formatRuntime, getRandomName};
