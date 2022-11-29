import dayjs from 'dayjs';

/**
 * Функция из интернета по генерации случайного числа из диапазона.
 * Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
 * @param {number} min Минимальный порог.
 * @param {number} max Максимальный порог.
 * @returns {number} Случайное число из заданого диапазона.
 */
const getRandomNumber = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

/**
 * Перемешивает массив по алгоритму Фишера - Йетса.
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 * @param {array} array Массив для перемешивания.
 * @returns {array} Перемешанный массив.
 */
const shuffleArray = (array) => {
  const newArray = array.slice();

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = getRandomNumber(0, i);

    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
};

/**
 * @param {array} array Массив.
 * @returns Случайный элемент массива.
 */
const getRandomItem = (array) => array[getRandomNumber(0, array.length - 1)];

/**
 * @param {number} countWords Количество слов.
 * @returns {string} Случайный текст.
 */
const getRandomText = (countWords) => {
  const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

  return text
    .split(' ')
    .sort(() => getRandomNumber(-1, 1))
    .slice(0, countWords)
    .join(' ');
};

/**
 * @returns {string} Случайная дата в формате ISO 8601.
 */
const getRandomDate = () => {
  const year = getRandomNumber(1980, 2021);
  const mount = getRandomNumber(1, 12);
  const day = getRandomNumber(1, 28);
  const hour = getRandomNumber(1, 24);
  const minute = getRandomNumber(1, 59);

  const date = new Date(year, mount, day, hour, minute);

  return date.toISOString();
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

export {
  getRandomNumber,
  shuffleArray,
  getRandomItem,
  getRandomText,
  getRandomDate,
  formatIsoDate,
  formatRuntime
};
