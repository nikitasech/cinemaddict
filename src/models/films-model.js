import {generateFilm} from '../mock/film.js';

export default class FilmsModel {
  #items = Array.from({length: 36}, generateFilm);

  get items() {
    return this.#items;
  }
}
