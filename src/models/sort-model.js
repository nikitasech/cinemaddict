import { TypeSort, TypeUpdate } from '../const.js';
import Observable from '../framework/observable.js';
import {shuffleArray} from '../utils/common.js';

const sortByDate = (items, count) => shuffleArray(items.slice())
  .sort((before, after) => {
    const beforeDate = Date.parse(before.info.release.date);
    const afterDate = Date.parse(after.info.release.date);

    return afterDate - beforeDate;
  })
  .slice(0, count);

const sortByRating = (items, count) => shuffleArray(items.slice())
  .sort((before, after) => {
    const beforeRating = before.info.totalRating;
    const afterRating = after.info.totalRating;

    return afterRating - beforeRating;
  })
  .slice(0, count);

const sortByComments = (items, count) => shuffleArray(items.slice())
  .sort((before, after) => {
    const beforeCount = before.comments.length;
    const afterCount = after.comments.length;

    return afterCount - beforeCount;
  })
  .slice(0, count);

export default class SortModel extends Observable {
  #activeItem = TypeSort.DEFAULT;

  get activeItem() {
    return this.#activeItem;
  }

  set activeItem(newActiveItem) {
    if (this.#activeItem === newActiveItem) {
      return;
    }

    this.#activeItem = newActiveItem;
    this._notify(TypeUpdate.MINOR, this.#activeItem);
  }

  resetItem = () => {
    this.activeItem = TypeSort.DEFAULT;
  };

  sort = (films, typeSort = this.#activeItem) => {
    switch (typeSort) {
      case TypeSort.DATE:
        return sortByDate(films);
      case TypeSort.RATING:
        return sortByRating(films);
      case TypeSort.COMMENTED:
        return sortByComments(films);
    }

    return films;
  };
}
