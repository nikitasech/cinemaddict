import { TypeFilter } from './../const.js';

export const filter = (films, type) => films.filter((film) => {
  const isFilter = {
    [TypeFilter.ALL]: true,
    [TypeFilter.WATCHLIST]: film.userDetails.watchlist,
    [TypeFilter.HISTORY]: film.userDetails.alreadyWatched,
    [TypeFilter.FAVORITE]: film.userDetails.favorite
  };

  return isFilter[type];
});
