import AbstractView from './../framework/view/abstract-view.js';

const createNewProfileRatingTemplate = (rank) => (`
  <section class="header__profile profile">
    <p class="profile__rating">${rank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>
`);

/**Вью рейтинга пользователя
 * @param {string} rank рейтинг пользователя
 */
export default class ProfileRatingView extends AbstractView {
  #rank = null;

  constructor(rank) {
    super();
    this.#rank = rank;
  }

  get template() {
    return createNewProfileRatingTemplate(this.#rank);
  }
}
