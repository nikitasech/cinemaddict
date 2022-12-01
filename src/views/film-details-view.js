import {createElement} from '../render.js';
import {formatIsoDate, formatRuntime} from './../utils.js';
import FilmControlsView from './film-controls-view.js';

const createFilmDetailsTemplate = (film) => {
  const {
    poster, ageRating, title, alternativeTitle,
    totalRating, director, genre, description
  } = film.info;
  const writers = film.info.writers.join(', ');
  const actors = film.info.actors.join(', ');
  const dateRelease = formatIsoDate(film.info.release.date, 'DD MMMM YYYY');
  const countryRelease = film.info.release.country;
  const runtime = formatRuntime(film.info.runtime);
  const stateControls = film.userDetails;

  const genresTemplate = genre.reduce((accumulator, item) => {
    const template = `<span class="film-details__genre">${item}</span>`;
    return accumulator + template;
  }, '');

  return (`
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./${poster}" alt="">
          <p class="film-details__age">${ageRating}+</p>
        </div>
        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${alternativeTitle}</p>
            </div>
            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>
          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dateRelease}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${runtime}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${countryRelease}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">${genresTemplate}</td>
            </tr>
          </table>
          <p class="film-details__film-description">${description}</p>
        </div>
      </div>
      ${new FilmControlsView(stateControls, 'details').getTemplate()}
    </div>
  `);
};

/** Вью блока с подробным описанием фильма. */
export default class FilmDetailsView {
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
  getTemplate() {
    return createFilmDetailsTemplate(this.#film);
  }

  /**
   * @returns {nodeObject} DOM-узел разметки.
   */
  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
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
