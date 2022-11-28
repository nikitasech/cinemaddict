import {getRandomInt, getRandomItem, getRandomText, getRandomDate} from '../utils.js';
import {names} from './../const.js';

const getCommentText = () => getRandomText(getRandomInt(8, 20));


const getCounterId = () => {
  let id = 0;

  return () => id++;
};

const getId = getCounterId();

const getRandomEmotion = () => {
  const emotions = [
    'angry',
    'puke',
    'sleeping',
    'smile',
  ];

  return emotions[getRandomInt(0, emotions.length - 1)];
};

export const generateComment = () => ({
  id: getId(),
  author: getRandomItem(names),
  comment: getCommentText(),
  date: getRandomDate(),
  emotion: getRandomEmotion()
});
