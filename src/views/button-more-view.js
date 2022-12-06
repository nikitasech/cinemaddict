import AbstractView from './../framework/view/abstract-view.js';

const createMoreButtonTemplate = () => (`
  <button class="films-list__show-more">Show more</button>
`);

/** Вью кнопки "Load more" */
export default class ButtonMoreView extends AbstractView {
  get template() {
    return createMoreButtonTemplate();
  }

  /** Скрывает кнопку */
  hide = () => {
    this.element.setAttribute('hidden', 'true');
  };
}
