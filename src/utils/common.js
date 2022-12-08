import dayjs from 'dayjs';

/**
 * Функция из интернета по генерации случайного числа из диапазона.
 * Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
 * @param {number} min минимальный порог
 * @param {number} max максимальный порог
 * @returns {number} случайное число из заданого диапазона
 */
export const getRandomNumber = (min, max) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

/**
 * Перемешивает массив по алгоритму Фишера - Йетса.
 * Подробнее - https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 * @param {Array} array массив для перемешивания
 * @returns {Array} перемешанный массив
 */
export const shuffleArray = (array) => {
  const newArray = array.slice();

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = getRandomNumber(0, i);

    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
};

/**
 * @param {string} date дата в формате ISO 8601
 * @returns {string} дата по шаблону
 */
export const formatIsoDate = (date, template) => dayjs(date).format(template);

/**
 * @param {number} runtime время в минутах
 * @returns {string} продолжительность фильма в формате "1h 3m"
 */
export const formatRuntime = (runtime) => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime - (hours * 60);

  return `${hours}h ${minutes}m`;
};

