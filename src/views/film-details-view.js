import AbstractView from './../framework/view/abstract-view.js';
import {formatIsoDate, formatRuntime} from './../utils/common.js';

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
    </div>
  `);
};

/** Представление блока с подробным описанием фильма
 * @param {Object} film данные фильма
 */
export default class FilmDetailsView extends AbstractView {
  #film = {};

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmDetailsTemplate(this.#film);
  }
}
