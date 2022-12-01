import {createElement} from '../render.js';
import FilmControlsView from './film-controls-view.js';
import {formatIsoDate, formatRuntime} from './../utils.js';

/**
 * @param {object} film Объект с данными о фильме.
 * @returns {string} Шаблон разметки на основе данных.
 */
const createFilmCardTemplate = (film) => {
  const {title, totalRating, release, genre, poster} = film.info;
  const dateRelease = formatIsoDate(release.date, 'YYYY');
  const runtime = formatRuntime(film.info.runtime);
  const mainGenre = genre[0];
  const countComments = film.comments.length;
  const description = `${film.info.description.slice(0, 139)}…`;
  const stateControls = film.userDetails;

  return (`
    <article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${dateRelease}</span>
          <span class="film-card__duration">${runtime}</span>
          <span class="film-card__genre">${mainGenre}</span>
        </p>
        <img src="./${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${description}</p>
        <span class="film-card__comments">${countComments} comments</span>
      </a>
      ${new FilmControlsView(stateControls).template}
    </article>
  `);
};

/** Вью карточки фильма. */
export default class FilmCardView {
  #element = null;
  #film = null;

  /**
   * @param {object} film Объект с данными о фильме.
   */
  constructor(film) {
    this.#film = film;
  }

  /**
   * @returns {string} Шаблон разметки.
   */
  get template() {
    return createFilmCardTemplate(this.#film);
  }

  /**
   * @returns {nodeObject} DOM-узел разметки.
   */
  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  /**
   * Удаляет DOM-узел из объекта.
   */
  removeElement() {
    this.#element = null;
  }
}
