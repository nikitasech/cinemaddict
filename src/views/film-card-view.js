import {createElement} from '../render.js';
import FilmControlsView from './film-controls-view.js';

const createFilmCardTemplate = () => (`
  <article class="film-card">
    <a class="film-card__link">
      <h3 class="film-card__title">The Dance of Life</h3>
      <p class="film-card__rating">8.3</p>
      <p class="film-card__info">
        <span class="film-card__year">1929</span>
        <span class="film-card__duration">1h 55m</span>
        <span class="film-card__genre">Musical</span>
      </p>
      <img src="./images/posters/the-dance-of-life.jpg" alt="" class="film-card__poster">
      <p class="film-card__description">Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at a tr…</p>
      <span class="film-card__comments">5 comments</span>
    </a>
    ${new FilmControlsView().getTemplate()}
  </article>
`);


export default class FilmCardView {
  /**
   * @returns {string} Шаблон разметки.
   */
  getTemplate() {
    return createFilmCardTemplate();
  }

  /**
   * @returns {nodeObject} DOM-узел разметки.
   */
  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  /**
   * Удаляет DOM-узел из объекта.
   */
  removeElement() {
    this.element = null;
  }
}
