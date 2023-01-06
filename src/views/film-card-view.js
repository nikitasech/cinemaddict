import AbstractView from './../framework/view/abstract-view.js';
import {formatIsoDate, formatRuntime} from './../utils/common.js';

const createFilmCardTemplate = (film) => {
  const {title, totalRating, release, genre, poster} = film.info;
  const dateRelease = formatIsoDate(release.date, 'YYYY');
  const runtime = formatRuntime(film.info.runtime);
  const mainGenre = genre[0];
  const countComments = film.comments.length;
  const description = `${film.info.description.slice(0, 139)}…`;

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
    </article>
  `);
};

/**
 * Представление карточки фильма
 * @param {Object} film данные фильма
 */
export default class FilmCardView extends AbstractView {
  /** @type {Object|null} данные фильма */
  #film = {};

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  /**
   * Функция обработчика нажатия на карточку фильма
   * @param {Object} evt объект события
   */
  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click(this.#film);
  };

  /**
   * Устанавливает обработчик событий на клик по карточке фильма
   * @param {Function} callback функция для выполнения после выявления события
   */
  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element
      .querySelector('.film-card__link')
      .addEventListener('click', this.#clickHandler);
  };
}
