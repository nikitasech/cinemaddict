import { generateFilm } from '../mock/film.js';

export default class FilmsModel {
  films = Array.from({length: 3}, generateFilm);

  getFilms = () => this.films;
}
