import AbstractView from './../framework/view/abstract-view.js';

const createFilmsTemplate = () => (`
  <section class="films"></section>
`);

/** Вью контейнера списков фильмов */
export default class FilmsView extends AbstractView {
  get template() {
    return createFilmsTemplate();
  }
}
