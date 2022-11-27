import { generateFilm } from '../mock/film.js';
import {shuffleArray} from '../utils.js';

export default class FilmsModel {
  films = Array.from({length: 36}, generateFilm);

  getFilms = () => this.films;

  getTopFilms() {
    return shuffleArray(this.films.slice())
      .sort((before, after) => {
        const beforeRating = before.info.totalRating;
        const afterRating = after.info.totalRating;

        return afterRating - beforeRating;
      });
  }

  getCommentedFilms() {
    return shuffleArray(this.films.slice())
      .sort((before, after) => {
        const beforeCount = before.comments.length;
        const afterCount = after.comments.length;

        return afterCount - beforeCount;
      });
  }
}
