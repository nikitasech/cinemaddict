import AbstractView from './../framework/view/abstract-view.js';
import {splitNumberToClasses} from './../utils/common.js';

const createStatisticsTemplate = (filmsCount) => (`
    <p>${splitNumberToClasses(filmsCount)} movies inside</p>
`);

/** Вью статистики количества фильмов на сервисе */
export default class StatisticsView extends AbstractView {
  /** @type {number|null} количество фильмов на сервисе */
  #filmsCount = null;

  constructor(filmsCount) {
    super();
    this.#filmsCount = filmsCount;
  }

  get template() {
    return createStatisticsTemplate(this.#filmsCount);
  }
}
