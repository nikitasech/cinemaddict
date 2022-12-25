import AbstractView from './../framework/view/abstract-view.js';

const createFilmsContainerTemplate = () => (`
  <div class="films-list__container"></div>
`);

/** Преставление контейнера для фильмов, вставляемого в компонент {@link ListFilmsView} */
export default class FilmsContainerView extends AbstractView {
  get template() {
    return createFilmsContainerTemplate();
  }
}
