import {getRandomInt, getRandomName} from '../utils.js';

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
  author: getRandomName(),
  comment: 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  date: '2019-05-11T16:12:32.554Z',
  emotion: getRandomEmotion()
});
