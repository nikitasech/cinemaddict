import Observable from './../framework/observable.js';

/** Модель комментариев. */
export default class CommentsModel extends Observable {
  #apiService;
  #items = new Map();

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  /** Возвращает комментарии к фильму
   * @param {number} filmId id нужного фильма
   * @returns {Array} список комментариев
   */
  getItems = async (filmId) => {
    if (!this.#items.get(filmId)) {
      try {
        const comments = await this.#apiService.getItems(filmId);
        this.#items.set(filmId, comments);
      } catch (err) {
        return [];
      }
    }

    return this.#items.get(filmId);
  };

  /** Добавляет новый комментарий
   * @param {Array} typeUpdate
   * @param {Object} newComment
   */
  addItem = (typeUpdate, newItem) => {
    this.#items.push(newItem);
  };

  /** Удаляет комментарий
   * @param {Array} typeUpdate
   * @param {Object} deletedItem
   */
  removeItem = (typeUpdate, deletedItem) => {
    const deletedFilmIndex = this.#items
      .findIndex((item) => item.id === deletedItem.id);

    this.#items.splice(deletedFilmIndex, 1);
  };
}
