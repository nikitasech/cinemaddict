import {
  getRandomItem,
  getRandomText,
  getRandomDate,
  getCounter
} from './../utils/mock.js';
import {getRandomNumber, shuffleArray} from './../utils/common.js';
import {names} from './../const.js';

const allComments = Array.from({length: 36}, (item, i) => i + 1);

const booleans = [true, false];

const titles = [
  'Made for each other', 'Popeye meets sinbad', 'Sagebrush trail',
  'Santa claus conquers the martians', 'The dance of life',
  'The great flamarion', 'The man with the golden arm'
];

const genres = [
  'Comedy', 'Action', 'Drama', 'Crime',
  'Horror', 'Fantasy', 'Romance', 'Thriller',
  'Animation', 'War', 'Documentary', 'Western'
];

const posters = [
  'images/posters/made-for-each-other.png',
  'images/posters/popeye-meets-sinbad.png',
  'images/posters/sagebrush-trail.jpg',
  'images/posters/santa-claus-conquers-the-martians.jpg',
  'images/posters/the-dance-of-life.jpg',
  'images/posters/the-great-flamarion.jpg',
  'images/posters/the-man-with-the-golden-arm.jpg',
];

const countries = [
  'Belize', 'The Republic of the Congo', 'El Salvador', 'Germany',
  'Honduras', 'Iraq', 'Libya', 'Luxembourg', 'Marshall Islands',
  'Mexico', 'Monaco', 'Nauru', 'Pakistan', 'Peru', 'Samoa',
  'Sudan', 'United Arab Emirates', 'The Democratic Republic of the Congo'
];

const getId = getCounter();
const getRating = () => `${getRandomNumber(0, 9)}.${getRandomNumber(0, 9)}`;

/**
 * @param {array} array Массив-основа.
 * @param {number} maxLength Максимальная длина нового массива.
 * @returns {array} Перемешанный массив-основа со случайной длиной.
 */
const getRandomArray = (array, maxLength) => shuffleArray(array)
  .slice(0, getRandomNumber(1, maxLength));

/**
 * @returns {object} Сгенерированный фильм.
 */
export const generateFilm = () => ({
  id: getId(),
  comments: getRandomArray(allComments, 10),
  info: {
    title: getRandomItem(titles),
    alternativeTitle: getRandomItem(titles),
    totalRating: getRating(),
    poster: getRandomItem(posters),
    ageRating: getRandomNumber(0, 21),
    director: getRandomItem(names),
    writers: getRandomArray(names, 5),
    actors: getRandomArray(names, 5),
    release: {
      date: getRandomDate(),
      country: getRandomItem(countries)
    },
    runtime: getRandomNumber(40, 120),
    genre: getRandomArray(genres, 5),
    description: getRandomText(getRandomNumber(30, 100))
  },
  userDetails: {
    watchlist: getRandomItem(booleans),
    alreadyWatched: getRandomItem(booleans),
    watchingDate: getRandomDate(),
    favorite: getRandomItem(booleans)
  }
});
