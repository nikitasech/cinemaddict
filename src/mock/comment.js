import {
  getRandomNumber,
  getRandomItem,
  getRandomText,
  getRandomDate,
  getCounter
} from '../utils.js';
import {names} from './../const.js';

const emotions = [
  'angry',
  'puke',
  'sleeping',
  'smile',
];

const getId = getCounter();
const getCommentText = () => getRandomText(getRandomNumber(8, 20));

/**
 * @returns {object} Сгенерированный комментарий.
 */
export const generateComment = () => ({
  id: getId(),
  author: getRandomItem(names),
  comment: getCommentText(),
  date: getRandomDate(),
  emotion: getRandomItem(emotions)
});
