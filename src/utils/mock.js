import {getRandomNumber} from './common.js';

/**
 * @param {Array} array массив, из которого нужно выбрать случайный элемент
 * @returns случайный элемент массива
 */
export const getRandomItem = (array) => array[getRandomNumber(0, array.length - 1)];

/**
 * @param {number} countWords количество слов
 * @returns {string} случайный текст
 */
export const getRandomText = (countWords) => {
  const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

  return text
    .split(' ')
    .sort(() => getRandomNumber(-1, 1))
    .slice(0, countWords)
    .join(' ');
};

/**
 * @returns {string} случайная дата в формате ISO 8601
 */
export const getRandomDate = () => {
  const year = getRandomNumber(1980, 2021);
  const mount = getRandomNumber(1, 12);
  const day = getRandomNumber(1, 28);
  const hour = getRandomNumber(1, 24);
  const minute = getRandomNumber(1, 59);

  const date = new Date(year, mount, day, hour, minute);

  return date.toISOString();
};

/**
 * Возвращает функцию счетчика, при вызове
 * которой изначальное число увеличинается на 1
 * @param {number} [initial] начальное значение счетчика
 * @returns функция увеличения числа
 */
export const getCounter = (initial = 0) => {
  let count = initial;

  return () => count++;
};
