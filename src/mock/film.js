import { getRandomInt } from '../utils.js';

const getRandomTitle = () => {
  const titles = [
    'Made for each other',
    'Popeye meets sinbad',
    'Sagebrush trail',
    'Santa claus conquers the tartians',
    'The dance of life',
    'The great flamarion',
    'The man with the golden arm'
  ];

  return titles[getRandomInt(1, 7)];
};

export const generateFilm = () => ({
  id: 0,
  comments: [
    1, 6
  ],
  filmInfo: {
    title: getRandomTitle(),
    alternativeTitle: getRandomTitle(),
    totalRating: `${getRandomInt(0, 9)}.${getRandomInt(0, 9)}`,
    poster: 'images/posters/blue-blazes.jpg',
    ageRating: 0,
    director: 'Tom Ford',
    writers: [
      'Takeshi Kitano'
    ],
    actors: [
      'Morgan Freeman'
    ],
    release: {
      date: '2019-05-11T00:00:00.000Z',
      releaseCountry: 'Finland'
    },
    runtime: 77,
    genre: [
      'Comedy'
    ],
    description: 'Oscar-winning film, a war drama about two young people, from the creators of timeless classic \'Nu, Pogodi!\' and \'Alice in Wonderland\', with the best fight scenes since Bruce Lee.'
  },
  userDetails: {
    watchlist: false,
    alreadyWatched: true,
    watchingDate: '2019-04-12T16:12:32.554Z',
    favorite: false
  }
});
