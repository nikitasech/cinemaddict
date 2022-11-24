import {createElement} from '../render.js';

const createDetailsControlsTemplate = () => (`
  <section class="film-details__controls">
    <button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
    <button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched" id="watched" name="watched">Already watched</button>
    <button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
  </section>
`);

const createCardControlsTemplate = () => (`
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
  </div>
`);

/** Вью кнопок управления. */
export default class FilmControlsView {
  /**
   * @param {string=} rapent Название родительского блока. 'card' или 'details'.
   */
  constructor(rapent = 'card') {
    this.parent = rapent;
  }

  /**
   * @returns {string} Шаблон разметки.
   */
  getTemplate() {
    switch (this.parent) {
      case 'details':
        return createDetailsControlsTemplate();
      default:
        return createCardControlsTemplate();
    }
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
