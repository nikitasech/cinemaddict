import {getRandomInt, shuffleArray, getRandomItem, getRandomText, getRandomDate} from './../utils.js';
import {names} from './../const.js';

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

const comments = Array.from({length: 36}, (item, i) => i + 1);

const getRandomArray = (array, maxLength) => shuffleArray(array)
  .slice(0, getRandomInt(1, maxLength));

export const generateFilm = () => ({
  id: 0,
  comments: getRandomArray(comments, 10),
  info: {
    title: getRandomItem(titles),
    alternativeTitle: getRandomItem(titles),
    totalRating: `${getRandomInt(0, 9)}.${getRandomInt(0, 9)}`,
    poster: getRandomItem(posters),
    ageRating: getRandomInt(0, 21),
    director: getRandomItem(names),
    writers: getRandomArray(names, 5),
    actors: getRandomArray(names, 5),
    release: {
      date: getRandomDate(),
      country: getRandomItem(countries)
    },
    runtime: getRandomInt(40, 120),
    genre: getRandomArray(genres, 5),
    description: getRandomText(getRandomInt(30, 100))
  },
  userDetails: {
    watchlist: getRandomItem([true, false]),
    alreadyWatched: getRandomItem([true, false]),
    watchingDate: getRandomDate(),
    favorite: getRandomItem([true, false])
  }
});
