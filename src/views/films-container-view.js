import AbstractView from './../framework/view/abstract-view.js';

const createFilmsContainerTemplate = () => (`
    <div class="films-list__container"></div>
`);

/** Вью контейнера для фильмов в списке */
export default class FilmsContainerView extends AbstractView {
  get template() {
    return createFilmsContainerTemplate();
  }
}
